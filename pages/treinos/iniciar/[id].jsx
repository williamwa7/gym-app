// pages/treinos/iniciar/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function IniciarTreino() {
  const router = useRouter();
  const { id } = router.query;

  const [treino, setTreino] = useState(null);
  const [finalizados, setFinalizados] = useState([]);
  const [comentario, setComentario] = useState('');
  const [inicio, setInicio] = useState(null);
  const [cronometro, setCronometro] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('treinos')) || [];
    const treinoSelecionado = dados[id];
    if (treinoSelecionado) {
      setTreino(treinoSelecionado);
      setInicio(Date.now());
      const intervalo = setInterval(() => {
        setCronometro(Math.floor((Date.now() - Date.parse(treinoSelecionado.inicio || new Date())) / 1000));
      }, 1000);
      setIntervalId(intervalo);
    }

    return () => clearInterval(intervalId);
  }, [id]);

  const marcarFinalizado = (index) => {
    if (!finalizados.includes(index)) {
      setFinalizados([...finalizados, index]);
    }
  };

  const todosFinalizados = treino && treino.exercicios.length === finalizados.length;

  const formatarTempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const sec = segundos % 60;
    return `${min}m ${sec}s`;
  };

  const finalizarTreino = () => {
    const fim = Date.now();
    const duracao = Math.floor((fim - inicio) / 1000);

    const historico = JSON.parse(localStorage.getItem('historicoTreinos')) || [];
    historico.push({
      nome: treino.nome,
      data: new Date().toLocaleString(),
      tempo: formatarTempo(duracao),
      comentarios: comentario,
    });
    localStorage.setItem('historicoTreinos', JSON.stringify(historico));
    alert('Treino finalizado com sucesso!');
    router.push('/treinos/historico');
  };

  if (!treino) return <p>Carregando treino...</p>;

  return (
    <div className="container py-4">
      <h2>Iniciar Treino: {treino.nome}</h2>
      <p><strong>Descrição:</strong> {treino.descricao}</p>
      <p className="text-muted">Tempo atual: {formatarTempo(cronometro)}</p>

      <ul className="list-group mb-4">
        {treino.exercicios.map((ex, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{ex.name}</strong><br />
              {ex.series}x{ex.reps} - {ex.weight}kg - Descanso: {ex.rest}s
            </div>
            <button
              className={`btn btn-sm ${finalizados.includes(i) ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => marcarFinalizado(i)}
              disabled={finalizados.includes(i)}
            >
              {finalizados.includes(i) ? 'Finalizado' : 'Marcar como feito'}
            </button>
          </li>
        ))}
      </ul>

      {todosFinalizados && (
        <div className="mb-3">
          <label className="form-label">Comentário sobre o treino:</label>
          <textarea
            className="form-control"
            rows="3"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          ></textarea>
          <button className="btn btn-primary mt-3" onClick={finalizarTreino}>
            Finalizar Treino
          </button>
        </div>
      )}
    </div>
  );
}