import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { UserRepository } from '../../users/repositories/userRepository';
import { StudentRepository } from '../../students/repositories/studentRepository';
import { User, UserRole } from '../../../types';
import { AppError } from '../../../middlewares/errorHandler';
import { DBStore } from '../../../services/dbStore';

const JWT_SECRET = process.env.JWT_SECRET || 'nydev-learning-master-secret-key-2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nyproto-refresh-secret-jwt-key-2026';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

function sanitizeUser(user: User): User {
  const { passwordHash, ...safeUser } = user;
  return safeUser as User;
}

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private studentRepository?: StudentRepository
  ) {}

  async signup(signupData: { name: string; email: string; password: string; role: UserRole }): Promise<{ token: string; refreshToken: string; user: User }> {
    const { name, email, password, role } = signupData;

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new AppError('A user with this email address already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({
      name,
      firstName: name.split(' ')[0] || name,
      lastName: name.split(' ').slice(1).join(' ') || name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Auto-create StudentProfile if registering as STUDENT
    if (role.toUpperCase() === 'STUDENT' && this.studentRepository) {
      const studentCode = `STU-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
      await this.studentRepository.create({
        userId: user.id,
        studentCode,
        currentLevel: 'Beginner',
        graduationStatus: 'ACTIVE',
      });
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY as any });
    const refreshToken = jwt.sign(
      { userId: user.id, tokenVersion: user.refreshTokenVersion || 1 },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY as any }
    );

    await DBStore.logActivity(user.id, user.name, 'USER_SIGNUP', `Created account with role: ${role}`);

    return { token: accessToken, refreshToken, user: sanitizeUser(user) };
  }

  async login(loginData: { email: string; password: string }): Promise<{ token: string; refreshToken: string; user: User }> {
    const { email, password } = loginData;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.passwordHash) {
      throw new AppError('This account was created using GitHub. Please log in with GitHub.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY as any });
    const refreshToken = jwt.sign(
      { userId: user.id, tokenVersion: user.refreshTokenVersion || 1 },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY as any }
    );

    await DBStore.logActivity(user.id, user.name, 'USER_LOGIN', 'Logged into the platform successfully.');

    return { token: accessToken, refreshToken, user: sanitizeUser(user) };
  }

  async updateProfile(userId: string, updateData: { name?: string; avatar?: string }): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updated = await this.userRepository.update(userId, updateData);
    if (!updated) {
      throw new AppError('Failed to update user', 500);
    }

    await DBStore.logActivity(user.id, user.name, 'USER_UPDATE', `Updated user profile metadata`);

    return sanitizeUser(updated);
  }

  async refreshTokens(refreshToken: string): Promise<{ token: string; refreshToken: string; user: User }> {
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      throw new AppError('Invalid or expired refresh token. Please login again.', 401);
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found.', 401);
    }

    if (user.isBlocked) {
      throw new AppError('Your account has been blocked. Contact support.', 403);
    }

    if (user.refreshTokenVersion !== decoded.tokenVersion) {
      throw new AppError('Refresh token was revoked. Please login again.', 401);
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY as any });
    const newRefreshToken = jwt.sign(
      { userId: user.id, tokenVersion: user.refreshTokenVersion || 1 },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY as any }
    );

    return { token: accessToken, refreshToken: newRefreshToken, user: sanitizeUser(user) };
  }

  async logout(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (user) {
      const nextVersion = (user.refreshTokenVersion || 1) + 1;
      await this.userRepository.update(userId, { refreshTokenVersion: nextVersion });
      await DBStore.logActivity(user.id, user.name, 'USER_LOGOUT', 'Logged out and revoked refresh tokens.');
    }
  }

  async githubAuth(code: string): Promise<{ token: string; refreshToken: string; user: User }> {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new AppError('GitHub OAuth credentials are not configured on the server.', 500);
    }

    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const githubToken = tokenRes.data.access_token;
    if (!githubToken) {
      throw new AppError(tokenRes.data.error_description || 'Failed to retrieve GitHub access token.', 400);
    }

    const userRes = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        'User-Agent': 'NYDL-Auth-App',
      },
    });

    const githubUser = userRes.data;
    const githubId = String(githubUser.id);

    let email = githubUser.email;
    if (!email) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${githubToken}`,
          'User-Agent': 'NYDL-Auth-App',
        },
      });
      const primaryEmail = emailsRes.data.find((e: any) => e.primary && e.verified);
      email = primaryEmail ? primaryEmail.email : emailsRes.data[0]?.email;
    }

    if (!email) {
      throw new AppError('No verified email address found on your GitHub profile.', 400);
    }

    let user = await this.userRepository.findByEmail(email);

    if (user) {
      if (!user.githubId || user.authProvider !== 'GITHUB') {
        user = await this.userRepository.update(user.id, {
          githubId,
          authProvider: 'GITHUB',
        }) || user;
      }
    } else {
      const name = githubUser.name || githubUser.login || 'GitHub User';
      user = await this.userRepository.create({
        name,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || name,
        email: email.toLowerCase(),
        avatar: githubUser.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        githubId,
        authProvider: 'GITHUB',
        role: 'STUDENT',
        isEmailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
        isActive: true,
        isBlocked: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (this.studentRepository) {
        const studentCode = `STU-${Date.now().toString().slice(-6)}${Math.floor(10 + Math.random() * 90)}`;
        await this.studentRepository.create({
          userId: user.id,
          studentCode,
          currentLevel: 'Beginner',
          graduationStatus: 'ACTIVE',
        });
      }
    }

    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY as any });
    const refreshToken = jwt.sign(
      { userId: user.id, tokenVersion: user.refreshTokenVersion || 1 },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY as any }
    );

    await DBStore.logActivity(user.id, user.name, 'USER_GITHUB_LOGIN', 'Logged into the platform via GitHub OAuth successfully.');

    return { token: accessToken, refreshToken, user: sanitizeUser(user) };
  }
}
