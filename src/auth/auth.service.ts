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
import { GoogleDto } from './dto/google.dto';
import { OAuth2Client } from 'google-auth-library';

type UserOrNull = User | null;

@Injectable()
export class AuthService {
  oauthClient: OAuth2Client;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    this.oauthClient = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_SECRET,
    );
  }

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

  async validateGoogleAccount(googleDto: GoogleDto): Promise<User> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: googleDto.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (payload) {
      const googleUser = { email: payload['email'], name: payload['name'] };
      let user: User;
      try {
        user = await this.usersService.findOneByEmail(googleUser.email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          const registerDto: RegisterDto = {
            email: googleUser.email,
            name: googleUser.name,
            password: '',
          };
          user = await this.usersService.create(registerDto);
        } else {
          throw new ForbiddenException();
        }
      }
      return user;
    }
    throw new ForbiddenException();
  }

  async googleLogin(googleDto: GoogleDto) {
    const user = await this.validateGoogleAccount(googleDto);

    const payload = { userId: user.id, userEmail: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
