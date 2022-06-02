import {
  Get,
  Res,
  Post,
  Body,
  UseGuards,
  Controller,
  UploadedFile,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { join } from 'path';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';

import { Role } from './enums/role.enum';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { config } from './file-interceptor.config';
import { Roles } from './decorators/roles.decorator';
import { GetCurrentUserDecorator } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { SignInWithSocialDto } from './dto/sigin-social.dto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post('/signup')
  signupLocal(@Body() signUpDto: SignUpDto) {
    return this.usersService.signup(signUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post('/signin')
  signinLocal(@Body() signInDto: SignInDto) {
    return this.usersService.signin(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post('/facebook')
  async facebookLoginRedirect(
    @Body() signInFbDto: SignInWithSocialDto,
  ): Promise<any> {
    return this.usersService.signUpWithSocialMedia(signInFbDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @Post('/google')
  async googleLoginRedirect(
    @Body() signInFbDto: SignInWithSocialDto,
  ): Promise<any> {
    return this.usersService.signUpWithSocialMedia(signInFbDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  @Roles(Role.Admin, Role.User)
  logout(@GetCurrentUserDecorator() user) {
    return this.usersService.logout(user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  @Roles(Role.Admin, Role.User)
  async getProfile(@GetCurrentUserDecorator() user: User) {
    // remove properties not use
    return this.usersService.removePrivateUserData(user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.User)
  @UseGuards(JwtAuthGuard)
  @Post('/profile/image')
  @Roles(Role.Admin, Role.User)
  @UseInterceptors(FileInterceptor(config.fieldName, config.localOptions))
  updateImage(@UploadedFile() image, @GetCurrentUserDecorator() user) {
    return this.usersService.updateImage(user, image);
  }
}
