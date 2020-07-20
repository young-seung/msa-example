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
  paths: {
    '/user': {
      post:{
        tags: [
          'Users'
        ],
        summary: 'Post user',
        requestBody: {
          description: 'User Object',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#definitions/User'
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
              $ref: '#/definitions/Id'
            }
          },
          400: {
            description: 'Failed. Bad post data'
          }
        }
      },
      get: {
        tags: [
          'Users'
        ],
        summary: 'Get users',
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/Users'
            }
          }
        },
        // security: { JWT: [] }
      }
    },
    '/user/{id}': {
      parameters: [{
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
            description: 'OK',
            schema: {
              $ref: '#/definitions/User'
            }
          }
        }
      },
      put: {
        tags: [
          'Users'
        ],
        summary: 'Put user',
        requestBody: {
          description: 'User Object',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#definitions/Password'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/User'
            }
          },
          400: {
            description: 'Failed. Bad post data.'
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
          200: {
            description: 'OK',
            schema: {
              $ref: '#/definitions/User'
            }
          },
          404: {
            description: 'Failed. User not found'
          }
        }
      }
    }
  },
  definitions: {
    Id: {
      properties: {
        uuid: {
          type: 'string'
        }
      }
    },
    Password: {
      properties: {
        password: {
          type: 'string'
        }
      }
    },
    User: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        email: {
          type: 'string'
        },
        password:{
          type: 'string'
        }
      }
    },
    Users: {
      type: 'object',
      properties: {
        users: {
          type: 'object',
          additionalProperties: {
            $ref: '#/definitions/User'
          }
        }
      }
    }
  },
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
};

export default swaggerDefinition;