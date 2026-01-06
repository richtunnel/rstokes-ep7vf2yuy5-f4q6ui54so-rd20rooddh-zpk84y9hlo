import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, CreateUserDto } from '@task-mgmt/data';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  // manages user creation and queries
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(dto: CreateUserDto, organizationId: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.userRepo.save({
      ...dto,
      password: hashedPassword,
      organizationId,
    });
  }

  async findById(id: string): Promise<User> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['role', 'organization'],
    });
  }
}
