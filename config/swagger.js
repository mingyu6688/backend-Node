import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js API with Swagger',
      version: '1.0.0',
      description: 'API 문서',
    },
    servers: [
      {
        url: 'http://localhost:3000', // ec2 수정필요
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
