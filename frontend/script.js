
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


let mapaCursos = {};


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


async function carregarCursos() {
  try {
    const res = await fetch(`${API_URL}/cursos`);
    if (!res.ok) throw new Error('Falha ao carregar cursos');
    
    const cursos = await res.json();
    
  
    inputCursoSelect.innerHTML = '<option value="">Selecione um curso</option>';
    cursos.forEach(curso => {
      const opt = document.createElement('option');
      opt.value = curso._id;
      opt.textContent = curso.nomeDoCurso;
      inputCursoSelect.appendChild(opt);
    });

   
    mapaCursos = {};
    cursos.forEach(curso => {
      mapaCursos[curso._id] = curso.nomeDoCurso;
    });

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
      li.querySelector('.delete-btn-curso').addEventListener('click', () => eliminarCurso(curso._id));
      li.querySelector('.edit-btn-curso').addEventListener('click', () => editarCurso(curso));
      listaCursos.appendChild(li);
    });
    
    return cursos;
  } catch (error) {
    console.error('Erro ao carregar cursos:', error);
    alert('Erro ao carregar cursos: ' + error.message);
    return [];
  }
}


async function carregarAlunos() {
  try {
    const res = await fetch(`${API_URL}/alunos`);
    if (!res.ok) throw new Error('Falha ao carregar alunos');
    
    const alunos = await res.json();
    listaAlunos.innerHTML = '';
    
    alunos.forEach(aluno => {
      const li = document.createElement('li');
      
      let nomeCurso = 'N/A';
      let cursoId = '';
      
     
      if (aluno.cursoId && typeof aluno.cursoId === 'object' && aluno.cursoId._id) {
        cursoId = aluno.cursoId._id;
        nomeCurso = aluno.cursoId.nomeDoCurso || 'N/A';
      } else if (aluno.cursoId) {
        cursoId = aluno.cursoId;
        nomeCurso = mapaCursos[aluno.cursoId] || 'N/A';
      }
      
      li.innerHTML = `
        <strong>${aluno.nome} ${aluno.apelido}</strong><br>
        Curso: ${nomeCurso} | Ano: ${aluno.anoCurricular}
        <div class="btn-group">
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        </div>
      `;
      li.querySelector('.delete-btn').addEventListener('click', () => eliminarAluno(aluno._id));
      li.querySelector('.edit-btn').addEventListener('click', () => editarAluno({
        ...aluno,
        cursoId: cursoId
      }));
      listaAlunos.appendChild(li);
    });
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
    alert('Erro ao carregar alunos: ' + error.message);
  }
}


formAluno.addEventListener('submit', async e => {
  e.preventDefault();

  const alunoData = {
    nome: inputNome.value,
    apelido: inputApelido.value,
    cursoId: inputCursoSelect.value,
    anoCurricular: parseInt(inputAno.value)
  };

  try {
    let url = `${API_URL}/alunos`;
    let method = 'POST';
    
    if (inputIdAluno.value) {
      url = `${API_URL}/alunos/${inputIdAluno.value}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alunoData)
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Erro ao ${method === 'POST' ? 'criar' : 'atualizar'} aluno`);
    }
    
    formAluno.reset();
    inputIdAluno.value = '';
    formTitle.textContent = '⌞Adicionar Novo Aluno⌝';
    
  
    await carregarCursos();
    await carregarAlunos();
    
    alert('Aluno salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar aluno:', error);
    alert('Erro ao salvar aluno: ' + error.message);
  }
});


formCurso.addEventListener('submit', async e => {
  e.preventDefault();

  const cursoData = {
    nomeDoCurso: inputNomeCurso.value
  };

  try {
    let url = `${API_URL}/cursos`;
    let method = 'POST';
    
    if (inputIdCurso.value) {
      url = `${API_URL}/cursos/${inputIdCurso.value}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cursoData)
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || `Erro ao ${method === 'POST' ? 'criar' : 'atualizar'} curso`);
    }
    
    formCurso.reset();
    inputIdCurso.value = '';
    
   
    await carregarCursos();
    await carregarAlunos();
    
    alert('Curso salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar curso:', error);
    alert('Erro ao salvar curso: ' + error.message);
  }
});

async function eliminarAluno(id) {
  if (!confirm('Tem certeza que deseja eliminar este aluno?')) return;
  
  try {
    const res = await fetch(`${API_URL}/alunos/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao eliminar aluno');
    }
    
    await carregarCursos();
    await carregarAlunos();
    
    alert('Aluno eliminado com sucesso!');
  } catch (error) {
    console.error('Erro ao eliminar aluno:', error);
    alert('Erro ao eliminar aluno: ' + error.message);
  }
}

async function eliminarCurso(id) {
  if (!confirm('Tem certeza que deseja eliminar este curso?')) return;
  
  try {
    const res = await fetch(`${API_URL}/cursos/${id}`, { 
      method: 'DELETE' 
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Erro ao eliminar curso');
    }
    
   
    await carregarCursos();
    await carregarAlunos();
    
    alert('Curso eliminado com sucesso!');
  } catch (error) {
    console.error('Erro ao eliminar curso:', error);
    alert('Erro ao eliminar curso: ' + error.message);
  }
}


function editarAluno(aluno) {
  inputNome.value = aluno.nome;
  inputApelido.value = aluno.apelido;
  
 
  inputCursoSelect.value = aluno.cursoId || '';
  
  inputAno.value = aluno.anoCurricular;
  inputIdAluno.value = aluno._id;
  formTitle.textContent = '⌞Editar Aluno⌝';
  

  formAluno.scrollIntoView({ behavior: 'smooth' });
}


function editarCurso(curso) {
  inputNomeCurso.value = curso.nomeDoCurso;
  inputIdCurso.value = curso._id;
  
 
  formCurso.scrollIntoView({ behavior: 'smooth' });
}

async function iniciarAplicacao() {
  try {
   
    await carregarCursos();
    
    
    await carregarAlunos();
    
    console.log('Aplicação iniciada com sucesso!');
  } catch (error) {
    console.error('Erro ao iniciar aplicação:', error);
    alert('Erro ao carregar dados iniciais: ' + error.message);
  }
}


iniciarAplicacao();