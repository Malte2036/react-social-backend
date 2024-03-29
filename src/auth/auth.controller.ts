import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { GoogleDto } from './dto/google.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    if (!this.authService.validateEmail(registerDto.email)) {
      throw new BadRequestException('Email invalid!');
    }
    return await this.authService.register(registerDto);
  }

  @Post('google')
  async googleAuth(@Body() googleDto: GoogleDto) {
    return await this.authService.googleLogin(googleDto);
  }
}
