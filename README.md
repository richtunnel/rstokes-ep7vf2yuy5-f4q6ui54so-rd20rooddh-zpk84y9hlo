# Task Management System - Secure RBAC Implementation

Secure Task Management System with Role-Based Access Control (RBAC) using NX monorepo, NestJS backend, and Angular frontend.

## Quick Start (Yarn)

### Prerequisites

- Node.js 18+ (recommend using nvm)
- Yarn 4.x

### Setup Node.js with nvm (Mac)

```bash
nvm install 18
nvm use 18
nvm alias default 18

node --version  # verify v18.x.x or higher
```

### Install Yarn

```bash
npm install -g yarn

yarn --version  # verify 4.x.x or higher
```

### 5-Minute Setup

```bash
cd task-management-system

yarn install

yarn db:seed

yarn serve api        # Terminal 1: starts backend on :3333
yarn serve dashboard  # Terminal 2: starts frontend on :4200
```

Navigate to `http://localhost:4200` and login with:

- Email: `admin@acme.com`
- Password: `admin123`

## Yarn Commands Reference

```bash
yarn install              # install all dependencies
yarn serve                # start all apps
yarn serve api            # start backend only
yarn serve dashboard      # start frontend only
yarn build                # build all apps
yarn test                 # run all tests
yarn lint                 # lint all code
yarn format               # auto-format code
yarn db:seed              # seed database with test data
yarn db:fresh             # reset and reseed database
yarn nx --version         # check nx version
yarn nx reset             # reset nx cache
```

### Common Yarn Operations

```bash
yarn add <package>                    # add dependency
yarn add -D <package>                 # add dev dependency
yarn remove <package>                 # remove dependency
yarn upgrade <package>                # upgrade dependency
yarn cache clean                      # clear yarn cache
rm -rf node_modules && yarn install   # full reinstall
```

## Project Structure

```
task-management-system/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── auth/
│   │   │   │   ├── tasks/
│   │   │   │   ├── users/
│   │   │   │   └── app.module.ts
│   │   │   ├── main.ts
│   │   │   └── seed.ts
│   │   ├── jest.config.ts
│   │   └── project.json
│   └── dashboard/               # Angular frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── auth/
│       │   │   ├── dashboard/
│       │   │   └── app.routes.ts
│       │   ├── main.ts
│       │   ├── styles.css
│       │   └── index.html
│       ├── jest.config.ts
│       └── project.json
├── libs/
│   ├── data/                   # shared entities, dtos
│   │   ├── src/lib/
│   │   │   ├── entities.ts
│   │   │   ├── dtos.ts
│   │   │   ├── constants.ts
│   │   │   └── enums.ts
│   │   └── project.json
│   └── auth/                   # shared guards, decorators
│       ├── src/lib/
│       │   ├── guards.ts
│       │   ├── decorators.ts
│       │   └── services.ts
│       └── project.json
├── package.json
├── tsconfig.base.json          # shared typescript config
├── nx.json                     # nx monorepo config
├── .env
├── .env.example
├── .gitignore
└── README.md
```

## Architecture Overview

### NX Monorepo Layout

- **apps/api**: NestJS application with REST endpoints
- **apps/dashboard**: Angular application with task UI
- **libs/data**: Shared TypeScript interfaces, entities, DTOs
- **libs/auth**: Shared RBAC guards, decorators, auth logic

### Rationale

- Shared libraries eliminate duplication
- Type-safe communication between frontend and backend
- NX optimizes builds and testing
- Single dependency tree with Yarn

## Data Model

### Entities

**User**

- id (UUID)
- email (unique)
- password (bcrypted)
- name
- organizationId (FK)
- roleId (FK)

**Organization**

- id (UUID)
- name
- parentOrganizationId (nullable, 2-level hierarchy)

**Role**

- id (UUID)
- name (owner, admin, viewer)

**Task**

- id (UUID)
- title
- description
- status (pending, in-progress, completed)
- category (work, personal)
- organizationId (FK)
- createdById (FK)

**AuditLog**

- id (UUID)
- userId (FK)
- action (CREATE, UPDATE, DELETE)
- resource (task)
- resourceId
- details (JSON)

### Relationships

```
User -- (n) Organization
User -- (1) Role
Task -- (n) Organization
Task -- (1) User (createdBy)
AuditLog -- (1) User
```

## Role-Based Access Control

### Three-Tier Role Hierarchy

```
OWNER  -> Can do anything
ADMIN  -> Can manage organization tasks
VIEWER -> Can only manage own tasks
```

### Permission Matrix

| Permission      | Owner | Admin | Viewer |
| --------------- | ----- | ----- | ------ |
| View own tasks  | ✓     | ✓     | ✓      |
| View org tasks  | ✓     | ✓     | -      |
| Create task     | ✓     | ✓     | ✓      |
| Edit own task   | ✓     | ✓     | ✓      |
| Edit org task   | ✓     | ✓     | -      |
| Delete own task | ✓     | ✓     | ✓      |
| Delete org task | ✓     | ✓     | -      |
| View audit logs | ✓     | ✓     | -      |

### Implementation

- JwtAuthGuard validates token on all protected endpoints
- RoleGuard checks role hierarchy
- Service layer validates resource ownership
- VIEWER role automatically scoped to own tasks

## JWT Authentication

### Flow

1. User submits email/password via login form
2. Backend validates credentials against bcrypted password
3. Backend generates JWT with payload (id, email, role, organizationId)
4. Frontend stores JWT in localStorage
5. Auth interceptor automatically adds JWT to all requests
6. JwtAuthGuard validates token on protected endpoints

### Token Details

