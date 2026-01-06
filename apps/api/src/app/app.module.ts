import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User, Organization, RoleEntity, Task, AuditLog } from '@task-mgmt/data';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { UsersService } from './users/users.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_URL || 'tasks.db',
      entities: [User, Organization, RoleEntity, Task, AuditLog],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([User, Organization, RoleEntity, Task, AuditLog]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AppController, AuthController, TasksController],
  providers: [AppService, AuthService, TasksService, UsersService],
})
export class AppModule {}
