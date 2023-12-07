import React, { useState } from "react";
import axios from "axios";

const CadastrarLivro = () => {
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    editora: "",
    anoPublicacao: 0,
    preco: 0,
    descricao: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setNovoLivro({ ...novoLivro, [field]: value });
  };

  const handleAdicionarLivro = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNaN(novoLivro.anoPublicacao)) {
        throw new Error("Ano de Publicação deve ser um número.");
      }

      const token = localStorage.getItem("token");

      // Verificar se o livro já existe antes de enviar a requisição
      const livrosExistentes = await axios.get("http://localhost:3030/livros", {
        params: {
          titulo: novoLivro.titulo,
          autor: novoLivro.autor,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (livrosExistentes.data.length > 0) {
        throw new Error("Este livro já foi cadastrado.");
      }

      const response = await axios.post(
        "http://localhost:3030/livros",
        novoLivro,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Livro adicionado:", response.data);

      // Limpar os campos após cadastrar
      setNovoLivro({
        titulo: "",
        autor: "",
        editora: "",
        anoPublicacao: 0,
        preco: 0,
        descricao: "",
      });

      // Exibir alerta de livro cadastrado
      alert("Livro cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar livro", error);
      setError(
        "Erro ao adicionar livro. Verifique os campos e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container2">
      <section>
        <h2>Adicionar Livro</h2>
        <form onSubmit={handleAdicionarLivro}>
          {/* Campos do formulário */}
          <label>Título:</label>
          <input
            type="text"
            value={novoLivro.titulo}
            onChange={(e) => handleInputChange("titulo", e.target.value)}
          />

          <label>Autor:</label>
          <input
            type="text"
            value={novoLivro.autor}
            onChange={(e) => handleInputChange("autor", e.target.value)}
          />

          <label>Editora:</label>
          <input
            type="text"
            value={novoLivro.editora}
            onChange={(e) => handleInputChange("editora", e.target.value)}
          />

          <label>Ano de Publicação:</label>
          <input
            type="number"
            value={novoLivro.anoPublicacao}
            onChange={(e) =>
              handleInputChange(
                "anoPublicacao",
                parseInt(e.target.value, 10) || 0
              )
            }
          />

          <label>Preço:</label>
          <input
            type="number"
            value={novoLivro.preco}
            onChange={(e) =>
              handleInputChange("preco", parseFloat(e.target.value) || 0)
            }
          />

          <label>Descrição:</label>
          <textarea
            value={novoLivro.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
          />

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Adicionar Livro"}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>
      </section>
    </div>
  );
};

export default CadastrarLivro;