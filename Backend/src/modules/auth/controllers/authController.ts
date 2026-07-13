import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../../../middlewares/auth';
import { AppError } from '../../../middlewares/errorHandler';


export class AuthController {
  constructor(private authService: AuthService) {}

  async signup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { name, email, password, role } = req.body;
    try {
      const result = await this.authService.signup({ name, email, password, role });
      res.cookie('nydl_refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.status(201).json({
        status: 'success',
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const result = await this.authService.login({ email, password });
      res.cookie('nydl_refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({
        status: 'success',
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const token = req.cookies?.nydl_refresh_token || req.body.refreshToken;
    if (!token) {
      return next(new AppError('No refresh token provided', 401));
    }
    try {
      const result = await this.authService.refreshTokens(token);
      res.cookie('nydl_refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });
      res.json({
        status: 'success',
        data: {
          token: result.token,
          user: result.user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    const userId = req.user?.id;
    try {
      if (userId) {
        await this.authService.logout(userId);
      }
      res.clearCookie('nydl_refresh_token');
      res.json({
        status: 'success',
        message: 'Successfully logged out'
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    res.json({
      status: 'success',
      data: {
        user: req.user
      }
    });
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    if (!req.user) {
      return next(new AppError('Not authenticated', 401));
    }
    const { name, avatar, phone } = req.body;
    try {
      const updatedUser = await this.authService.updateProfile(req.user.id, { name, avatar, phone });
      res.json({
        status: 'success',
        data: {
          user: updatedUser
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async githubRedirect(req: Request, res: Response, next: NextFunction): Promise<void> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL;

    if (!clientId) {
      return next(new AppError('GitHub OAuth credentials are not configured on the server.', 500));
    }

    // Encode the originating frontend URL into state so callback knows where to redirect
    const from = (req.query.from as string) || process.env.CLIENT_URL || 'http://localhost:5173';
    const state = Buffer.from(JSON.stringify({ from })).toString('base64');

    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}${redirectUri ? `&redirect_uri=${encodeURIComponent(redirectUri)}` : ''}&scope=read:user,user:email&state=${encodeURIComponent(state)}`;
    res.redirect(githubUrl);
  }

async githubCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { code, state } = req.query;
  if (!code) {
    return next(new AppError('No authorization code provided from GitHub.', 400));
  }

  try {
    const result = await this.authService.githubAuth(String(code));
    
    res.cookie('nydl_refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Handle comma-separated CLIENT_URLs
    const allowedClientUrls = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');
    let clientUrl = allowedClientUrls[0]; // Default to the first URL in the list

    if (state) {
      try {
        const decoded = JSON.parse(Buffer.from(String(state), 'base64').toString());
        // Verify that the requested 'from' URL is in our allowed list
        if (decoded.from && allowedClientUrls.includes(decoded.from)) {
          clientUrl = decoded.from;
        }
      } catch {
        // Fall back to default (allowedClientUrls[0]) on parse error
      }
    }

    res.redirect(`${clientUrl}/oauth-callback?token=${result.token}`);
  } catch (error) {
    next(error);
  }
}
}
