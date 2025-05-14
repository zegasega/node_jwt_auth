const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',  // Burada OpenAPI versiyonunu belirtiyoruz
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the service',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],  // Swagger açıklamalarının olduğu dosyalar
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
