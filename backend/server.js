require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const alunoRoutes = require('./routes/alunoRoutes'); 
const cursoRoutes = require('./routes/cursoRoutes'); 

const app = express();
const PORT = process.env.PORT || 3001;


connectDB();


app.use(cors());
app.use(express.json());


app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);

app.get('/', (req, res) => {
  res.send('API de Gestão de Alunos');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');




app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec, {
  customSiteTitle: 'Documentação da API - Gestão de Alunos',
  customCss: '.swagger-ui .topbar { display: none }',
  customfavIcon: '/favicon.ico'
}));

