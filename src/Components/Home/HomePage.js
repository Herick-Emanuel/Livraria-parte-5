import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
} from "@mui/material";
import {
  Book as BookOpenIcon,
  People as PeopleIcon,
  Star as StarIcon,
  Bolt as BoltIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import "./HomePage.css";

function HomePage() {
  const livrosDestacados = [
    {
      id: 1,
      titulo: "O Caminho da Ficção",
      autor: "João Silva",
      capa: "📚",
      rating: 4.5,
      reviews: 128,
      genero: "Ficção",
    },
    {
      id: 2,
      titulo: "Aventuras Sem Fim",
      autor: "Maria Santos",
      capa: "🌟",
      rating: 4.8,
      reviews: 256,
      genero: "Aventura",
    },
    {
      id: 3,
      titulo: "Código e Programação",
      autor: "Pedro Costa",
      capa: "💻",
      rating: 4.3,
      reviews: 89,
      genero: "Técnico",
    },
    {
      id: 4,
      titulo: "Histórias de Outro Mundo",
      autor: "Ana Clara",
      capa: "🌌",
      rating: 4.9,
      reviews: 342,
      genero: "Ficção Científica",
    },
  ];

  const categorias = [
    { nome: "Ficção", icon: "📖", cor: "#667eea" },
    { nome: "Mistério", icon: "🔍", cor: "#764ba2" },
    { nome: "Romance", icon: "💕", cor: "#f093fb" },
    { nome: "Técnico", icon: "⚙️", cor: "#4facfe" },
    { nome: "Aventura", icon: "🗺️", cor: "#43e97b" },
    { nome: "Fantasia", icon: "✨", cor: "#fa709a" },
  ];

  const stats = [
    {
      numero: "2.5K+",
      descricao: "Livros Publicados",
      icon: <BookOpenIcon sx={{ fontSize: 40 }} />,
    },
    {
      numero: "15K+",
      descricao: "Leitores Ativos",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
    },
    {
      numero: "4.7★",
      descricao: "Avaliação Média",
      icon: <StarIcon sx={{ fontSize: 40 }} />,
    },
    {
      numero: "500+",
      descricao: "Autores",
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box 
      className="homepage"
      sx={{
        width: "100%",
        minHeight: "100%",
        background: "white",
        display: "block",
      }}
    >
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Box sx={{ py: { xs: 4, md: 8 }, textAlign: "center" }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                fontSize: { xs: "2rem", md: "3.5rem" },
              }}
            >
              📚 Bem-vindo à Livraria
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: "#666",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.3rem" },
              }}
            >
              Descubra milhares de histórias, conecte-se com autores e leitores
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<BookOpenIcon />}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                }}
              >
                Explorar Livros
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<SearchIcon />}
                sx={{
                  borderColor: "#667eea",
                  color: "#667eea",
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: "8px",
                }}
              >
                Buscar
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: "#f9f9f9" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                    borderRadius: "12px",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                  }}
                >
                  <Box sx={{ color: "#667eea", mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
                    {stat.numero}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {stat.descricao}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Books Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#333",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            ⭐ Livros em Destaque
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mb: 4 }}>
            Os títulos mais populares e bem avaliados da nossa plataforma
          </Typography>

          <Grid container spacing={3}>
            {livrosDestacados.map((livro) => (
              <Grid item xs={12} sm={6} md={3} key={livro.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "4rem",
                    }}
                  >
                    {livro.capa}
                  </Box>
                  <CardContent sx={{ flex: 1 }}>
                    <Chip
                      label={livro.genero}
                      size="small"
                      sx={{
                        background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                        color: "white",
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {livro.titulo}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666", mb: 2 }}>
                      por {livro.autor}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Rating value={livro.rating} readOnly size="small" />
                      <Typography variant="caption" sx={{ color: "#999" }}>
                        ({livro.reviews})
                      </Typography>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        fontWeight: 600,
                        borderRadius: "8px",
                      }}
                    >
                      Ler Agora
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8, backgroundColor: "#f9f9f9" }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 4,
              color: "#333",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
            }}
          >
            🏷️ Categorias
          </Typography>

          <Grid container spacing={2}>
            {categorias.map((cat, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${cat.cor}20 0%, ${cat.cor}10 100%)`,
                    border: `2px solid ${cat.cor}40`,
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:hover": {
                      transform: "translateX(8px)",
                      borderColor: cat.cor,
                      boxShadow: `0 8px 16px ${cat.cor}20`,
                    },
                  }}
                >
                  <Box sx={{ fontSize: "2rem" }}>{cat.icon}</Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: cat.cor }}>
                      {cat.nome}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Explorar categoria
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <BoltIcon sx={{ fontSize: 50, mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Quer Publicar Seu Livro?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Junte-se a milhares de autores que já compartilharam suas histórias com o mundo
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "white",
              color: "#667eea",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Começar a Publicar
          </Button>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;
