import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { User, LoginDto, TokenDto } from "@task-mgmt/data";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  // authenticates user and returns jwt token
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async login(dto: LoginDto): Promise<TokenDto> {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      relations: ["role", "organization"],
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("invalid credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role.name,
      organizationId: user.organizationId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: { ...payload, name: user.name },
    };
  }
}
