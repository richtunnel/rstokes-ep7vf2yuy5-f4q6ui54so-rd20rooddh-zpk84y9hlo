import { SetMetadata, createParamDecorator, ExecutionContext } from "@nestjs/common";

// sets required role for endpoint
export const RequireRole = (role: string) => SetMetadata("role", role);

// extracts user from request
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
