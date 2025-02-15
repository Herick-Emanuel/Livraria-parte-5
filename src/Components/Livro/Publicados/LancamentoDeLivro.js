import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from "@mui/material";

const LancamentoDeLivro = () => {
  const [livros, setLivros] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLivros = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3030/livros", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: "Aprovado",
          $limit: 10,
          $sort: { createdAt: -1 },
        },
      });
      console.log("Livros recentes:", response.data);
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
          Nenhum lançamento encontrado ou erro ao carregar os livros.
        </Typography>
      )}
    </Container>
  );
};

export default LancamentoDeLivro;
