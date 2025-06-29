const mongoose = require('mongoose');

const CursoSchema = new mongoose.Schema({
  nomeDoCurso: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Curso', CursoSchema);