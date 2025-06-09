// pages/treinos/editar/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditarTreino() {
  const router = useRouter();
  const { id } = router.query;

  const [treino, setTreino] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [exercicios, setExercicios] = useState([]);

  useEffect(() => {
    if (id) {
      const lista = JSON.parse(localStorage.getItem('treinos')) || [];
      const t = lista[id];
      if (t) {
        setTreino(t);
        setNome(t.nome);
        setDescricao(t.descricao);
        setExercicios(t.exercicios);
      }
    }
  }, [id]);

  const atualizarExercicio = (i, campo, valor) => {
    const atualizados = [...exercicios];
    atualizados[i][campo] = valor;
    setExercicios(atualizados);
  };

  const salvar = () => {
    if (!nome.trim()) {
      alert('⚠️ O nome do treino é obrigatório!');
      return;
    }
  
    if (exercicios.length === 0) {
      alert('⚠️ Adicione pelo menos um exercício.');
      return;
    }
  
    for (let i = 0; i < exercicios.length; i++) {
      const ex = exercicios[i];
  
      if (!ex.name?.trim()) {
        alert(`⚠️ O exercício #${i + 1} precisa de um nome.`);
        return;
      }
  
      const series = parseInt(ex.series);
      const reps = parseInt(ex.reps);
      const weight = parseFloat(ex.weight);
      const rest = parseInt(ex.rest);
  
      if (isNaN(series) || series <= 0) {
        alert(`⚠️ O exercício #${i + 1} precisa de um número válido de séries.`);
        return;
      }
  
      if (isNaN(reps) || reps <= 0) {
        alert(`⚠️ O exercício #${i + 1} precisa de um número válido de repetições.`);
        return;
      }
  
      if (ex.weight && (isNaN(weight) || weight < 0)) {
        alert(`⚠️ A carga do exercício #${i + 1} deve ser um número válido (ou deixe em branco).`);
        return;
      }
  
      if (ex.rest && (isNaN(rest) || rest < 0)) {
        alert(`⚠️ O descanso do exercício #${i + 1} deve ser um número válido (ou deixe em branco).`);
        return;
      }
    }
  
    const atualizados = JSON.parse(localStorage.getItem('treinos')) || [];
    atualizados[id] = {
      ...treino,
      nome,
      descricao,
      exercicios,
      atualizadoEm: new Date().toISOString(),
    };
    localStorage.setItem('treinos', JSON.stringify(atualizados));
    router.push('/treinos');
  };
  

  if (!treino) return <div className="container py-4">Carregando treino...</div>;

  return (
    <div className="container py-4">
      <h2>Editar Treino</h2>

      <div className="mb-3">
        <label className="form-label">Nome do treino</label>
        <input
          className="form-control"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição</label>
        <textarea
          className="form-control"
          rows="3"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
      </div>

      <h4 className="mt-4">Exercícios</h4>

      {exercicios.map((ex, i) => (
        <div key={i} className="border p-3 rounded mb-3 bg-light">
          <div className="mb-2">
            <label className="form-label">Nome</label>
            <input
              className="form-control"
              value={ex.name}
              onChange={(e) => atualizarExercicio(i, 'name', e.target.value)}
            />
          </div>

          <div className="row">
            <div className="col">
              <label className="form-label">Séries</label>
              <input
                className="form-control"
                value={ex.series}
                onChange={(e) => atualizarExercicio(i, 'series', e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label">Repetições</label>
              <input
                className="form-control"
                value={ex.reps}
                onChange={(e) => atualizarExercicio(i, 'reps', e.target.value)}
              />
            </div>
          </div>

          <div className="row mt-2">
            <div className="col">
              <label className="form-label">Carga (kg)</label>
              <input
                className="form-control"
                value={ex.weight}
                onChange={(e) => atualizarExercicio(i, 'weight', e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label">Descanso</label>
              <input
                className="form-control"
                value={ex.rest}
                onChange={(e) => atualizarExercicio(i, 'rest', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="form-label">Vídeo (link)</label>
            <input
              className="form-control"
              value={ex.video}
              onChange={(e) => atualizarExercicio(i, 'video', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button className="btn btn-success me-2" onClick={salvar}>
        <i className="fas fa-save"></i> Salvar alterações
      </button>
      <button className="btn btn-secondary" onClick={() => router.push('/treinos')}>
        Cancelar
      </button>
    </div>
  );
}
