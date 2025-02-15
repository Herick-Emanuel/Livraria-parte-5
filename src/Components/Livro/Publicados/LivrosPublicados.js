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
  Grid,
} from "@mui/material";

const LivrosPublicados = () => {
  const [livros, setLivros] = useState({ data: [] });
  const [filtroGenero, setFiltroGenero] = useState("");
  const token = localStorage.getItem("token");

  const fetchLivros = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3030/livros", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: "Aprovado" },
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
        Livros Publicados
      </Typography>

      {livrosFiltrados.length > 0 ? (
        <Grid container spacing={2}>
          {livrosFiltrados.map((livro) => (
            <Grid item xs={12} sm={6} md={4} key={livro.id}>
              <Card
                variant="outlined"
                sx={{
                  cursor: "pointer",
                  "&:hover": { boxShadow: 4 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => handleLivroClick(livro.id)}
              >
                {livro.imagem && (
                  <CardMedia
                    component="img"
                    image={livro.imagem}
                    alt={`Capa do livro ${livro.titulo}`}
                    sx={{ height: 140 }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {livro.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Autor: {livro.autor}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Editora: {livro.editora}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Gênero: {livro.genero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ano de Publicação: {livro.anoPublicacao}
                  </Typography>
                  {livro.preco && (
                    <Typography variant="body2" color="text.secondary">
                      Preço: {livro.preco}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1">
          Nenhum livro publicado ou erro ao carregar os livros.
        </Typography>
      )}
    </Container>
  );
};

export default LivrosPublicados;
