const swaggerDefinition = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'Auth',
    description: 'your description here',
    termsOfService: '',
    contact: {
      name: 'simson613',
      email: 'simson0613@gmail.com',
      url: 'https://github.com/young-seung/msa-example'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  host: 'localhost:5000',
  apis: ['./routes/index.ts'],
  paths: {
    '/user': {
      post:{
        tags: [
          'Users'
        ],
        summary: 'Post user',
        description: '',
        requestBody: {
          description: 'User Object',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#component/schemas/User'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          200: {
            description: 'OK'
          },
          400: {
            description: 'Failed. Bad post data'
          },
          409: {
            description: 'Failed email already in use'
          }
        },
      },
      get: {
        tags: [
          'Users'
        ],
        summary: 'Get users',
        responses: {
          200: {
            description: 'OK'
          },
          400: {
            description: 'Failed User not found'
          }
        }
      }
    },
    '/user/{id}': {
      parameters: [{
        name: 'token',
        in: 'header',
        required: true,
        type: 'string'
        // schema: {
        //   type: 'string'
        // }
      },{
        id: 'id',
        name: 'id',
        in: 'path',
        required: true,
        type: 'string'
      }],
      get: {
        tags: [
          'Users'
        ],
        summary: 'Get user',
        responses: {
          200: {
            description: 'OK'
          },
          401: {
            description: 'Failed. Unauthorized'
          },
          404: {
            description: 'Failed. User not found'
          }
        },
      },
      put: {
        tags: [
          'Users'
        ],
        summary: 'Put user',
        requestBody: {
          description: 'New Password',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#component/schemas/Password'
              }
            }
          }
        },
        produces: [
          'application/json'
        ],
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/component/schemas/User'
            }
          },
          400: {
            description: 'Failed. Bad post data.'
          },
          401: {
            description: 'Failed. Unauthorized'
          },
          402: {
            description: 'Failed. The password is the same as the previous password.'
          },
          404: {
            description: 'Failed. User not found'
          }
        }
      },
      delete: {
        tags: [
          'Users'
        ],
        summary: 'Delete user',
        responses: {
          204: {
            description: 'Sucess. User deleted'
          },
          401: {
            description: 'Failed. Unauthorized'
          },
          404: {
            description: 'Failed. User not found'
          }
        }
      }
    }
  },
  component: {
    schemas: {
      Id: {
        uuid: {
          type: 'string'
        }
      },
      Password: {
        type: 'object',
        properties: {
          password: {
            type: 'string',
            example: '2'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            example: 'test'
          },
          email: {
            type: 'string',
            example: 'test@test.com'
          },
          password:{
            type: 'string',
            example: '1'
          }
        }
      },
      Users: {
        type: 'object',
        properties: {
          users: {
            type: 'object',
            additionalProperties: {
              $ref: '#/component/schemas/User'
            }
          }
        }
      }  
    },
    securitySchemes: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization'
      },
    },
  },
};

export default swaggerDefinition;