import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ListaTreinos() {
    const [treinos, setTreinos] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const dados = JSON.parse(localStorage.getItem('treinos')) || [];
        setTreinos(dados);
    }, []);

    const excluirTreino = (index) => {
        if (confirm('Tem certeza que deseja excluir este treino?')) {
            const atualizados = [...treinos];
            atualizados.splice(index, 1);
            setTreinos(atualizados);
            localStorage.setItem('treinos', JSON.stringify(atualizados));
        }
    };

    return (
        <div className="container py-4">
            <div className="col-12">
                <Link href="/" className="btn border-0 p-0 mb-2 fw-bold  text-lime">
                    <i className="fas fa-chevron-left"></i> Início
                </Link>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className='d-flex justify-content-center align-items-center gap-3'>
                    <img className='opacity-75 ' src="/icons/icon-192.webp" alt="" width={50} />
                    <h2 className='text-center text-secondary fst-italic'>Meus Treinos</h2>
                </div>
                <Link href="/treinos/novo" className="btn custom-btn-lime">
                    <i className="fas fa-plus"></i> Novo treino
                </Link>
            </div>

            {treinos.length === 0 ? (
                <p>Nenhum treino salvo ainda.</p>
            ) : (
                <div className="row g-3">
                    {treinos.map((treino, index) => (
                        <div className="col-md-6" key={index}>
                            <div className="card h-100 bg-dark text-white bg-opacity-75">
                                <div className="card-body">
                                    <h5 className="card-title">{treino.nome}</h5>
                                    <p className="card-text">{treino.descricao}</p>
                                    <p className="text-light small text-end">Criado em: {new Date(treino.criadoEm).toLocaleString()}</p>
                                    <div className="col-12 d-flex justify-content-center align-items-center mb-3">
                                        <Link href={`/treinos/${index}/executar`} className="btn custom-btn-lime w-100">
                                            <i className="fas fa-play"></i> Iniciar
                                        </Link>
                                    </div>
                                    <div className="d-flex flex-wrap gap-4 justify-content-center align-items-center">
                                        <Link href={`/treinos/${index}`} className="btn btn-sm btn-outline-info">
                                            <i className="fas fa-eye"></i> Ver
                                        </Link>
                                        <Link href={`/treinos/editar/${index}`} className="btn btn-sm btn-outline-warning">
                                            <i className="fas fa-edit"></i> Editar
                                        </Link>
                                        <button
                                            onClick={() => excluirTreino(index)}
                                            className="btn btn-sm btn-outline-danger"
                                        >
                                            <i className="fas fa-trash"></i> Excluir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
