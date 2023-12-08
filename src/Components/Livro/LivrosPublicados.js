import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Livro.css";

const LivrosPublicados = () => {
  const [livros, setLivros] = useState({ data: [] });
  const token = localStorage.getItem("token");

  const fetchLivros = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3030/livros", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: "Aprovado",
        },
      });
      console.log("Dados recebidos:", response.data);
      setLivros(response.data);
    } catch (error) {
      console.error("Erro ao obter livros:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchLivros();
  }, [token, fetchLivros]);

  const handleLivroClick = (livroId) => {
    window.location.href = `/home/livros/${livroId}`;
  };

  return (
    <div>
      <h2>Livros Publicados</h2>
      {livros.data.length > 0 ? (
        <ul>
          {livros.data.map((livro) => (
            <li
              key={livro.id}
              onClick={() => handleLivroClick(livro.id)}
              className="container-livros"
            >
              <p>
                <strong>{livro.titulo}</strong>
              </p>
              <p>Autor: {livro.autor}</p>
              <p>Editora: {livro.editora}</p>
              <p>Ano de Publicação: {livro.anoPublicacao}</p>
              <p>Preço: {livro.preco}</p>
              <p>Descrição: {livro.descricao}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum livro publicado ou erro ao carregar os livros.</p>
      )}
    </div>
  );
};

export default LivrosPublicados;