import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AvaliacaoLivros from "./AvaliacaoLivros";
import ComentarioLivros from "./ComentarioLivros";

const LivrosDetalhes = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchLivroDetalhes = async () => {
    try {
      const response = await axios.get(`http://localhost:3030/livros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivro(response.data);
    } catch (error) {
      console.error("Erro ao obter detalhes do livro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivroDetalhes();
  }, [id, token]);

  return (
    <div>
      {loading ? (
        <p>Carregando detalhes do livro...</p>
      ) : (
        <div>
          {livro ? (
            <>
              <h2>{livro.titulo}</h2>

              <div>
                <h3>Leitura</h3>
                {livro.leitura}
              </div>

              <div>
                <AvaliacaoLivros />
                <ComentarioLivros />
              </div>

              {livro.comentarios && livro.comentarios.length > 0 ? (
                <ul>
                  {livro.comentarios.map((comentario) => (
                    <li key={comentario.id}>{comentario.texto}</li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum comentário disponível.</p>
              )}
            </>
          ) : (
            <p>Nenhum livro encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LivrosDetalhes;
