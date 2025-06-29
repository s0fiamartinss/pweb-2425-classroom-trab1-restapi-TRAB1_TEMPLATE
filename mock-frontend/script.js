const API_URL = 'http://localhost:3001';
const listaAlunos = document.getElementById('lista-alunos');
const listaCursos = document.getElementById('lista-cursos');
const formAluno = document.getElementById('form-aluna');
const formCurso = document.getElementById('form-curso');
const formTitle = document.getElementById('form-title');
const inputNome = formAluno.nome;
const inputApelido = formAluno.apelido;
const inputCursoSelect = document.createElement('select');
const inputAno = formAluno.anoCurricular;
const inputIdAluno = formAluno.id;
const inputNomeCurso = formCurso.nomeDoCurso;
const inputIdCurso = formCurso.id;

// Mapa para armazenar os cursos (id -> nome)
let mapaCursos = {};

// Configurar o select de cursos
inputCursoSelect.name = 'curso';
inputCursoSelect.required = true;
inputCursoSelect.style.marginBottom = '12px';
inputCursoSelect.style.width = '100%';
inputCursoSelect.style.padding = '10px';
inputCursoSelect.style.borderRadius = '10px';
inputCursoSelect.style.border = 'none';
inputCursoSelect.style.backgroundColor = '#fff7fc';
inputCursoSelect.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.05)';
formAluno.insertBefore(inputCursoSelect, inputAno);

// Carregar cursos
async function carregarCursos() {
  try {
    const res = await fetch(`${API_URL}/cursos`);
    const cursos = await res.json();
    
    // Preencher select
    inputCursoSelect.innerHTML = '';
    cursos.forEach(curso => {
      const opt = document.createElement('option');
      opt.value = curso.id;
      opt.textContent = curso.nomeDoCurso;
      inputCursoSelect.appendChild(opt);
    });

    // Preencher o mapa de cursos (para exibição na lista de alunos)
    mapaCursos = {};
    cursos.forEach(curso => {
      mapaCursos[curso.id] = curso.nomeDoCurso;
    });

    // Preencher lista de cursos
    listaCursos.innerHTML = '';
    cursos.forEach(curso => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${curso.nomeDoCurso}</strong>
        <div class="btn-group">
          <button class="edit-btn-curso">Editar</button>
          <button class="delete-btn-curso">Eliminar</button>
        </div>
      `;
      li.querySelector('.delete-btn-curso').addEventListener('click', () => eliminarCurso(curso.id));
      li.querySelector('.edit-btn-curso').addEventListener('click', () => editarCurso(curso));
      listaCursos.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar cursos:', error);
  }
}

// Carregar alunos
async function carregarAlunos() {
  try {
    const res = await fetch(`${API_URL}/alunos`);
    const alunos = await res.json();
    listaAlunos.innerHTML = '';
    
    alunos.forEach(aluno => {
      const li = document.createElement('li');
      // Usar o mapaCursos para obter o nome do curso a partir do cursoId
      const nomeCurso = mapaCursos[aluno.cursoId] || 'N/A';
      li.innerHTML = `
        <strong>${aluno.nome} ${aluno.apelido}</strong><br>
        Curso: ${nomeCurso} | Ano: ${aluno.anoCurricular}
        <div class="btn-group">
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        </div>
      `;
      li.querySelector('.delete-btn').addEventListener('click', () => eliminarAluno(aluno.id));
      li.querySelector('.edit-btn').addEventListener('click', () => editarAluno(aluno));
      listaAlunos.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}

// Guardar Aluno
formAluno.addEventListener('submit', async e => {
  e.preventDefault();

  const alunoData = {
    nome: inputNome.value,
    apelido: inputApelido.value,
    cursoId: parseInt(inputCursoSelect.value),
    anoCurricular: parseInt(inputAno.value)
  };

  try {
    if (inputIdAluno.value) {
      // Atualizar aluno existente
      await fetch(`${API_URL}/alunos/${inputIdAluno.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
    } else {
      // Criar novo aluno
      await fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alunoData)
      });
    }
    
    formAluno.reset();
    inputIdAluno.value = '';
    formTitle.textContent = '⌞Adicionar Novo Aluno⌝';
    await carregarAlunos();
  } catch (error) {
    console.error('Erro ao salvar aluno:', error);
  }
});

// Guardar Curso
formCurso.addEventListener('submit', async e => {
  e.preventDefault();

  const cursoData = {
    nomeDoCurso: inputNomeCurso.value
  };

  try {
    if (inputIdCurso.value) {
      // Atualizar curso existente
      await fetch(`${API_URL}/cursos/${inputIdCurso.value}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoData)
      });
    } else {
      // Criar novo curso
      await fetch(`${API_URL}/cursos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoData)
      });
    }
    
    formCurso.reset();
    inputIdCurso.value = '';
    await carregarCursos();
  } catch (error) {
    console.error('Erro ao salvar curso:', error);
  }
});

// Eliminar aluno
async function eliminarAluno(id) {
  if (!confirm('Tem certeza que deseja eliminar este aluno?')) return;
  
  try {
    await fetch(`${API_URL}/alunos/${id}`, { method: 'DELETE' });
    await carregarAlunos();
  } catch (error) {
    console.error('Erro ao eliminar aluno:', error);
  }
}

// Eliminar curso
async function eliminarCurso(id) {
  if (!confirm('Tem certeza que deseja eliminar este curso?')) return;
  
  try {
    await fetch(`${API_URL}/cursos/${id}`, { method: 'DELETE' });
    await carregarCursos();
  } catch (error) {
    console.error('Erro ao eliminar curso:', error);
  }
}

// Editar aluno
function editarAluno(aluno) {
  inputNome.value = aluno.nome;
  inputApelido.value = aluno.apelido;
  inputCursoSelect.value = aluno.cursoId;
  inputAno.value = aluno.anoCurricular;
  inputIdAluno.value = aluno.id;
  formTitle.textContent = '⌞Editar Aluno⌝';
}

// Editar curso
function editarCurso(curso) {
  inputNomeCurso.value = curso.nomeDoCurso;
  inputIdCurso.value = curso.id;
}

// Iniciar
carregarCursos().then(carregarAlunos);