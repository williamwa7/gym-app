import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Modal, Button, Accordion, Card } from 'react-bootstrap';

export default function ExecutarTreino() {
    const router = useRouter();
    const audioRef = useRef(null);

    const { id } = router.query;

    const [treino, setTreino] = useState(null);
    const [tempo, setTempo] = useState(0);
    const [cronExecucao, setCronExecucao] = useState(null);

    /* comentários / finalização */
    const [comentarios, setComentarios] = useState('');
    const [finalizados, setFinalizados] = useState([]);    // 1 por exercício
    const [seriesChecks, setSeriesChecks] = useState([]);  // matriz [ex][serie]
    const [prontoParaFinalizar, setProntoParaFinalizar] = useState(false);

    /* intervalo */
    const [showIntervalo, setShowIntervalo] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(0);
    const cronIntervalo = useRef(null);

    /* carregar treino */
    useEffect(() => {
        if (id !== undefined) {
            const treinosSalvos = JSON.parse(localStorage.getItem('treinos')) || [];
            const selecionado = treinosSalvos[id];
            if (selecionado) {
                setTreino(selecionado);
                setFinalizados(new Array(selecionado.exercicios.length).fill(false));
                setSeriesChecks(
                    selecionado.exercicios.map((ex) =>
                        new Array(Number(ex.series) || 1).fill(false)
                    )
                );
            }
        }
    }, [id]);

    /* cronômetro geral */
    useEffect(() => {
        const cron = setInterval(() => setTempo((p) => p + 1), 1000);
        setCronExecucao(cron);
        return () => clearInterval(cron);
    }, []);

    /* intervalo de descanso */
    useEffect(() => {
        if (!showIntervalo) return;
        cronIntervalo.current = setInterval(() => {
            setTempoRestante((p) => p - 1);
        }, 1000);
        return () => clearInterval(cronIntervalo.current);
    }, [showIntervalo]);

    useEffect(() => {
        if (!showIntervalo) return;

        // Tocar o áudio quando estiver entre 5 e 1 segundos restantes
        if (tempoRestante <= 5 && tempoRestante > 0 && audioRef.current) {
            audioRef.current.play().catch((e) =>
                console.warn('Falha ao tocar o áudio:', e)
            );
        }

        // Quando o tempo chega a 0
        if (tempoRestante === 0) {
            clearInterval(cronIntervalo.current);
            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
            }
            setShowIntervalo(false);
        }
    }, [tempoRestante, showIntervalo]);



    /* helpers */
    const formatarTempo = (seg) => {
        const h = String(Math.floor(seg / 3600)).padStart(2, '0');
        const m = String(Math.floor((seg % 3600) / 60)).padStart(2, '0');
        const s = String(seg % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    /* por SÉRIE */
    const toggleSerie = (exIdx, serieIdx) => {
        setSeriesChecks((prev) => {
            const copia = prev.map((arr) => [...arr]);
            copia[exIdx][serieIdx] = !copia[exIdx][serieIdx];
            const todas = copia[exIdx].every(Boolean);
            atualizarFinalizado(exIdx, todas);
            return copia;
        });
    };

    /* “Finalizar exercício” */
    const toggleExercicioCompleto = (exIdx) => {
        setSeriesChecks((prev) => {
            const copia = prev.map((arr) => [...arr]);
            const marcar = !finalizados[exIdx];
            copia[exIdx] = copia[exIdx].map(() => marcar);
            atualizarFinalizado(exIdx, marcar);
            return copia;
        });
    };

    const atualizarFinalizado = (exIdx, status) => {
        setFinalizados((prev) => {
            const copia = [...prev];
            copia[exIdx] = status;
            setProntoParaFinalizar(copia.every(Boolean));
            return copia;
        });
    };

    /* ---------- iniciar intervalo ---------- */
    // 🆕 agora recebe exIdx para saber qual exercício está em descanso
    const iniciarIntervalo = (exIdx, seg) => {
        /* marca a PRÓXIMA série não concluída desse exercício */
        setSeriesChecks((prev) => {
            const copia = prev.map((arr) => [...arr]);
            const proxima = copia[exIdx].findIndex((val) => !val);
            if (proxima !== -1) {
                copia[exIdx][proxima] = true;
                const todas = copia[exIdx].every(Boolean);
                atualizarFinalizado(exIdx, todas);
            }
            return copia;
        });

        /* abre o modal e inicia contagem */
        clearInterval(cronIntervalo.current);
        setTempoRestante(seg);
        setShowIntervalo(true);
    };

    /* salvar */
    const salvarNoHistorico = () => {
        clearInterval(cronExecucao);
        const hist = JSON.parse(localStorage.getItem('historicoTreinos')) || [];
        hist.push({
            treino,
            finalizadoEm: new Date().toISOString(),
            tempoExecucao: formatarTempo(tempo),
            comentarios,
        });
        localStorage.setItem('historicoTreinos', JSON.stringify(hist));
        alert('Treino finalizado e salvo no histórico!');
        router.push('/treinos/historico');
    };

    if (!treino) return <p className="text-center mt-5">Carregando treino...</p>;

    return (
        <>
            <div className="container py-4">
                {/* header */}
                <div className="col-12 mb-3">
                    <Link href="/treinos" passHref>
                        <button className="btn border-0 fw-bold text-lime">
                            <i className="fas fa-chevron-left" /> Voltar
                        </button>
                    </Link>
                </div>

                {/* info */}
                <div className="col-12 text-center">
                    <h2 className="mb-3">{treino.nome}</h2>
                    <small className="small px-4">{treino.descricao}</small>
                    <p className="text-lime fs-5 d-flex flex-column mt-4">
                        Tempo de execução:
                        <strong className='display-1 fw-bold'>{formatarTempo(tempo)}</strong>
                    </p>
                </div>

                <hr className="my-4" />

                {/* Exercícios */}
                <Accordion alwaysOpen>
                    {treino.exercicios.map((ex, exIdx) => (
                        <Accordion.Item eventKey={exIdx.toString()} key={exIdx} className='accordion-dark'>
                            <Accordion.Header className='bg-dark text-white'>
                                <div className="d-flex align-items-center w-100 justify-content-between">
                                    {/* checkbox concluir exercício */}
                                    <div className="form-check me-3">
                                        <input
                                            className="form-check-input custom-checkbox"
                                            type="checkbox"
                                            id={`ex-done-${exIdx}`}
                                            checked={finalizados[exIdx]}
                                            onChange={() => toggleExercicioCompleto(exIdx)}
                                        />
                                    </div>

                                    <span className="flex-grow-1">{ex.name}</span>
                                </div>
                            </Accordion.Header>

                            <Accordion.Body className='bg-dark text-white py-5'>
                                <p className="flex-grow-1 text-center">
                                    {ex.series} séries de {ex.reps} repetições
                                    {ex.weight ? ` (${ex.weight} kg)` : ''}
                                </p>

                                {/* séries */}
                                {seriesChecks[exIdx].map((serieMarcada, serieIdx) => (
                                    <Card
                                        key={serieIdx}
                                        className="mb-2 p-2 px-3 d-flex flex-row align-items-center bg-secondary text-white"
                                        onClick={() => toggleSerie(exIdx, serieIdx)}
                                    >
                                        <input
                                            className="form-check-input custom-checkbox me-2"
                                            type="checkbox"
                                            id={`ex${exIdx}-serie${serieIdx}`}
                                            checked={serieMarcada}
                                            onChange={() => toggleSerie(exIdx, serieIdx)}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={`ex${exIdx}-serie${serieIdx}`}
                                        >
                                            Série {serieIdx + 1}
                                        </label>
                                    </Card>
                                ))}


                                <p className='mt-3 text-center text-muted' style={{ fontSize: '0.7rem' }}>Clique no botão abaixo para finalizar a série atual e iniciar o intervalo</p>

                                {/* botão intervalo */}
                                {ex.rest && !finalizados[exIdx] && (
                                    <button
                                        className="btn btn-outline-success col-12"
                                        onClick={() => iniciarIntervalo(exIdx, +ex.rest)} // 🆕 exIdx
                                    >
                                        <i className="fas fa-stopwatch me-1" />
                                        Iniciar Intervalo ({ex.rest}s)
                                    </button>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>

                {/* comentários / finalização */}
                {prontoParaFinalizar && (
                    <div className='col-12 d-flex flex-column'>
                        <textarea
                            className="form-control my-3"
                            rows="3"
                            placeholder="Comentários, observações, sugestões..."
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                        />

                        <button onClick={salvarNoHistorico} className="btn btn-success">
                            <i className="fas fa-check-circle me-2" />
                            Finalizar Treino
                        </button>
                    </div>
                )}

                {/* Modal Intervalo */}
                <Modal
                    show={showIntervalo}
                    backdrop="static"
                    keyboard={false}
                    centered
                    fullscreen
                    onHide={() => setShowIntervalo(false)}                    
                    
                >
                    <Modal.Body className="text-center bg-dark text-white">
                        <div className='h-100 d-flex flex-column justify-content-center align-items-center'>

                            <h4 className="mb-4">Intervalo</h4>
                            <h5>Rest</h5>
                            <p className="display-1 fw-bold text-lime" style={{ fontSize: '4.5rem' }}>{formatarTempo(tempoRestante)}</p>
                            <Button
                                variant="outline-danger btn-lg"
                                className="mt-3"
                                onClick={() => setShowIntervalo(false)}
                            >
                                Parar Intervalo
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
            <audio ref={audioRef} src="/sounds/54321.mp3" preload="auto" />
        </>
    );
}
