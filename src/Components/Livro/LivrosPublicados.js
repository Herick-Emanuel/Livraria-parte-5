import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./Livro.css";

const LivrosPublicados = () => {
  const [livros, setLivros] = useState({ data: [] });
  const [filtroGenero, setFiltroGenero] = useState("");
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

  const handleFiltrarPorGenero = (genero) => {
    setFiltroGenero(genero);
  };

  const livrosFiltrados = filtroGenero
    ? livros.data.filter((livro) => livro.genero === filtroGenero)
    : livros.data;

  return (
    <div>
      <div className="container-genero">
        <label htmlFor="selectGenero">Filtrar por Gênero:</label>
        <select
        id="selectGenero"
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
      <h2>Livros Publicados</h2>
      {livrosFiltrados.length > 0 ? (
        <ul>
          {livrosFiltrados.map((livro) => (
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
              <p>Gênero: {livro.genero}</p>
              <p>Ano de Publicação: {livro.anoPublicacao}</p>
              <p>Preço: {livro.preco}</p>
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