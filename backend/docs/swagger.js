const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestão de Alunos e Cursos',
      version: '1.0.0',
      description: 'API RESTful para gerenciamento de alunos e cursos',
      contact: {
        name: 'Suporte',
        email: 'suporte@gestaoalunos.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api.gestaoalunos.com',
        description: 'Servidor de produção'
      }
    ],
    tags: [
      {
        name: 'Alunos',
        description: 'Operações relacionadas a alunos'
      },
      {
        name: 'Cursos',
        description: 'Operações relacionadas a cursos'
      }
    ],
    components: {
      schemas: {
        Aluno: {
          type: 'object',
          properties: {
            nome: {
              type: 'string',
              description: 'Nome do aluno'
            },
            apelido: {
              type: 'string',
              description: 'Apelido do aluno'
            },
            cursoId: {
              type: 'string',
              description: 'ID do curso associado'
            },
            anoCurricular: {
              type: 'integer',
              description: 'Ano curricular (1-3)'
            }
          },
          required: ['nome', 'apelido', 'cursoId', 'anoCurricular'],
          example: {
            nome: 'Maria',
            apelido: 'Silva',
            cursoId: '64d5f7a8b4c1d8c9f0e3f2a1',
            anoCurricular: 2
          }
        },
        Curso: {
          type: 'object',
          properties: {
            nomeDoCurso: {
              type: 'string',
              description: 'Nome do curso'
            }
          },
          required: ['nomeDoCurso'],
          example: {
            nomeDoCurso: 'Informática'
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;