import React, { useState } from "react";
import axios from "axios";
import "./Cadastro.css";

import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";

const CadastrarLivro = () => {
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    editora: "",
    genero: "",
    anoPublicacao: "",
    descricao: "",
  });

  const [tipoLivro, setTipoLivro] = useState("fisico");
  const [livroFisico, setLivroFisico] = useState({ preco: "" });
  const [conteudoLivro, setConteudoLivro] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const tiposArquivosPermitidos = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const handleInputChange = (field, value) => {
    setNovoLivro({ ...novoLivro, [field]: value });
  };

  const handleFileInputChange = (file) => {
    if (!file) return;
    if (!tiposArquivosPermitidos.includes(file.type)) {
      setError("Tipo de arquivo não permitido. Aceitamos .doc, .docx, .txt.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setConteudoLivro(e.target.result);
      setError(null);
    };
    reader.readAsText(file);
  };

  const handleGeneroChange = (e) => {
    setNovoLivro({ ...novoLivro, genero: e.target.value });
  };

  const handleAdicionarLivro = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (
        !novoLivro.titulo ||
        !novoLivro.autor ||
        !novoLivro.genero ||
        !novoLivro.anoPublicacao ||
        (tipoLivro === "fisico" && !livroFisico.preco) ||
        (tipoLivro === "virtual" && !conteudoLivro)
      ) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      const ano = parseInt(novoLivro.anoPublicacao, 10);
      if (isNaN(ano) || ano < 0) {
        throw new Error("Ano de Publicação deve ser um número não negativo.");
      }

      let livroData = {
        titulo: novoLivro.titulo,
        autor: novoLivro.autor,
        editora: novoLivro.editora,
        anoPublicacao: ano,
        descricao: novoLivro.descricao,
      };

      if (tipoLivro === "fisico") {
        const precoStr = livroFisico.preco.replace(",", ".");
        const preco = parseFloat(precoStr);
        if (isNaN(preco) || preco < 0) {
          throw new Error("Preço deve ser um número não negativo.");
        }
        livroData = { ...livroData, preco };
      } else {
        livroData = { ...livroData, leitura: conteudoLivro };
      }

      const token = localStorage.getItem("token");
      const livrosExistentes = await axios.get("http://localhost:3030/livros", {
        params: { titulo: novoLivro.titulo, autor: novoLivro.autor },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (livrosExistentes.data.length > 0) {
        throw new Error("Este livro já foi cadastrado.");
      }

      const response = await axios.post(
        "http://localhost:3030/livros",
        livroData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Resposta da requisição:", response);

      setNovoLivro({
        titulo: "",
        autor: "",
        editora: "",
        genero: "",
        anoPublicacao: "",
        descricao: "",
      });
      setLivroFisico({ preco: "" });
      setConteudoLivro("");

      setSuccess("Livro cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar livro", error);
      setError(
        error.message ||
          "Erro ao adicionar livro. Verifique os campos e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-cadastro">
      <h2 className="h2">Adicionar Livro</h2>

      <form className="form" onSubmit={handleAdicionarLivro}>
        <label className="label">Tipo de Livro:</label>
        <FormControl fullWidth>
          <Select
            value={tipoLivro}
            onChange={(e) => setTipoLivro(e.target.value)}
          >
            <MenuItem value="fisico">Físico</MenuItem>
            <MenuItem value="virtual">Virtual</MenuItem>
          </Select>
        </FormControl>

        <label className="label">Título:</label>
        <TextField
          variant="outlined"
          value={novoLivro.titulo}
          onChange={(e) => handleInputChange("titulo", e.target.value)}
          required
        />

        <label className="label">Autor:</label>
        <TextField
          variant="outlined"
          value={novoLivro.autor}
          onChange={(e) => handleInputChange("autor", e.target.value)}
          required
        />

        <label className="label">Gênero:</label>
        <FormControl fullWidth>
          <Select
            value={novoLivro.genero}
            onChange={handleGeneroChange}
            required
          >
            <MenuItem value="">Selecione o Gênero</MenuItem>
            <MenuItem value="Fantasia">Fantasia</MenuItem>
            <MenuItem value="Romance">Romance</MenuItem>
            <MenuItem value="Ficcao">Ficção</MenuItem>
            <MenuItem value="Distopia">Distopia</MenuItem>
            <MenuItem value="Acao">Ação</MenuItem>
            <MenuItem value="Aventura">Aventura</MenuItem>
            <MenuItem value="Ficcao Cientifica">Ficção Científica</MenuItem>
            <MenuItem value="Cientifico">Científico</MenuItem>
            <MenuItem value="Historia">História</MenuItem>
            <MenuItem value="Suspense">Suspense</MenuItem>
            <MenuItem value="Terror">Terror</MenuItem>
          </Select>
        </FormControl>

        <label className="label">Ano de Publicação:</label>
        <TextField
          variant="outlined"
          type="number"
          value={novoLivro.anoPublicacao}
          onChange={(e) => handleInputChange("anoPublicacao", e.target.value)}
          required
        />

        {tipoLivro === "fisico" && (
          <>
            <label className="label">Preço:</label>
            <TextField
              variant="outlined"
              type="text"
              value={livroFisico.preco}
              onChange={(e) =>
                setLivroFisico({ ...livroFisico, preco: e.target.value })
              }
              required
              placeholder='Ex: "13,15"'
            />
            <label className="label">Editora:</label>
            <TextField
              variant="outlined"
              value={novoLivro.editora}
              onChange={(e) => handleInputChange("editora", e.target.value)}
            />
          </>
        )}

        <label className="label">Descrição:</label>
        <textarea
          rows={3}
          value={novoLivro.descricao}
          onChange={(e) => handleInputChange("descricao", e.target.value)}
        />

        {tipoLivro === "virtual" && (
          <>
            <label className="label">Conteúdo do Livro:</label>
            <Button variant="contained" component="label">
              Selecionar Arquivo
              <input
                type="file"
                accept=".doc,.docx,.txt"
                hidden
                onChange={(e) => handleFileInputChange(e.target.files[0])}
                required
              />
            </Button>

            <TextField
              variant="outlined"
              multiline
              rows={4}
              value={conteudoLivro}
              onChange={(e) => setConteudoLivro(e.target.value)}
              placeholder="Conteúdo do arquivo selecionado será exibido aqui."
              InputProps={{ readOnly: true }}
              sx={{ mt: 2 }}
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? "Enviando..." : "Adicionar Livro"}
        </Button>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="error-message" style={{ color: "lightgreen" }}>
            {success}
          </div>
        )}
      </form>
    </div>
  );
};

export default CadastrarLivro;
