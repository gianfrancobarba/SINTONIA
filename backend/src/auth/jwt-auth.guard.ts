import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // Placeholder implementation: Allow all requests and mock a user
        const request = context.switchToHttp().getRequest();
        request.user = { id: 1, email: 'test@example.com' }; // Mock user
        return true;
    }
}
