import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Livro.css";

const LivroDetalhes = () => {
  const [livro, setLivro] = useState(null);
  const [comentario, setComentario] = useState("");
  const [avaliacao, setAvaliacao] = useState(0);

  const token = localStorage.getItem("token");
  const { id } = useParams();

  useEffect(() => {
    const fetchLivroDetalhes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3030/livros/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLivro(response.data);
      } catch (error) {
        console.error("Erro ao obter detalhes do livro:", error);
      }
    };

    fetchLivroDetalhes();
  }, [token, id]);

  const handleComentarioChange = (e) => {
    setComentario(e.target.value);
  };

  const handleAvaliacaoChange = (e) => {
    setAvaliacao(parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://localhost:3030/livros/${id}/comentarios`,
        { comentario, avaliacao },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Comentário adicionado:", response.data);
      setLivro((livro) => ({
        ...livro,
        comentarios: [...livro.comentarios, response.data],
      }));
      setComentario("");
      setAvaliacao(0);
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error);
    }
  };

  return (
    <div>
      {livro ? (
        <div className="livro-detalhes">
          <h2>{livro.titulo}</h2>
          <p>Autor: {livro.autor}</p>
          <p>Editora: {livro.editora}</p>
          <p>Ano de Publicação: {livro.anoPublicacao}</p>
          <p>Preço: {livro.preco}</p>
          <p>Descrição: {livro.descricao}</p>

          <h3>Comentários</h3>
          {livro.comentarios && livro.comentarios.length > 0 ? (
            <ul>
              {livro.comentarios.map((comentario) => (
                <li key={comentario.id}>
                  <p>{comentario.texto}</p>
                  <p>Avaliação: {comentario.avaliacao}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Nenhum comentário disponível.</p>
          )}

          <h3>Adicionar Comentário</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="comentario">Comentário:</label>
              <textarea
                id="comentario"
                name="comentario"
                value={comentario}
                onChange={handleComentarioChange}
              />
            </div>
            <div>
              <label htmlFor="avaliacao">Avaliação:</label>
              <select
                id="avaliacao"
                name="avaliacao"
                value={avaliacao}
                onChange={handleAvaliacaoChange}
              >
                <option value="0">Selecione...</option>
                <option value="1">1 - Péssimo</option>
                <option value="2">2 - Ruim</option>
                <option value="3">3 - Regular</option>
                <option value="4">4 - Bom</option>
                <option value="5">5 - Excelente</option>
              </select>
            </div>
            <button type="submit">Adicionar Comentário</button>
          </form>
        </div>
      ) : (
        <p>Carregando detalhes do livro...</p>
      )}
    </div>
  );
};

export default LivroDetalhes;
