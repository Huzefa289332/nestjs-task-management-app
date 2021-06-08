import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignupCredentialsDto } from './dto/signup-credentials.dto';
import { User, UserDocument } from './user.entity';
import { SigninCredentialsDto } from './dto/signin-credentials.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signup(
    signupCredentialsDto: SignupCredentialsDto,
  ): Promise<AuthResponseDto> {
    let { username, email, password } = signupCredentialsDto;
    const salt = await bcrypt.genSalt();
    password = await this.hashPassword(password, salt);
    const user = new this.userModel({ username, email, password, salt });
    try {
      await user.save();
      const payload: JwtPayload = { email: user.email };
      const accessToken = this.jwtService.sign(payload);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        accessToken,
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Email already exists.');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signin(
    signinCredentialsDto: SigninCredentialsDto,
  ): Promise<AuthResponseDto> {
    const { email, password } = signinCredentialsDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!(await this.validatePassword(password, user.password, user.salt))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { email: user.email };
    const accessToken = this.jwtService.sign(payload);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      accessToken,
    };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    suppliedPassword: string,
    storedPassword: string,
    salt: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(suppliedPassword, salt);
    return storedPassword === hash;
  }
}
