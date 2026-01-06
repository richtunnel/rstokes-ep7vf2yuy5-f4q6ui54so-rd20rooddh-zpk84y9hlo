import { DataSource } from "typeorm";
import { User, Organization, RoleEntity, Task } from "@task-mgmt/data";
import * as bcrypt from "bcryptjs";

// seeds initial database with test data
async function seed() {
  const dataSource = new DataSource({
    type: "sqlite",
    database: "tasks.db",
    entities: [User, Organization, RoleEntity, Task],
    synchronize: true,
  });

  await dataSource.initialize();

  const ownerRole = await dataSource.manager.save(RoleEntity, { name: "owner" });
  const adminRole = await dataSource.manager.save(RoleEntity, { name: "admin" });
  const viewerRole = await dataSource.manager.save(RoleEntity, { name: "viewer" });

  const org1 = await dataSource.manager.save(Organization, { name: "Acme Corp" });
  const org2 = await dataSource.manager.save(Organization, {
    name: "Acme Labs",
    parentOrganizationId: org1.id,
  });

  const ownerPassword = await bcrypt.hash("owner123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);
  const viewerPassword = await bcrypt.hash("viewer123", 10);

  const owner = await dataSource.manager.save(User, {
    email: "owner@acme.com",
    password: ownerPassword,
    name: "Owner User",
    organizationId: org1.id,
    roleId: ownerRole.id,
  });

  const admin = await dataSource.manager.save(User, {
    email: "admin@acme.com",
    password: adminPassword,
    name: "Admin User",
    organizationId: org1.id,
    roleId: adminRole.id,
  });

  const viewer = await dataSource.manager.save(User, {
    email: "viewer@acme.com",
    password: viewerPassword,
    name: "Viewer User",
    organizationId: org1.id,
    roleId: viewerRole.id,
  });

  await dataSource.manager.save(Task, {
    title: "Design new dashboard",
    description: "Update UI for task management",
    category: "work",
    status: "in-progress",
    organizationId: org1.id,
    createdById: admin.id,
    order: 1,
  });

  await dataSource.manager.save(Task, {
    title: "Fix authentication bug",
    description: "JWT token not refreshing",
    category: "work",
    status: "pending",
    organizationId: org1.id,
    createdById: admin.id,
    order: 2,
  });

  await dataSource.manager.save(Task, {
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    category: "personal",
    status: "pending",
    organizationId: org1.id,
    createdById: viewer.id,
    order: 1,
  });

  console.log("database seeded successfully");
  console.log("test credentials:");
  console.log("owner: owner@acme.com / owner123");
  console.log("admin: admin@acme.com / admin123");
  console.log("viewer: viewer@acme.com / viewer123");

  await dataSource.destroy();
}

seed().catch(console.error);
