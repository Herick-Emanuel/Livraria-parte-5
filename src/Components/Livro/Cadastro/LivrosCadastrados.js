import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Grid,
} from "@mui/material";

const LivrosCadastrados = () => {
  const [livros, setLivros] = useState({ data: [] });
  const [filtroGenero, setFiltroGenero] = useState("");
  const token = localStorage.getItem("token");
  const [novoConteudoLeitura, setNovoConteudoLeitura] = useState("");
  const fetchLivros = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3030/livros", {
        headers: { Authorization: `Bearer ${token}` },
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

  const aprovarLivro = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: "Aprovado" },
        { headers: { Authorization: `Bearer ${token}` } }
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
        { headers: { Authorization: `Bearer ${token}` } }
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
          headers: { Authorization: `Bearer ${token}` },
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
        { headers: { Authorization: `Bearer ${token}` } }
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
          headers: { Authorization: `Bearer ${token}` },
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLivros();
      console.log("Novo gênero:", newGenero);
    } catch (error) {
      console.error("Erro ao alterar o gênero do livro:", error);
    }
  };

  const handleAtualizarLeitura = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { leitura: novoConteudoLeitura },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLivros();
      setNovoConteudoLeitura("");
    } catch (error) {
      console.error("Erro ao atualizar a leitura do livro:", error);
    }
  };
  const handleFiltrarPorGenero = (genero) => {
    setFiltroGenero(genero);
  };

  const livrosFiltrados = filtroGenero
    ? livros.data.filter((livro) => livro.genero === filtroGenero)
    : livros.data;

  const generos = [
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
  ];

  return (
    <Container sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="select-genero-label">Filtrar por Gênero</InputLabel>
          <Select
            labelId="select-genero-label"
            id="selectGenero"
            value={filtroGenero}
            label="Filtrar por Gênero"
            onChange={(e) => handleFiltrarPorGenero(e.target.value)}
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {generos.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h5" gutterBottom>
        Livros Cadastrados
      </Typography>

      {livrosFiltrados.length > 0 ? (
        <Grid container spacing={2}>
          {livrosFiltrados.map((livro) => (
            <Grid item xs={12} sm={6} md={4} key={livro.id}>
              <Card
                variant="outlined"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {livro.capa && (
                  <CardMedia
                    component="img"
                    image={livro.capa}
                    alt={`Capa do livro ${livro.titulo}`}
                    sx={{ height: 140 }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {livro.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Autor: {livro.autor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gênero: {livro.genero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Editora: {livro.editora}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ano: {livro.anoPublicacao}
                  </Typography>
                  {livro.preco && (
                    <Typography variant="body2" color="text.secondary">
                      Preço: {livro.preco}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Descrição: {livro.descricao}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {livro.status}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleChangeGenero(livro.id)}
                    >
                      Alterar Gênero
                    </Button>
                    {livro.status === "Em análise" && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => aprovarLivro(livro.id)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => reprovarLivro(livro.id)}
                        >
                          Reprovar
                        </Button>
                      </Box>
                    )}
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleChangeStatus(livro.id)}
                    >
                      Mudar Status
                    </Button>
                    <TextField
                      label="Novo Conteúdo de Leitura"
                      multiline
                      rows={2}
                      variant="outlined"
                      size="small"
                      value={novoConteudoLeitura}
                      onChange={(e) => setNovoConteudoLeitura(e.target.value)}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleAtualizarLeitura(livro.id)}
                    >
                      Atualizar Leitura
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">
          Nenhum livro cadastrado ou erro ao carregar os livros.
        </Typography>
      )}
    </Container>
  );
};

export default LivrosCadastrados;
