import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Box,
  Alert,
  Skeleton,
} from "@mui/material";

const LancamentoDeLivro = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchLivros = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3030/livros", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: "Aprovado",
          $limit: 10,
          $sort: { createdAt: -1 }, // Ordenar pelo mais recente
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setLivros(response.data.data);
      } else {
        setLivros([]);
        console.warn("Formato inesperado de dados:", response.data);
      }
    } catch (error) {
      console.error("Erro ao obter livros:", error);
      setError("Erro ao carregar os lançamentos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const handleLivroClick = (livroId) => {
    window.location.href = `/home/livros/${livroId}`;
  };

  const formatarPreco = (preco) => {
    if (!preco && preco !== 0) return "";

    // Garante que o preço é um número
    const precoNum = Number(preco);
    if (isNaN(precoNum)) return preco;

    // Formata para R$ 0,00
    return `R$ ${precoNum.toFixed(2).replace(".", ",")}`;
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Lançamentos
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card sx={{ height: "100%" }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="h5" gutterBottom>
          Lançamentos
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Lançamentos
      </Typography>

      {livros.length > 0 ? (
        <Grid container spacing={2}>
          {livros.map((livro) => (
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
                {livro.imagem ? (
                  <CardMedia
                    component="img"
                    image={livro.imagem}
                    alt={`Capa do livro ${livro.titulo}`}
                    sx={{ height: 140, objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "grey.200",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Sem imagem
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap title={livro.titulo}>
                    {livro.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Autor:</strong> {livro.autor}
                  </Typography>
                  {livro.editora && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Editora:</strong> {livro.editora}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    <strong>Gênero:</strong> {livro.genero}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Ano:</strong> {livro.anoPublicacao}
                  </Typography>
                  {livro.preco !== null && livro.preco !== undefined && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ fontWeight: "bold", mt: 1 }}
                    >
                      {formatarPreco(livro.preco)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert severity="info">Nenhum lançamento encontrado no momento.</Alert>
      )}
    </Container>
  );
};

export default LancamentoDeLivro;
