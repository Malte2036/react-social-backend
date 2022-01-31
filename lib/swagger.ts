import { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function initSwagger(app: Express) {
  const swaggerDefinition = {
    info: {
      title: "React Social Backend",
      version: "1.0.0",
    },
  };
  const options = {
    swaggerDefinition,
    apis: [`${__dirname}/index.ts`],
  };
  const swaggerSpec = swaggerJsdoc(options);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
