import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
    organizationId: string;
    role: string;
  };
}

class LoginDto {
  email: string;
  password: string;
}

class RegisterDto {
  email: string;
  password: string;
  name?: string;
  organizationName?: string;
}

@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Logga in med e-post och lösenord' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto): Promise<AuthResponse> {
    return this.authService.validateUser(body.email, body.password);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrera nytt konto' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() body: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(
      body.email,
      body.password,
      body.name,
      body.organizationName,
    );
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Uppdatera access token' })
  async refresh(@Req() req: AuthenticatedRequest): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(req.user.sub);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hämta inloggad användares information' })
  async me(@Req() req: AuthenticatedRequest) {
    return {
      userId: req.user.sub,
      email: req.user.email,
      organizationId: req.user.organizationId,
      role: req.user.role,
    };
  }
}
