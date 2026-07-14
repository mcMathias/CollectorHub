import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if email or username already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Generate verification token
    const verifyToken = uuidv4();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        displayName: dto.displayName,
        passwordHash,
        verifyToken,
        verifyExpires,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto, userAgent?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const tokens = await this.generateTokens(user.id, user.email, userAgent, ipAddress);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string, userAgent?: string, ipAddress?: string) {
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!storedToken.user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Revoke old token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // Generate new tokens
    const tokens = await this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      userAgent,
      ipAddress,
    );

    return {
      user: {
        id: storedToken.user.id,
        email: storedToken.user.email,
        username: storedToken.user.username,
        displayName: storedToken.user.displayName,
        avatar: storedToken.user.avatar,
        emailVerified: storedToken.user.emailVerified,
      },
      ...tokens,
    };
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  async logoutAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  // ── Email Verification Structure ──

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({
      where: { verifyToken: token },
    });

    if (!user || !user.verifyExpires || user.verifyExpires < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verifyToken: null,
        verifyExpires: null,
      },
    });

    return { message: 'Email verified successfully' };
  }

  // ── Password Reset Structure ──

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetExpires },
    });

    // TODO: Send email with reset link
    // await this.mailService.sendPasswordReset(user.email, resetToken);

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user || !user.resetExpires || user.resetExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetToken: null,
        resetExpires: null,
      },
    });

    // Revoke all refresh tokens for security
    await this.logoutAll(user.id);

    return { message: 'Password reset successfully' };
  }

  // ── Private Helpers ──

  private async generateTokens(
    userId: string,
    email: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email }, {
      secret: this.configService.get<string>('JWT_SECRET')!,
      expiresIn: '15m',
    });

    const refreshToken = uuidv4();
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(refreshExpiresIn, 10) || 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        expiresAt,
        userId,
        userAgent,
        ipAddress,
      },
    });

    return { accessToken, refreshToken };
  }
}
