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
  Paper,
  Chip,
  Avatar,
} from "@mui/material";
import {
  MenuBook,
  FilterList,
  AutoStories,
} from "@mui/icons-material";
import "../Livro.css";

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "slideIn 0.5s ease-out",
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
            <AutoStories sx={{ fontSize: 48, color: "#667eea" }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Biblioteca
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "#666", fontSize: "1.1rem" }}>
            Explore nossa coleção de livros publicados
          </Typography>
        </Box>

        {/* Filtro */}
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <FilterList sx={{ color: "#667eea", fontSize: 28 }} />
          <FormControl sx={{ minWidth: 250 }} size="small">
            <InputLabel id="select-genero-label">Filtrar por Gênero</InputLabel>
            <Select
              labelId="select-genero-label"
              id="selectGenero"
              value={filtroGenero}
              label="Filtrar por Gênero"
              onChange={(e) => handleFiltrarPorGenero(e.target.value)}
              sx={{
                borderRadius: "12px",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e0e0e0",
                  borderWidth: "2px",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#667eea",
                },
              }}
            >
              <MenuItem value="">
                <em>📚 Todos os Gêneros</em>
              </MenuItem>
              {generos.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  {genre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {filtroGenero && (
            <Chip
              label={`Filtrando: ${filtroGenero}`}
              onDelete={() => setFiltroGenero("")}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
              }}
            />
          )}
        </Box>

        {/* Grid de Livros */}
        {livrosFiltrados.length > 0 ? (
          <Grid container spacing={3}>
            {livrosFiltrados.map((livro) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={livro.id}>
                <Card
                  className="livro-card"
                  onClick={() => handleLivroClick(livro.id)}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  {livro.imagem ? (
                    <CardMedia
                      component="img"
                      image={livro.imagem}
                      alt={`Capa do livro ${livro.titulo}`}
                      sx={{
                        height: 280,
                        objectFit: "cover",
                        borderBottom: "4px solid #667eea",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 280,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "4px solid #764ba2",
                      }}
                    >
                      <MenuBook sx={{ fontSize: 80, color: "rgba(255,255,255,0.8)" }} />
                    </Box>
                  )}
                  <CardContent className="livro-card-content">
                    <Typography className="livro-titulo" component="h3">
                      {livro.titulo}
                    </Typography>
                    <Typography className="livro-info">
                      ✍️ <strong>Autor:</strong> {livro.autor}
                    </Typography>
                    <Typography className="livro-info">
                      🏢 <strong>Editora:</strong> {livro.editora || "N/A"}
                    </Typography>
                    <Typography className="livro-info">
                      📖 <strong>Gênero:</strong> {livro.genero}
                    </Typography>
                    <Typography className="livro-info">
                      📅 <strong>Ano:</strong> {livro.anoPublicacao}
                    </Typography>
                    {livro.preco && (
                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label={`R$ ${livro.preco.toFixed(2).replace(".", ",")}`}
                          sx={{
                            background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                            color: "white",
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              background: "rgba(102, 126, 234, 0.05)",
              borderRadius: "16px",
              border: "2px dashed #667eea",
            }}
          >
            <MenuBook sx={{ fontSize: 80, color: "#667eea", opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#666", fontWeight: 500 }}>
              Nenhum livro encontrado
            </Typography>
            <Typography variant="body2" sx={{ color: "#999", mt: 1 }}>
              {filtroGenero
                ? `Não há livros do gênero "${filtroGenero}"`
                : "Não há livros publicados no momento"}
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default LivrosPublicados;
