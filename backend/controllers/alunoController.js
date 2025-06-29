const Aluno = require('../models/aluno');


exports.getAllAlunos = async (req, res) => {
  try {
    const alunos = await Aluno.find().populate('cursoId', 'nomeDoCurso');
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAluno = async (req, res) => {
  try {
    const aluno = new Aluno({
      nome: req.body.nome,
      apelido: req.body.apelido,
      cursoId: req.body.cursoId,
      anoCurricular: req.body.anoCurricular
    });
    
    const novoAluno = await aluno.save();
    const alunoComCurso = await Aluno.findById(novoAluno._id).populate('cursoId', 'nomeDoCurso');
    
    res.status(201).json(alunoComCurso);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.getAlunoById = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id).populate('cursoId', 'nomeDoCurso');
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      {
        nome: req.body.nome,
        apelido: req.body.apelido,
        cursoId: req.body.cursoId,
        anoCurricular: req.body.anoCurricular
      },
      { new: true, runValidators: true }
    ).populate('cursoId', 'nomeDoCurso');
    
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json(aluno);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteAluno = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);
    
    if (!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    res.json({ message: 'Aluno excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};