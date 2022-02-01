import { Express } from "express";
import * as swaggerJsdoc from "swagger-jsdoc";
import * as swaggerUi from "swagger-ui-express";

export function initSwagger(app: Express) {
  const swaggerDefinition = {
    info: {
      title: "React Social Backend",
      version: "1.0.0",
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "x-auth-token",
        scheme: "bearer",
        in: "header",
      },
    },
    security: [{ bearerAuth: [] }],
  };
  const options = {
    swaggerDefinition,
    apis: [`${__dirname}/*.ts`],
  };
  const swaggerSpec = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
