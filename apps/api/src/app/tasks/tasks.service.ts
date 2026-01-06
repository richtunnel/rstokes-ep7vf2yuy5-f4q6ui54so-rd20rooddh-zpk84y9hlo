import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task, AuditLog, CreateTaskDto, UpdateTaskDto } from "@task-mgmt/data";

@Injectable()
export class TasksService {
  // handles task operations with rbac enforcement
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(AuditLog) private auditRepo: Repository<AuditLog>
  ) {}

  async create(dto: CreateTaskDto, user: any): Promise<Task> {
    const task = this.taskRepo.create({
      ...dto,
      organizationId: user.organizationId,
      createdById: user.id,
    });
    await this.auditLog(user.id, "CREATE", "task", task.id, dto);
    return this.taskRepo.save(task);
  }

  async list(user: any, status?: string): Promise<Task[]> {
    const query = this.taskRepo.createQueryBuilder("task").where("task.organizationId = :orgId", { orgId: user.organizationId });

    if (user.role === "viewer") {
      query.andWhere("task.createdById = :userId", { userId: user.id });
    }

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    return query.orderBy("task.order", "ASC").getMany();
  }

  async update(id: string, dto: UpdateTaskDto, user: any): Promise<Task> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException("task not found");

    this.validateAccess(task, user);
    Object.assign(task, dto);
    await this.auditLog(user.id, "UPDATE", "task", id, dto);
    return this.taskRepo.save(task);
  }

  async delete(id: string, user: any): Promise<void> {
    const task = await this.taskRepo.findOne({ where: { id } });
    if (!task) throw new NotFoundException("task not found");

    this.validateAccess(task, user);
    await this.auditLog(user.id, "DELETE", "task", id, {});
    await this.taskRepo.remove(task);
  }

  async getAuditLog(user: any): Promise<AuditLog[]> {
    return this.auditRepo.find({
      where: { userId: user.id },
      order: { createdAt: "DESC" },
      take: 100,
    });
  }

  private validateAccess(task: Task, user: any): void {
    if (user.role === "viewer" && task.createdById !== user.id) {
      throw new ForbiddenException("cannot modify other users tasks");
    }
  }

  private async auditLog(userId: string, action: string, resource: string, resourceId: string, details: any): Promise<void> {
    await this.auditRepo.save({
      userId,
      action,
      resource,
      resourceId,
      details: JSON.stringify(details),
    });
  }
}
