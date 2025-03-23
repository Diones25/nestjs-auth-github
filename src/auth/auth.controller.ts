import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

declare module 'express-session' {
  interface SessionData {
    accessToken: string;
    refreshToken: string;
  }
}

@Controller('auth')
export class AuthController {

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() { }
  
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))

  async githubLoginCallback(@Req() req, @Res() res: Response) {

    if (!req.user) {
      return res.redirect('/auth/github');
    }

    const { accessToken, refreshToken } = req.user as any;

    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;

    return res.redirect('/auth/profile');
  }

  @Get('profile')
  async profile(@Req() req: Request) {
    const accessToken = req.session.accessToken;
    const refreshToken = req.session.refreshToken;

    return { accessToken, refreshToken }
  }
}
