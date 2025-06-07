const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AutoCare API',
      version: '1.0.0',
      description: 'REST API for AutoCare',
      contact: {
        name: 'Ivan Hurov',
        email: 'ivan.hurov@nure.ua',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local server',
      },
    ],
  },
  apis: ['./config/swaggerDocs.js'], // Указываем путь к новой документации
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger available at: http://localhost:5000/api-docs');
};

module.exports = swaggerDocs;
