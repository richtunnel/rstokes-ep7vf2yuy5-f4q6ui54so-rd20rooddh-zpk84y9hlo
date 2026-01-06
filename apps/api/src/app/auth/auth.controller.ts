import { Controller, Post, Body } from "@nestjs/common";
import { LoginDto, TokenDto } from "@task-mgmt/data";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  // handles user login and jwt token generation
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto): Promise<TokenDto> {
    return this.authService.login(dto);
  }
}
