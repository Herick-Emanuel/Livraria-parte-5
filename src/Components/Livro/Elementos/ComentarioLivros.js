import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";

const ComentarioLivros = () => {
  const { id } = useParams();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    console.log("ID do livro:", id);
    try {
      await axios.post(`http://localhost:3030/livros/${id}/comentarios`, data, {
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
      <h3>Comentar Livro</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("comentario")} />
        <button type="submit">Enviar Comentário</button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
};

export default ComentarioLivros;