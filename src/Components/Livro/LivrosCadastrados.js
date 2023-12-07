import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Livro.css";

const LivrosCadastrados = () => {
  const [livros, setLivros] = useState({ data: [] });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await axios.get("http://localhost:3030/livros", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Dados recebidos:", response.data);
        setLivros(response.data);
      } catch (error) {
        console.error("Erro ao obter livros:", error);
      }
    };

    fetchLivros();
  }, [token]);

  return (
    <div>
      <h2>Livros Cadastrados</h2>
      {livros.data.length > 0 ? (
        <ul>
          {livros.data.map((livro) => (
            <li key={livro.id} className="container-livros">
              <Link to={`/home/livros/${livro.id}`}>
                <p>
                  <strong>{livro.titulo}</strong>
                </p>
              </Link>
              <p>Autor: {livro.autor}</p>
              <p>Editora: {livro.editora}</p>
              <p>Ano de Publicação: {livro.anoPublicacao}</p>
              <p>Preço: {livro.preco}</p>
              <p>Descrição: {livro.descricao}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum livro cadastrado ou erro ao carregar os livros.</p>
      )}
    </div>
  );
};

export default LivrosCadastrados;
