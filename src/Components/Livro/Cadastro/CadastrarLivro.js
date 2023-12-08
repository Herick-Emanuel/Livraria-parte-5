/*
  Componente CadastrarLivro:
  - Responsável por permitir o usuário cadastrar novos livros.
  - Utiliza React, axios para requisições HTTP.
*/
import React, { useState } from "react";
import axios from "axios";
import "./Cadastro.css";

const CadastrarLivro = () => {
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    editora: "",
    anoPublicacao: 0,
    preco: 0,
    descricao: "",
  });

  const [tipoLivro, setTipoLivro] = useState("fisico");

  const [livroFisico, setLivroFisico] = useState({
    preco: 0,
  });

  const [livroVirtual, setLivroVirtual] = useState({
    leitura: "",
  });

  const [conteudoLivro, setConteudoLivro] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para manipular a mudança de input
  const handleInputChange = (field, value) => {
    setNovoLivro({ ...novoLivro, [field]: value });
  };

  // Função para manipular a mudança de arquivo de conteúdo do livro
  const handleFileInputChange = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setConteudoLivro(e.target.result);
    };

    reader.readAsText(file);
  };

  // Função para adicionar um novo livro
  const handleAdicionarLivro = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isNaN(novoLivro.anoPublicacao)) {
        throw new Error("Ano de Publicação deve ser um número.");
      }

      const token = localStorage.getItem("token");

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

      let livroData = {
        titulo: novoLivro.titulo,
        autor: novoLivro.autor,
        editora: novoLivro.editora,
        anoPublicacao: novoLivro.anoPublicacao,
        descricao: novoLivro.descricao,
      };

      if (tipoLivro === "fisico") {
        livroData = { ...livroData, ...livroFisico };
      } else if (tipoLivro === "virtual") {
        livroData = { ...livroData, ...livroVirtual, leitura: conteudoLivro };
      }

      const response = await axios.post(
        "http://localhost:3030/livros",
        livroData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Resposta da requisição:", response);

      setNovoLivro({
        titulo: "",
        autor: "",
        editora: "",
        anoPublicacao: 0,
        preco: 0,
        descricao: "",
      });

      setLivroFisico({
        preco: 0,
      });

      setLivroVirtual({
        leitura: "",
      });

      setConteudoLivro("");

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
    <div className="container-cadastro">
      <section>
        <h2>Adicionar Livro</h2>
        <form onSubmit={handleAdicionarLivro}>
          <label>Tipo de Livro:</label>
          <select
            value={tipoLivro}
            onChange={(e) => setTipoLivro(e.target.value)}
          >
            <option value="fisico">Físico</option>
            <option value="virtual">Virtual</option>
          </select>

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

          {tipoLivro === "fisico" && (
            <>
              <label>Preço:</label>
              <input
                type="number"
                value={livroFisico.preco}
                onChange={(e) =>
                  setLivroFisico({
                    ...livroFisico,
                    preco: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </>
          )}

          <label>Descrição:</label>
          <textarea
            value={novoLivro.descricao}
            onChange={(e) => handleInputChange("descricao", e.target.value)}
          />

          {tipoLivro === "virtual" && (
            <>
              <label>
                Conteúdo do Livro:
                <input
                  type="file"
                  onChange={(e) => handleFileInputChange(e.target.files[0])}
                />
                <textarea
                  value={conteudoLivro}
                  onChange={(e) => setConteudoLivro(e.target.value)}
                ></textarea>
              </label>
            </>
          )}

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