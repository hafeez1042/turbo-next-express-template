import swaggerJsdoc from "swagger-jsdoc";
import { schemas } from "./schemas";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API with Swagger",
      version: "1.0.0",
      description:
        "This is the CRUD API application made with ExpressJS and documented with Swagger",
      // license: {
      //   name: "MIT",
      //   url: "https://spdx.org/licenses/MIT.html",
      // },
      // contact: {
      //   name: "xyz Inc.",
      //   url: "https://www.XYZ.com",
      //   email: "info@XYZ.com",
      // },
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      parameters: {
        CustomerIDHeader: {
          name: 'Customer-ID',
          in: 'header',
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Customer identification header',
        },
      },
      schemas: schemas
    },
    servers: [
      {
        url: "http://localhost:3100/v1",
      },
     
    ],
   
    security: [{
      BearerAuth: [],
    }],
  },
  apis: ["./src/routes/**/*.ts"],
};

const swaggerSpec = { ...swaggerJsdoc(options) };

export default swaggerSpec;
