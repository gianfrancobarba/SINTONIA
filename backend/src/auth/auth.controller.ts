import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: any) {
        console.log('Login request received:', body);
        const { email, password } = body;
        try {
            const result = await this.authService.validateUserAny(email, password);
            console.log('Validation result:', result ? 'Success' : 'Failure');

            if (!result) {
                throw new UnauthorizedException('Invalid credentials');
            }

            return this.authService.login(result.user, result.role);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }



    @Get('reset-admin')
    async resetAdminPassword() {
        return this.authService.resetAdminPassword();
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    async changePassword(@Request() req, @Body() body: { currentPassword: string; newPassword: string }) {
        // req.user is populated by JwtStrategy (from the token payload)
        // The payload structure in AuthService.login is { email: ..., sub: ..., role: ... }
        const email = req.user.email;
        return this.authService.changePassword(email, body.currentPassword, body.newPassword);
    }
}
