import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from "@nestjs/common";
import { JwtAuthGuard, RequireRole, CurrentUser } from "@task-mgmt/auth";
import { CreateTaskDto, UpdateTaskDto } from "@task-mgmt/data";
import { TasksService } from "./tasks.service";

@Controller("tasks")
@UseGuards(JwtAuthGuard)
export class TasksController {
  // manages task crud operations with role-based access
  constructor(private tasksService: TasksService) {}

  @Post()
  create(@Body() dto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(dto, user);
  }

  @Get()
  list(@CurrentUser() user: any, @Query("status") status?: string) {
    return this.tasksService.list(user, status);
  }

  @Put(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.update(id, dto, user);
  }

  @Delete(":id")
  delete(@Param("id") id: string, @CurrentUser() user: any) {
    return this.tasksService.delete(id, user);
  }

  @Get("audit-log")
  @RequireRole("admin")
  getAuditLog(@CurrentUser() user: any) {
    return this.tasksService.getAuditLog(user);
  }
}
