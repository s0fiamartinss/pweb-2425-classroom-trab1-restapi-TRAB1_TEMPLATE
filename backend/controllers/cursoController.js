const Curso = require('../models/curso');


exports.getAllCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.createCurso = async (req, res) => {
  try {
    const curso = new Curso({
      nomeDoCurso: req.body.nomeDoCurso,
    });

    const novoCurso = await curso.save();
    res.status(201).json(novoCurso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getCursoById = async (req, res) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndUpdate(
      req.params.id,
      { nomeDoCurso: req.body.nomeDoCurso },
      { new: true, runValidators: true }
    );
    
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json(curso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteCurso = async (req, res) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    
    if (!curso) return res.status(404).json({ message: 'Curso não encontrado' });
    res.json({ message: 'Curso excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};