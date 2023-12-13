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
  const [filtroGenero, setFiltroGenero] = useState("");
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

  const handleChangeGenero = async (livroId) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/livros/${livroId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const currentGenero = response.data.genero;
      let newGenero;

      switch (currentGenero) {
        case "":
          newGenero = "Fantasia";
          break;
        case "Fantasia":
          newGenero = "Romance";
          break;
        case "Romance":
          newGenero = "Distopia";
          break;
        case "Distopia":
          newGenero = "Acao";
          break;
        case "Acao":
          newGenero = "Aventura";
          break;
        case "Aventura":
          newGenero = "Terror";
          break;
        case "Terror":
          newGenero = "Suspense";
          break;
        case "Suspense":
          newGenero = "Historia";
          break;
        case "Historia":
          newGenero = "Cientifico";
          break;
        case "Cientifico":
          newGenero = "Ficcao";
          break;
        case "Ficcao":
          newGenero = "Ficcao Cientifica";
          break;
        default:
          newGenero = "";
          break;
      }

      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { genero: newGenero },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchLivros();
    } catch (error) {
      console.error("Erro ao alterar o genero do livro:", error);
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

  const handleFiltrarPorGenero = (genero) => {
    setFiltroGenero(genero);
  };

  const livrosFiltrados = filtroGenero
    ? livros.data.filter((livro) => livro.genero === filtroGenero)
    : livros.data;

  return (
    <div>
      <div className="container-genero">
        <h2>Filtrar por Gênero:</h2>
        <select
          value={filtroGenero}
          onChange={(e) => handleFiltrarPorGenero(e.target.value)}
        >
          <option value="">Todos</option>
          {[
            "Fantasia",
            "Romance",
            "Terror",
            "Suspense",
            "Acao",
            "Aventura",
            "Ficcao",
            "Ficcao Cientifica",
            "Distopia",
            "Historia",
            "Cientifico",
          ].map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <h2>Livros Cadastrados</h2>
      {livrosFiltrados.length > 0 ? (
        <ul>
          {livrosFiltrados.map((livro) => (
            <li
              key={livro.id}
              className={`container-livros-cadastrados ${
                livro.status === "Reprovado" ? "reprovado" : ""
              }`}
            >
              <p>
                <strong>{livro.titulo}</strong>
              </p>
              <p>Autor: {livro.autor}</p>
              <p>Gênero: {livro.genero}</p>
              <button onClick={() => handleChangeGenero(livro.id)}>
                Alterar Gênero
              </button>
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
