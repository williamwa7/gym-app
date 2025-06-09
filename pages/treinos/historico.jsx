import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HistoricoTreinos() {
    const [historico, setHistorico] = useState([]);
    const [isClient, setIsClient] = useState(false); // <- aqui

    useEffect(() => {
        setIsClient(true); // <- marca que estamos no cliente

        const dados = JSON.parse(localStorage.getItem('historicoTreinos')) || [];
        console.log("dados", dados)
        const dadosValidos = dados.filter(
            (item) =>
                item &&
                item.treino &&
                item.treino.nome &&
                Array.isArray(item.treino.exercicios)
        );

        setHistorico(dadosValidos.reverse());
    }, []);

    if (!isClient) return null; // <- evita renderização no SSR

    return (
        <div className="container py-4">
            <div className="col-12">
                <Link href="/" className="btn border-0 p-0 mb-2 fw-bold text-lime">
                    <i className="fas fa-chevron-left "></i> Início
                </Link>
            </div>
            <h2 className="mb-4">Histórico de Treinos</h2>

            {historico.length === 0 ? (
                <p>Nenhum treino finalizado ainda.</p>
            ) : (
                <div className="row g-3">
                    {historico.map((item, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">{item.treino.nome}</h5>
                                    <p className="card-text">{item.treino.descricao}</p>

                                    <ul className="mb-2">
                                        {item.treino.exercicios.map((ex, i) => (
                                            <li key={i}>
                                                {ex.name} - {ex.series}x{ex.reps} ({ex.weight}kg)
                                            </li>
                                        ))}
                                    </ul>

                                    <p><strong>Tempo:</strong> {item.tempoExecucao}</p>
                                    <p className="text-muted small">
                                        Finalizado em:{' '}
                                        {item.finalizadoEm
                                            ? new Date(item.finalizadoEm).toLocaleString()
                                            : 'Data não registrada'}
                                    </p>
                                    {item.comentarios && (
                                        <p className="fst-italic">💬 {item.comentarios}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
