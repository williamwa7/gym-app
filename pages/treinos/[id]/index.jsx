// pages/treinos/[id].jsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function VerTreino() {
  const { query } = useRouter();
  const [treino, setTreino] = useState(null);

  useEffect(() => {
    if (query.id) {
      const lista = JSON.parse(localStorage.getItem('treinos')) || [];
      const t = lista[query.id];
      if (t) setTreino(t);
    }
  }, [query.id]);

  if (!treino) return <div className="container py-4">Carregando treino...</div>;

  return (
    <div className="container py-4">
      <div className="col-12">
        <Link href="/" className="btn border-0 p-0 mb-2 fw-bold  text-lime">
          <i className="fas fa-chevron-left"></i> Início
        </Link>
      </div>
      <h2>{treino.nome}</h2>
      <p>{treino.descricao}</p>
      <p className="text-muted small">Criado em: {new Date(treino.criadoEm).toLocaleString()}</p>

      <h4 className="mt-4 mb-3">Exercícios</h4>

      {treino.exercicios.map((ex, i) => (
        <div key={i} className="border rounded p-3 mb-3 bg-light">
          <h5>{ex.name}</h5>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Séries:</strong> {ex.series || '-'}</p>
              <p><strong>Repetições:</strong> {ex.reps || '-'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Carga:</strong> {ex.weight ? `${ex.weight} kg` : '-'}</p>
              <p><strong>Descanso:</strong> {ex.rest || '-'}</p>
            </div>
          </div>
          {ex.video && (
            <div className="mt-2">
              <a href={ex.video} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-dark">
                <i className="fas fa-video"></i> Ver vídeo
              </a>
            </div>
          )}
        </div>
      ))}

      <Link href="/treinos" className="btn btn-secondary mt-4">
        <i className="fas fa-arrow-left"></i> Voltar
      </Link>
    </div>
  );
}
