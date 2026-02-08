const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Natours API',
      version: '1.0.0',
      description: 'API documentation for Tours & Users/Auth',
    },

    servers: [
      { url: 'http://localhost:3000', description: 'Local server' },
    ],

    tags: [
      { name: 'Auth', description: 'Authentication & password flows' },
      { name: 'Users', description: 'User management endpoints' },
      { name: 'Tours', description: 'Tours endpoints' },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      // ✅ IMPORTANT: schemas MUST be inside components.schemas
      schemas: {
        Tour: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', minLength: 10, maxLength: 40 },
            duration: { type: 'number' },
            maxGroupSize: { type: 'number' },
            difficulty: { type: 'string', enum: ['easy', 'medium', 'difficult'] },
            ratingsAverage: { type: 'number', minimum: 1, maximum: 5 },
            ratingsQuantity: { type: 'number' },
            price: { type: 'number' },
            priceDiscount: { type: 'number' },
            summary: { type: 'string' },
            description: { type: 'string' },
            imageCover: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            startDates: { type: 'array', items: { type: 'string', format: 'date-time' } },
            secretTour: { type: 'boolean' },
          },
        },

        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string', minLength: 10, maxLength: 40 },
            email: { type: 'string', format: 'email' },
            photo: { type: 'string' },
            role: { type: 'string', enum: ['user', 'admin'] },
            active: { type: 'boolean' },
          },
        },

        SignupRequest: {
          type: 'object',
          required: ['name', 'email', 'password', 'confirmPassword'],
          properties: {
            name: { type: 'string', example: 'Mohamed Ahmed Ali' },
            email: { type: 'string', example: 'mohamed@test.com' },
            password: { type: 'string', example: '12345678' },
            confirmPassword: { type: 'string', example: '12345678' },
          },
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', example: 'mohamed@test.com' },
            password: { type: 'string', example: '12345678' },
          },
        },

        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            token: { type: 'string' },
          },
        },

        UpdatePasswordRequest: {
          type: 'object',
          required: ['currentPassword', 'newPassword', 'confirmPassword'],
          properties: {
            currentPassword: { type: 'string', example: 'OldPass123' },
            newPassword: { type: 'string', example: 'NewPass123!' },
            confirmPassword: { type: 'string', example: 'NewPass123!' },
          },
        },

        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
  },

  // ✅ make sure paths are correct relative to this swagger.js file location
  apis: [
    path.join(__dirname, 'Routers', '*.js'),
    path.join(__dirname, 'Controllers', '*.js'),
  ],
};

module.exports = swaggerJSDoc(options);