- Signed with JWT_SECRET environment variable
- Expires in 24 hours
- Contains user role and organization ID
- Verified on every protected endpoint

## API Endpoints

### Authentication

```
POST /auth/login
Request:  { email: string, password: string }
Response: { accessToken: string, user: UserDto }
```

### Tasks

```
POST /tasks
Request:  { title: string, description?: string, category?: string }
Response: Task

GET /tasks
Query:    ?status=pending|in-progress|completed (optional)
Response: Task[]

PUT /tasks/:id
Request:  { title?: string, status?: string, description?: string }
Response: Task

DELETE /tasks/:id
Response: 204 No Content
```

### Audit Logs (Admin/Owner Only)

```
GET /audit-log
Response: AuditLog[]
```

### Health Check

```
GET /health
Response: { status: 'ok', timestamp: Date, version: '1.0.0' }
```

### Headers

All endpoints except login require:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Testing

### Run All Tests

```bash
yarn test
```

### Test Backend Only

```bash
yarn test api
```

### Test Frontend Only

```bash
yarn test dashboard
```

### Watch Mode

```bash
yarn test -- --watch
```

### Coverage Report

```bash
yarn test -- --coverage
```

## Troubleshooting

### Port Already in Use

```bash
lsof -i :3333      # find process on backend port
kill -9 <PID>

lsof -i :4200      # find process on frontend port
kill -9 <PID>
```

### Clear Everything and Start Fresh

```bash
rm -rf node_modules .yarn dist coverage tasks.db
yarn cache clean
yarn install
yarn db:seed
yarn serve api
yarn serve dashboard
```

### Cannot Find Module Errors

```bash
yarn install
yarn cache clean
rm -rf node_modules .yarn
yarn install
```

### TypeScript Compilation Errors

```bash
yarn nx reset
yarn install
```

### Database Issues

```bash
rm -f tasks.db
yarn db:seed
```

## Environment Variables

### Backend (.env)

```
JWT_SECRET=AxivrKZ9ks-KBBVn4YfiI-sPTF4yjMZR-oVxlIa2KUf-xIUz8MakMh-ghp70cpLMQ-BUTUVVJjn-v2c2sjqEJq-uMaSvNvaAuGOsULWO3iq-ANAoGHA4lC-EPBpoHjuMO
DATABASE_URL=tasks.db
NODE_ENV=development
API_PORT=3333
```

### Frontend (automatic)

Frontend automatically points to `http://localhost:3333` in development.

## Shared Libraries Usage

### Importing from @task-mgmt/data

```typescript
import { User, Task, LoginDto, Role, RoleHierarchy } from '@task-mgmt/data';
```

### Importing from @task-mgmt/auth

```typescript
import { JwtAuthGuard, CurrentUser, RequireRole } from '@task-mgmt/auth';
```

## Development Workflow

### Adding a New Feature

1. Define DTOs in `libs/data/src/lib/dtos.ts`
2. Create entity in `libs/data/src/lib/entities.ts`
3. Import shared types in backend service
4. Implement controller endpoint in `apps/api/src/app`
5. Add RBAC checks in service layer
6. Create frontend component in `apps/dashboard/src/app`
7. Use shared interfaces for type safety
8. Add tests to both layers

### Adding a New Dependency

```bash
yarn add <package>          # production
yarn add -D <package>       # development
```

All dependencies are in root package.json (single dependency tree).

## Production Deployment

### Build for Production

```bash
yarn build
```

Outputs:

- Backend: `dist/apps/api`
- Frontend: `dist/apps/dashboard`

### Environment Setup

```bash
JWT_SECRET=<strong-random-secret>
DATABASE_URL=postgresql://user:pass@host/dbname
NODE_ENV=production
API_PORT=3333
FRONTEND_PORT=80
```

### Docker (Optional)

```bash
docker build -f apps/api/Dockerfile -t task-api .
docker build -f apps/dashboard/Dockerfile -t task-dashboard .
docker run -p 3333:3333 task-api
docker run -p 4200:4200 task-dashboard
```

## Production Checklist

- Change JWT_SECRET to strong value
- Switch to PostgreSQL
- Enable HTTPS
- Set up monitoring and logging
- Configure CORS whitelist
- Implement rate limiting
- Set up CI/CD pipeline
- Enable database backups

## Technology Stack

**Backend**

- NestJS 10.x
- TypeORM 0.3.x
- SQLite 5.x (PostgreSQL ready)
- bcryptjs 2.x
- JWT 10.x

**Frontend**

- Angular 18.x
- RxJS 7.x
- TailwindCSS 3.x
- HttpClient (built-in)

**Monorepo & Testing**

- NX 18.x
- Jest 29.x
- TypeScript 5.3.x
- Yarn 4.x

## Test Credentials

After running `yarn db:seed`:

```
Owner:  owner@acme.com    / owner123
Admin:  admin@acme.com    / admin123
Viewer: viewer@acme.com   / viewer123
```

## Common Commands Cheatsheet

```bash
yarn serve api                          # start backend
yarn serve dashboard                    # start frontend
yarn build                              # build all
yarn test                               # test all
yarn lint                               # lint all
yarn format                             # format code
yarn db:seed                            # seed database
yarn db:fresh                           # reset database
yarn nx dep-graph                       # show dependency graph
yarn nx affected:test                   # test changed projects
```

## Support & Documentation

- NX: https://nx.dev/docs
- NestJS: https://docs.nestjs.com
- Angular: https://angular.io/docs
- TypeORM: https://typeorm.io
- Yarn: https://yarnpkg.com

## License

MIT

---

**Version**: 1.0.0
**Status**: Production Ready
**Last Updated**: January 2026
