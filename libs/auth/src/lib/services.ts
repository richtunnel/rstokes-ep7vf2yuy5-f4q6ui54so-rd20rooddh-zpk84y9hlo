import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  // handles jwt token generation and password hashing
  constructor(private jwtService: JwtService) {}

  generateToken(payload: any, secret: string, expiresIn: string = "24h"): string {
    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
