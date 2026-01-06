import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Organization, (org) => org.users)
  organization!: Organization;

  @Column()
  organizationId!: string;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  role!: RoleEntity;

  @Column()
  roleId!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Organization, { nullable: true })
  parentOrganization!: Organization;

  @Column({ nullable: true })
  parentOrganizationId!: string;

  @OneToMany(() => Organization, (org) => org.parentOrganization)
  childOrganizations!: Organization[];

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];

  @OneToMany(() => Task, (task) => task.organization)
  tasks!: Task[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('roles')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];

  @CreateDateColumn()
  createdAt!: Date;
}

@Entity('tasks')
@Index(['organizationId', 'createdById'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'in-progress' | 'completed';

  @Column({ default: 'personal' })
  category!: string;

  @Column({ default: 0 })
  order!: number;

  @ManyToOne(() => Organization)
  organization!: Organization;

  @Column()
  organizationId!: string;

  @ManyToOne(() => User)
  createdBy!: User;

  @Column()
  createdById!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  action!: string;

  @Column()
  resource!: string;

  @Column()
  resourceId!: string;

  @Column({ nullable: true })
  details!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
