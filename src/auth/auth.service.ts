import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type UserOrNull = User | null;

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

    const payload = { userId: user.id, userEmail: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
