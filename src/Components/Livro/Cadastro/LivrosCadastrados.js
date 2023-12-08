/*
  Componente LivrosCadastrados:
  - Responsável por exibir os livros cadastrados e permitir ações como aprovar, reprovar, mudar status.
  - Utiliza React, axios para requisições HTTP.
*/
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "../Livro.css";

const LivrosCadastrados = () => {
  const [livros, setLivros] = useState({ data: [] });
  const token = localStorage.getItem("token");

  const fetchLivros = useCallback(async () => {
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
  }, [token]);

  // Efeito colateral para carregar os livros ao montar o componente
  useEffect(() => {
    fetchLivros();
  }, [token, fetchLivros]);

  // Funções para aprovar, reprovar, mudar status, e atualizar leitura de um livro
  const aprovarLivro = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: "Aprovado" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLivros();
    } catch (error) {
      console.error("Erro ao aprovar o livro:", error);
    }
  };

  const reprovarLivro = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: "Reprovado" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLivros();
    } catch (error) {
      console.error("Erro ao reprovar o livro:", error);
    }
  };

  const handleChangeStatus = async (livroId) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/livros/${livroId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentStatus = response.data.status;
      let newStatus;

      switch (currentStatus) {
        case "Em análise":
          newStatus = "Esgotado";
          break;
        case "Esgotado":
          newStatus = "Revisão";
          break;
        case "Revisão":
          newStatus = "Em análise";
          break;
        default:
          newStatus = "Em análise";
          break;
      }

      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLivros();
    } catch (error) {
      console.error("Erro ao alterar o status do livro:", error);
    }
  };

  const handleAtualizarLeitura = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { leitura: novoConteudoLeitura },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLivros();
      setNovoConteudoLeitura("");
    } catch (error) {
      console.error("Erro ao atualizar a leitura do livro:", error);
    }
  };

  const [novoConteudoLeitura, setNovoConteudoLeitura] = useState("");

  return (
    <div>
      <h2>Livros Cadastrados</h2>
      {livros.data.length > 0 ? (
        <ul>
          {livros.data.map((livro) => (
            <li
              key={livro.id}
              className={`container-livros ${
                livro.status === "Reprovado" ? "reprovado" : ""
              }`}
            >
              <p>
                <strong>{livro.titulo}</strong>
              </p>
              <p>Autor: {livro.autor}</p>
              <p>Editora: {livro.editora}</p>
              <p>Ano de Publicação: {livro.anoPublicacao}</p>
              <p>Preço: {livro.preco}</p>
              <p>Descrição: {livro.descricao}</p>
              <p>Status: {livro.status}</p>
              {livro.status === "Em análise" && (
                <>
                  <button onClick={() => aprovarLivro(livro.id)}>
                    Aprovar
                  </button>
                  <button onClick={() => reprovarLivro(livro.id)}>
                    Reprovar
                  </button>
                </>
              )}
              <button onClick={() => handleChangeStatus(livro.id)}>
                Mudar Status
              </button>

              <label>Novo Conteúdo de Leitura:</label>
              <textarea
                value={novoConteudoLeitura}
                onChange={(e) => setNovoConteudoLeitura(e.target.value)}
              ></textarea>
              <button onClick={() => handleAtualizarLeitura(livro.id)}>
                Atualizar Leitura
              </button>
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