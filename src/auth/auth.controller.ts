import {
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { UserDocument } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto,
  ): Promise<AuthResponseDto> {
    return this.authService.signup(signupCredentialsDto);
  }

  @Post('signin')
  async signin(
    @Body(ValidationPipe) signinCredentialsDto: SigninCredentialsDto,
  ): Promise<AuthResponseDto> {
    return this.authService.signin(signinCredentialsDto);
  }

  @Post('test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: UserDocument) {
    console.log(user);
  }
}
