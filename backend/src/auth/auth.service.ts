import { Injectable, Inject } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { UpdateAuthDto } from './dto/update-auth.dto.js';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../drizzle/schema.js';
import { JwtService } from '@nestjs/jwt';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('drizzle') private db: NodePgDatabase<typeof schema>,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string, role: 'admin' | 'psychologist'): Promise<any> {
        let user: any;
        try {
            console.log(`Attempting login for ${email} with role ${role}`);
            if (role === 'admin') {
                const users = await this.db.select().from(schema.amministratore).where(eq(schema.amministratore.email, email));
                user = users[0];
            }

            if (user) {
                console.log('User found:', user.email);
                const storedHash = user.pw || user.password;
                console.log('Stored hash length:', storedHash?.length);
                const isMatch = await bcrypt.compare(pass, storedHash);
                console.log('Password match:', isMatch);

                if (isMatch) {
                    const { password, pw, ...result } = user;
                    return result;
                }
            } else {
                console.log('User not found in database');
            }
        } catch (e) {
            console.error('Error in validateUser:', e);
        }
        return null;
    }

    async validateUserAny(email: string, pass: string): Promise<{ user: any, role: 'admin' | 'psychologist' } | null> {
        // Check Admin
        const admin = await this.validateUser(email, pass, 'admin');
        if (admin) {
            return { user: admin, role: 'admin' };
        }

        // Check Psychologist
        const psychologist = await this.validateUser(email, pass, 'psychologist');
        if (psychologist) {
            return { user: psychologist, role: 'psychologist' };
        }

        return null;
    }

    async login(user: any, role: 'admin' | 'psychologist') {
        const payload = { email: user.email || user.codFiscale, sub: user.email || user.codFiscale, role: role };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async resetAdminPassword() {
        const email = 'alessio.delsorbo@gmail.com';
        const password = '123';
        const hash = await bcrypt.hash(password, 10);

        await this.db.update(schema.amministratore)
            .set({ pw: hash })
            .where(eq(schema.amministratore.email, email));

        return { message: 'Password reset successfully', hashLength: hash.length };
    }

    async changePassword(email: string, newPass: string) {
        const hash = await bcrypt.hash(newPass, 10);
        await this.db.update(schema.amministratore)
            .set({ pw: hash })
            .where(eq(schema.amministratore.email, email));
        return { message: 'Password updated successfully' };
    }
}
