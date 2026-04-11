import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Super Grocery Booking API",
      version: "1.0.0",
      description:
        "A Grocery Booking System API with Admin and User roles. Admins can manage grocery items, categories, and inventory. Users can browse available items and place orders.",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Development server",
        variables: {
          port: {
            default: "3000",
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
      schemas: {
        // ── Auth ──
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 20,
              example: "John Doe",
            },
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              minLength: 6,
              example: "secret123",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "john@example.com",
            },
            password: {
              type: "string",
              example: "secret123",
            },
          },
        },
        RefreshInput: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIs...",
            },
          },
        },
        AuthTokens: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
          },
        },
        UserInfo: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { type: "string", enum: ["admin", "user"] },
          },
        },
        LoginResponse: {
          type: "object",
          properties: {
            accessToken: { type: "string" },
            refreshToken: { type: "string" },
            user: { $ref: "#/components/schemas/UserInfo" },
          },
        },

        // ── Category ──
        Category: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        CreateCategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "Fruits",
            },
          },
        },
        UpdateCategoryInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 255,
              example: "Vegetables",
            },
          },
        },

        // ── Grocery Item ──
        GroceryItem: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            price: { type: "integer" },
            quantity: { type: "integer" },
            quantityUnit: {
              type: "string",
              enum: [
                "gm",
                "kg",
                "L",
                "ml",
                "pack",
                "piece",
                "box",
                "carton",
                "dozen",
                "length",
              ],
            },
            categoryId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        GroceryItemWithCategory: {
          allOf: [
            { $ref: "#/components/schemas/GroceryItem" },
            {
              type: "object",
              properties: {
                category: {
                  $ref: "#/components/schemas/Category",
                  nullable: true,
                },
              },
            },
          ],
        },
        CreateGroceryItemInput: {
          type: "object",
          required: ["name", "price", "quantity", "quantityUnit"],
          properties: {
            name: {
              type: "string",
              minLength: 1,
              maxLength: 512,
              example: "Organic Apples",
            },
            price: {
              type: "number",
              minimum: 0,
              exclusiveMinimum: true,
              example: 250,
            },
            quantity: {
              type: "integer",
              minimum: 0,
              example: 100,
            },
            quantityUnit: {
              type: "string",
              enum: [
                "gm",
                "kg",
                "L",
                "ml",
                "pack",
                "piece",
                "box",
                "carton",
                "dozen",
                "length",
              ],
              example: "kg",
            },
            categoryId: {
              type: "string",
              format: "uuid",
              nullable: true,
              description: "Optional category UUID",
            },
          },
        },
        UpdateGroceryItemInput: {
          type: "object",
          properties: {
            name: { type: "string", minLength: 1, maxLength: 512 },
            price: { type: "number", minimum: 0, exclusiveMinimum: true },
            quantityUnit: {
              type: "string",
              enum: [
                "gm",
                "kg",
                "L",
                "ml",
                "pack",
                "piece",
                "box",
                "carton",
                "dozen",
                "length",
              ],
            },
            categoryId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
          },
        },
        UpdateInventoryInput: {
          type: "object",
          required: ["action", "quantity"],
          properties: {
            action: {
              type: "string",
              enum: ["set", "increment", "decrement"],
              example: "increment",
            },
            quantity: {
              type: "integer",
              minimum: 0,
              example: 50,
            },
          },
        },

        // ── Order ──
        CreateOrderInput: {
          type: "object",
          required: ["items"],
          properties: {
            items: {
              type: "array",
              minItems: 1,
              items: {
                type: "object",
                required: ["groceryItemId", "quantity"],
                properties: {
                  groceryItemId: {
                    type: "string",
                    format: "uuid",
                    example: "550e8400-e29b-41d4-a716-446655440000",
                  },
                  quantity: {
                    type: "integer",
                    minimum: 1,
                    example: 2,
                  },
                },
              },
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "string", format: "uuid" },
            totalPrice: { type: "integer" },
            status: {
              type: "string",
              enum: ["pending", "confirm", "cancelled", "completed"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  itemId: { type: "string", format: "uuid" },
                  quantity: { type: "integer" },
                  unitPrice: { type: "integer" },
                },
              },
            },
          },
        },
        OrderWithItems: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "string", format: "uuid" },
            totalPrice: { type: "integer" },
            status: {
              type: "string",
              enum: ["pending", "confirm", "cancelled", "completed"],
            },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  orderId: { type: "integer" },
                  itemId: { type: "string", format: "uuid" },
                  quantity: { type: "integer" },
                  unitPrice: { type: "integer" },
                  groceryItem: {
                    type: "object",
                    properties: {
                      id: { type: "string", format: "uuid" },
                      name: { type: "string" },
                      quantityUnit: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },

        // ── Common ──
        PaginationMeta: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            total: { type: "integer" },
            totalPages: { type: "integer" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string" },
          },
        },
      },
      parameters: {
        PageParam: {
          in: "query",
          name: "page",
          schema: { type: "integer", minimum: 1, default: 1 },
          description: "Page number",
        },
        LimitParam: {
          in: "query",
          name: "limit",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 20 },
          description: "Items per page (max 100)",
        },
        SearchParam: {
          in: "query",
          name: "search",
          schema: { type: "string" },
          description: "Search by name (case-insensitive)",
        },
        CategoryIdParam: {
          in: "query",
          name: "categoryId",
          schema: { type: "string", format: "uuid" },
          description: "Filter by category ID",
        },
      },
    },
    tags: [
      {
        name: "Auth",
        description: "Authentication — register, login, refresh tokens, logout",
      },
      {
        name: "Categories",
        description: "Browse categories (authenticated users)",
      },
      {
        name: "Admin Categories",
        description: "Manage categories (admin only)",
      },
      {
        name: "Grocery Items (User)",
        description: "Browse available grocery items",
      },
      {
        name: "Grocery Items (Admin)",
        description: "Manage grocery items and inventory (admin only)",
      },
      { name: "Orders", description: "Place and view orders" },
    ],
  },
  apis: ["./src/modules/**/*.routes.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
