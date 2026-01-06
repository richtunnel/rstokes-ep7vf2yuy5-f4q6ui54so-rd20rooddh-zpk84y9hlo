export class CreateTaskDto {
  title?: string;
  description?: string;
  category?: string;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string;
  category?: string;
  order?: number;
}

export class CreateUserDto {
  email?: string;
  password?: string;
  name?: string;
  roleId?: string;
}

export class LoginDto {
  email?: string;
  password?: string;
}

export class TokenDto {
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
    organizationId: string;
  };
}
