import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";

const AvaliacaoLivros = () => {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    console.log("ID do livro:", id);
    try {
      await axios.post(`http://localhost:3030/livros/${id}/avaliacao`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h3>Avaliar Livro</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register("avaliacao")}>
          <option value="1">1 Estrela</option>
          <option value="2">2 Estrelas</option>
          <option value="3">3 Estrelas</option>
          <option value="4">4 Estrelas</option>
          <option value="5">5 Estrelas</option>
        </select>
        <button type="submit">Enviar Avaliação</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default AvaliacaoLivros;