# Super Grocery Booking API

A RESTful Grocery Booking System built with **Express 5**, **TypeScript**, **Drizzle ORM**, and **PostgreSQL**. The system supports two roles — **Admin** and **User** — allowing admins to manage grocery inventory and users to browse items and place orders.

> Built as a take-home assignment: _Design a Grocery Booking System with Admin/User roles, relational database, and Docker support._

## Features

- JWT-based authentication with access & refresh tokens
- Role-based authorization (Admin / User)
- Full CRUD for grocery items and categories (Admin)
- Inventory management with atomic stock decrement on orders
- Paginated list endpoints
- Interactive API documentation via Swagger UI
- Database seeding with sample data
- Dockerized for one-command deployment

---

## Tech Stack

| Layer        | Technology                        |
| ------------ | --------------------------------- |
| Runtime      | Node.js 22                        |
| Language     | TypeScript 6                      |
| Framework    | Express 5                         |
| ORM          | Drizzle ORM + drizzle-zod         |
| Database     | PostgreSQL 16                     |
| Validation   | Zod 4                             |
| Auth         | JSON Web Tokens (jsonwebtoken)    |
| Docs         | Swagger UI (swagger-jsdoc)        |
| Container    | Docker & Docker Compose           |

---

## ER Diagram

- [Database ER Diagram (dbdiagram.io)](https://dbdiagram.io/d/Super-Grocery-69d90efa0f7c9ef2c0c9d236)

---

## System Requirements

| Requirement      | Version        |
| ---------------- | -------------- |
| **Node.js**      | >= 22.x        |
| **npm**          | >= 10.x        |
| **PostgreSQL**   | >= 16 (if running without Docker) |
| **Docker**       | >= 24.x (if running with Docker)  |
| **Docker Compose** | >= 2.x (if running with Docker) |

---

## API Endpoints

### Auth (`/auth`) — Public / Authenticated

| Method | Endpoint            | Description                        | Access          |
| ------ | ------------------- | ---------------------------------- | --------------- |
| POST   | `/auth/register`    | Register a new user                | Public          |
| POST   | `/auth/login`       | Login with email & password        | Public          |
| POST   | `/auth/refresh`     | Refresh access token               | Public          |
| POST   | `/auth/logout`      | Logout current session             | Authenticated   |
| DELETE | `/auth/sessions`    | Terminate all sessions             | Authenticated   |

### Categories — User (`/categories`)

| Method | Endpoint            | Description                        | Access          |
| ------ | ------------------- | ---------------------------------- | --------------- |
| GET    | `/categories`       | List all categories (paginated)    | Authenticated   |
| GET    | `/categories/:id`   | Get a category by ID               | Authenticated   |

### Categories — Admin (`/admin/categories`)

| Method | Endpoint                 | Description            | Access |
| ------ | ------------------------ | ---------------------- | ------ |
| POST   | `/admin/categories`      | Create a new category  | Admin  |
| PATCH  | `/admin/categories/:id`  | Update a category      | Admin  |
| DELETE | `/admin/categories/:id`  | Delete a category      | Admin  |

### Grocery Items — User (`/grocery-items`)

| Method | Endpoint              | Description                              | Access        |
| ------ | --------------------- | ---------------------------------------- | ------------- |
| GET    | `/grocery-items`      | List available grocery items (in stock)  | Authenticated |
| GET    | `/grocery-items/:id`  | Get a grocery item by ID                 | Authenticated |

### Grocery Items — Admin (`/admin/grocery-items`)

| Method | Endpoint                    | Description                          | Access |
| ------ | --------------------------- | ------------------------------------ | ------ |
| GET    | `/admin/grocery-items`      | List all grocery items               | Admin  |
| GET    | `/admin/grocery-items/:id`  | Get a grocery item by ID             | Admin  |
| POST   | `/admin/grocery-items`      | Add a new grocery item               | Admin  |
| PATCH  | `/admin/grocery-items/:id`  | Update a grocery item's details      | Admin  |
| DELETE | `/admin/grocery-items/:id`  | Remove a grocery item from system    | Admin  |

### Orders (`/orders`)

| Method | Endpoint       | Description                                    | Access        |
| ------ | -------------- | ---------------------------------------------- | ------------- |
| POST   | `/orders`      | Place a new order (multiple items, atomic)     | Authenticated |
| GET    | `/orders`      | List my orders (paginated)                     | Authenticated |
| GET    | `/orders/:id`  | Get one of my orders by ID                     | Authenticated |

> Full interactive documentation is available at **`/api-docs`** when the server is running.

### Swagger Documentation

Once the server is running, you can explore and test all endpoints via the interactive Swagger UI:

- **Swagger UI:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
- **OpenAPI JSON:** [http://localhost:3000/api-docs.json](http://localhost:3000/api-docs.json)

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=super_grocery

# JWT
JWT_ACCESS_SECRET=your_access_secret_at_least_10_chars
JWT_REFRESH_SECRET=your_refresh_secret_at_least_10_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

---

## Project Setup

### Option 1: Docker (Recommended)

This spins up both PostgreSQL and the application in containers.

```bash
# 1. Clone the repository
git clone <repo-url>
cd super-grocery

# 2. Create .env file (see Environment Variables section above)
cp .env.example .env   # or create manually

# 3. Build and start all services
docker compose up --build

# The API will be available at http://localhost:3000
# Swagger docs at http://localhost:3000/api-docs
```

To stop the services:

```bash
docker compose down
```

To stop and remove the database volume (full reset):

```bash
docker compose down -v
```

### Option 2: Without Docker (Local Development)

#### 1. Prerequisites

- Install [Node.js 22+](https://nodejs.org/) (LTS recommended)
- Install [PostgreSQL 16+](https://www.postgresql.org/download/)

#### 2. Prepare the Database

You can either install PostgreSQL locally or use the Docker Compose file to run **only** the database container:

**Option A — Use Docker for the database only:**

```bash
# Start only the PostgreSQL container
npm run db:start

# To stop it later
npm run db:end
```

**Option B — Use a local PostgreSQL installation:**

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE super_grocery;

# (Optional) Create a dedicated user
CREATE USER grocery_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE super_grocery TO grocery_user;

# Exit psql
\q
```

Then update your `.env` file with the correct `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.

#### 3. Install Dependencies

```bash
npm install
```

#### 4. Run Database Migrations

```bash
npm run db:migrate
```

#### 5. Create an Admin User

Run the interactive CLI to create your first admin account:

```bash
npm run db:create-admin
```

You will be prompted to enter a name, email, and password for the admin user.

#### 6. Seed the Database (Optional)

Populates the database with sample categories (Fruits, Vegetables, Dairy, Beverages, Bakery), a demo user, and grocery items.

```bash
npm run db:seed
```

**Seeded demo user:**

| Role | Email             | Password |
| ---- | ----------------- | -------- |
| User | user@grocery.com  | user123  |

#### 7. Start the Development Server

```bash
npm run dev
```

The server will start at **http://localhost:3000** with hot-reload enabled.

---

## Available Scripts

| Script            | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Start dev server with hot-reload (tsx)     |
| `npm run build`   | Compile TypeScript to JavaScript           |
| `npm run db:start`| Start PostgreSQL container via Docker      |
| `npm run db:end`  | Stop PostgreSQL container                  |
| `npm run db:generate` | Generate Drizzle migration files       |
| `npm run db:migrate`  | Run pending database migrations        |
| `npm run db:push`     | Push schema directly to database       |
| `npm run db:studio`   | Open Drizzle Studio (DB GUI)           |
| `npm run db:seed`     | Seed database with sample data         |
| `npm run db:create-admin` | Create an admin user (interactive) |

---

## Project Structure

```
super-grocery/
├── src/
│   ├── index.ts                 # Express app entry point
│   ├── configs/                 # Environment, Swagger config
│   ├── db/
│   │   ├── index.ts             # Database connection
│   │   ├── seed.ts              # Database seeder
│   │   ├── create-admin.ts      # Interactive admin creation CLI
│   │   └── schema/              # Drizzle table definitions
│   ├── middleware/               # Auth, validation, error handling
│   ├── modules/
│   │   ├── auth/                # Register, login, logout, refresh
│   │   ├── category/            # Category CRUD
│   │   ├── grocery/             # Grocery item management
│   │   └── order/               # Order placement & history
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Helpers (JWT, password, logger, etc.)
├── drizzle/                     # Generated SQL migrations
├── docker-compose.yml           # Docker Compose (app + db)
├── Dockerfile                   # Multi-stage production build
├── drizzle.config.ts            # Drizzle Kit configuration
├── tsconfig.json
└── package.json
```
