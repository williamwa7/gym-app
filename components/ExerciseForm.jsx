// components/ExerciseForm.jsx
import { useState } from 'react';

export default function ExerciseForm({ index, exercise, onChange, onRemove, error }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(index, { ...exercise, [name]: value });
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">Exercício {index + 1}</h5>
                {error && (
                    <div className="alert alert-danger py-2 px-3 mb-3">
                        <strong>Erro no exercício {index + 1}:</strong> {error}
                    </div>
                )}
                <div className="row g-2">
                    <div className="col-md-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nome do exercício"
                            name="name"
                            value={exercise.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="col-md-6">
                        <input
                            type="url"
                            className="form-control"
                            placeholder="Link do vídeo (YouTube ou GIF)"
                            name="video"
                            value={exercise.video}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Séries"
                            name="series"
                            value={exercise.series}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Repetições"
                            name="reps"
                            value={exercise.reps}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Carga (kg)"
                            name="weight"
                            value={exercise.weight}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Descanso (ex: 60s)"
                            name="rest"
                            value={exercise.rest}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-3"
                    onClick={() => onRemove(index)}
                >
                    <i className="fas fa-trash-alt"></i> Remover exercício
                </button>
            </div>
        </div>
    );
}
