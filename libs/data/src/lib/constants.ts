export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

export const RoleHierarchy: Record<Role, Role[]> = {
  [Role.OWNER]: [Role.OWNER, Role.ADMIN, Role.VIEWER],
  [Role.ADMIN]: [Role.ADMIN, Role.VIEWER],
  [Role.VIEWER]: [Role.VIEWER],
};
