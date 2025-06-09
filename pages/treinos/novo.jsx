// pages/treinos/novo.jsx
import { useState } from 'react';
import ExerciseForm from '../../components/ExerciseForm';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NovoTreino() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [exercicios, setExercicios] = useState([]);
    const [errors, setErrors] = useState({});

    const router = useRouter();

    const handleAddExercise = () => {
        setExercicios([
            ...exercicios,
            { name: '', video: '', series: '', reps: '', weight: '', rest: '' }
        ]);
    };

    const handleExerciseChange = (index, updated) => {
        const updatedExercises = [...exercicios];
        updatedExercises[index] = updated;
        setExercicios(updatedExercises);
    };

    const handleRemoveExercise = (index) => {
        const updated = [...exercicios];
        updated.splice(index, 1);
        setExercicios(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!nome.trim()) {
            newErrors.nome = 'O nome do treino é obrigatório.';
        }

        if (exercicios.length === 0) {
            newErrors.exercicios = 'Adicione pelo menos um exercício.';
        }

        exercicios.forEach((ex, i) => {
            if (!ex.name || !ex.series || !ex.reps) {
                newErrors[`exercicio_${i}`] = 'Nome, séries e repetições são obrigatórios.';
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Limpar erros
        setErrors({});

        const treino = {
            nome,
            descricao,
            exercicios,
            criadoEm: new Date().toISOString()
        };

        const treinosSalvos = JSON.parse(localStorage.getItem('treinos')) || [];
        treinosSalvos.push(treino);
        localStorage.setItem('treinos', JSON.stringify(treinosSalvos));

        router.push('/treinos');
    };


    return (
        <div className="container py-4">
            <div className="col-12">
                <Link href="/" className="btn border-0 p-0 mb-2 fw-bold">
                    <i className="fas fa-chevron-left "></i> Início
                </Link>
            </div>
            <h2 className="mb-4">Novo Treino</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                        placeholder="Nome do treino (ex: Treino A - Peito)"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}

                </div>

                <div className="mb-4">
                    <textarea
                        className="form-control"
                        placeholder="Descrição do treino"
                        rows="3"
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    ></textarea>
                </div>

                <h4 className="mb-3">Exercícios</h4>
                {errors.exercicios && (
                    <div className="alert alert-danger">{errors.exercicios}</div>
                )}
                {exercicios.map((ex, i) => (
                    <ExerciseForm
                        key={i}
                        index={i}
                        exercise={ex}
                        onChange={handleExerciseChange}
                        onRemove={handleRemoveExercise}
                        error={errors[`exercicio_${i}`]}
                    />

                ))}

                <button type="button" className="btn btn-outline-primary mb-3" onClick={handleAddExercise}>
                    <i className="fas fa-plus"></i> Adicionar exercício
                </button>

                <div>
                    <button type="submit" className="btn btn-success">
                        <i className="fas fa-save"></i> Salvar treino
                    </button>
                </div>
            </form>
        </div>
    );
}
