import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type UserOrNull = User | null;

type GoogleUser = {
  email: string;
  firstName: string;
  lastName: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserOrNull> {
    const user = await this.usersService.findOneWithPasswordByEmail(email);
    if (user == null) {
      throw new NotFoundException('User not found!');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      return user;
    }
    throw new ForbiddenException();
  }

  async login(loginDto: LoginDto) {
    const user: User = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    const payload = { userId: user.id, userEmail: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);

    const payload = { userId: user.id, userEmail: user.email.toLowerCase() };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  validateEmail(email: string) {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
    return regexp.test(email);
  }

  async googleLogin(req: { user: any | undefined }) {
    if (!req.user) {
      throw new InternalServerErrorException('No user from google');
    }
    const googleUser = req.user as GoogleUser;

    let user = undefined;
    try {
      user = await this.usersService.findOneByEmail(googleUser.email);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const registerDto: RegisterDto = {
          email: googleUser.email,
          name: `${googleUser.firstName} ${googleUser.lastName}`,
          password: '',
        };
        user = await this.usersService.create(registerDto);
      } else {
        throw new InternalServerErrorException();
      }
    }

    const payload = { userId: user.id, userEmail: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
