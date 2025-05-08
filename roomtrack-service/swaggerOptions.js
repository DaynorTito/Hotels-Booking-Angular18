const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel & Room Management API",
      version: "1.0.0",
      description: "API documentation for managing hotels and rooms."
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    servers: [
      {
        url: "http://localhost:4000/api/v1",
        description: "Development Server"
      }
    ]
  },
  apis: ["./src/infrastructure/server/routes/*.js"]
};

export default swaggerOptions;
