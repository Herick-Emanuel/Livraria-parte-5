import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const LivrosDetalhes = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchComentariosLivro = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:3030/livros/${id}/comentarios`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Comentários do Livro:", response.data);
      setComentarios(response.data);
    } catch (error) {
      console.error("Erro ao obter comentários do livro:", error);
    }
  }, [token, id]);

  const fetchLivroDetalhes = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3030/livros/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Detalhes do Livro:", response.data);
      setLivro(response.data);
      fetchComentariosLivro();
    } catch (error) {
      console.error("Erro ao obter detalhes do livro:", error);
    } finally {
      setLoading(false);
    }
  }, [token, id, fetchComentariosLivro]);

  useEffect(() => {
    fetchLivroDetalhes();
  }, [fetchLivroDetalhes]);

  const handleAvaliacaoChange = (event) => {
    setAvaliacao(parseInt(event.target.value, 10));
  };

  const handleComentarioChange = (event) => {
    setComentario(event.target.value);
  };

  const handleSubmitAvaliacao = async () => {
    try {
      await axios.post(
        `http://localhost:3030/livros/${id}/avaliacao`,
        { avaliacao },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Avaliação enviada!");
      fetchComentariosLivro();
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  const handleSubmitComentario = async () => {
    try {
      await axios.post(
        `http://localhost:3030/livros/${id}/comentarios`,
        { texto: comentario },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Comentário enviado!");
      fetchComentariosLivro();
      setComentario("");
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Carregando detalhes do livro...</p>
      ) : (
        <div>
          {livro ? (
            <>
              <h2>{livro.titulo}</h2>
              <p>Autor: {livro.autor}</p>
              <p>Editora: {livro.editora}</p>
              <p>Ano de Publicação: {livro.anoPublicacao}</p>
              <p>Preço: {livro.preco}</p>
              <p>Descrição: {livro.descricao}</p>

              {/* Seção de Leitura do Livro */}
              <div>
                <h3>Leitura</h3>
                {/* Exiba o conteúdo da leitura aqui */}
              </div>

              {/* Seção de Avaliação e Comentários */}
              <div>
                <h3>Avaliação</h3>
                <select value={avaliacao} onChange={handleAvaliacaoChange}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button onClick={handleSubmitAvaliacao}>Avaliar</button>

                <h3>Comentários</h3>
                <textarea
                  value={comentario}
                  onChange={handleComentarioChange}
                  rows="4"
                ></textarea>
                <button onClick={handleSubmitComentario}>
                  Enviar Comentário
                </button>

                {comentarios.length > 0 ? (
                  <ul>
                    {comentarios.map((comentario) => (
                      <li key={comentario.id}>{comentario.texto}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Nenhum comentário disponível.</p>
                )}
              </div>
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