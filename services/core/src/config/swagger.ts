import swaggerJsdoc from "swagger-jsdoc";
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LT Auditor MSP API",
      description: "API documentation for LT Auditor MSP platform",
      version: "1.0.0",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      { name: "Users", description: "User management endpoints" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid",
        },
        NotFoundError: {
          description: "The specified resource was not found",
        },
        ValidationError: {
          description: "Validation error",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, "../../src/swagger/*.swagger.ts"),
    path.join(__dirname, "../swagger/*.swagger.js"),
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
