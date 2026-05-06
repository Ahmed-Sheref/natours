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

    // All API paths defined here instead of JSDoc comments in router files
    paths: {
      // Auth endpoints
      '/api/v1/users/signup': {
        post: {
          tags: ['Auth'],
          summary: 'Create user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/SignupRequest' }
              }
            }
          },
          responses: {
            201: {
              description: 'Signed up successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login with email and password',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/LoginRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Logged in successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/updateMyPassword': {
        patch: {
          tags: ['Auth'],
          summary: 'Update my password (logged in)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UpdatePasswordRequest' }
              }
            }
          },
          responses: {
            200: {
              description: 'Password updated + new token returned',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/forgetpassword': {
        post: {
          tags: ['Auth'],
          summary: 'Send password reset token to user\'s email',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'mohamed@test.com' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Token sent to email',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      message: { type: 'string', example: 'Token sent to email!' }
                    }
                  }
                }
              }
            },
            403: {
              description: 'User not found / not allowed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/resetpassword/{token}': {
        patch: {
          tags: ['Auth'],
          summary: 'Reset password using reset token',
          parameters: [{
            in: 'path',
            name: 'token',
            required: true,
            schema: { type: 'string' },
            description: 'Reset token that was sent to the user\'s email'
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['password'],
                  properties: {
                    password: { type: 'string', example: 'NewStrongPass123!' },
                    confirmPassword: { type: 'string', example: 'NewStrongPass123!' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Password reset succeeded, returns a new JWT',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AuthResponse' }
                }
              }
            },
            403: {
              description: 'Invalid token or expired token',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      // User endpoints
      '/api/v1/users': {
        get: {
          tags: ['Users'],
          summary: 'Get all users',
          responses: {
            200: {
              description: 'List of users',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Users'],
          summary: 'Create a user (not implemented in your code yet)',
          requestBody: {
            required: false,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          responses: {
            200: {
              description: 'Placeholder response (your controller currently returns a users query, not creating)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get a user by id (not implemented in your code yet)',
          parameters: [{
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId'
          }],
          responses: {
            200: {
              description: 'Placeholder response (your controller currently returns a users query, not a single user)',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'success' },
                      users: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Invalid id',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        },
        delete: {
          tags: ['Users'],
          summary: 'Delete a user by id (not implemented in your code yet)',
          parameters: [{
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId'
          }],
          responses: {
            500: {
              description: 'Route not defined (your controller currently returns 500)',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/updateMe': {
        patch: {
          tags: ['Users'],
          summary: 'Update my profile (name/email)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Mohamed Ahmed Ali' },
                    email: { type: 'string', format: 'email', example: 'mohamed@test.com' }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'User updated successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'User updated successfully' },
                      newUser: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized / invalid token',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      '/api/v1/users/deleteMe': {
        delete: {
          tags: ['Users'],
          summary: 'Deactivate my account (soft delete)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'User deleted successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: { type: 'string', example: 'User deleted successfully' }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized / invalid token',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ErrorResponse' }
                }
              }
            }
          }
        }
      },

      // Tour endpoints
      '/api/v1/tours/get-tours-stats': {
        get: {
          tags: ['Tours'],
          summary: 'Get tours statistics (grouped by difficulty)',
          responses: {
            200: { description: 'Stats' }
          }
        }
      },

      '/api/v1/tours/monthly_plan/{year}': {
        get: {
          tags: ['Tours'],
          summary: 'Get monthly plan for a given year',
          parameters: [{
            in: 'path',
            name: 'year',
            required: true,
            schema: { type: 'integer', example: 2026 }
          }],
          responses: {
            200: { description: 'Monthly plan' }
          }
        }
      },

      '/api/v1/tours/{id}': {
        get: {
          tags: ['Tours'],
          summary: 'Get specific tour by id',
          parameters: [{
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId'
          }],
          responses: {
            200: {
              description: 'Tour',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Tour' }
                }
              }
            }
          }
        },
        patch: {
          tags: ['Tours'],
          summary: 'Update tour by id',
          parameters: [{
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId'
          }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Tour' }
              }
            }
          },
          responses: {
            200: { description: 'Updated tour' }
          }
        },
        delete: {
          tags: ['Tours'],
          summary: 'Delete tour by id (admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [{
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'MongoDB ObjectId'
          }],
          responses: {
            200: { description: 'Deleted tour' }
          }
        }
      },

      '/api/v1/tours': {
        get: {
          tags: ['Tours'],
          summary: 'Get all tours (supports filtering, sorting, pagination)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              in: 'query',
              name: 'sort',
              schema: { type: 'string' },
              description: 'Example: price,-ratingsAverage'
            },
            {
              in: 'query',
              name: 'limit',
              schema: { type: 'integer', example: 10 }
            },
            {
              in: 'query',
              name: 'page',
              schema: { type: 'integer', example: 1 }
            }
          ],
          responses: {
            200: {
              description: 'List of tours',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      len: { type: 'integer' },
                      status: { type: 'string' },
                      data: {
                        type: 'object',
                        properties: {
                          tours: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Tour' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Tours'],
          summary: 'Create a new tour',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Tour' }
              }
            }
          },
          responses: {
            200: { description: 'Created tour' }
          }
        }
      }
    }
  },

  // Required for swagger-jsdoc even when paths are defined directly
  apis: [], // Empty since we define all paths in the paths object
};

module.exports = swaggerJSDoc(options);
