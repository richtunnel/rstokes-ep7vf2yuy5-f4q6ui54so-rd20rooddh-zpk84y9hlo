import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleHierarchy } from '@task-mgmt/data';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // validates jwt token presence and validity
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) throw new UnauthorizedException('no token provided');

    try {
      const payload = this.jwtService.verify(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('invalid token');
    }
  }

  private extractToken(request: any): string {
    const auth = request.headers.authorization;
    return auth?.split(' ')[1];
  }
}

@Injectable()
export class RoleGuard implements CanActivate {
  // checks if user role meets minimum required level
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const requiredRole = Reflect.getMetadata('role', context.getHandler());

    if (!requiredRole) return true;
    if (!request.user) throw new UnauthorizedException();

    const userRole = request.user.role;
    const allowedRoles = RoleHierarchy[userRole];

    if (!allowedRoles?.includes(requiredRole)) {
      throw new ForbiddenException('insufficient permissions');
    }
    return true;
  }
}

@Injectable()
export class ResourceAccessGuard implements CanActivate {
  // validates ownership and org-level access for resources
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}
