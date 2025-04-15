import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import AvaliacaoLivros from "./AvaliacaoLivros";
import ComentarioLivros from "./ComentarioLivros";
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const LivrosDetalhes = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLivroDetalhes = async () => {
    try {
      const response = await axios.get(`http://localhost:3030/livros/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLivro(response.data);

      // Buscar comentários mais recentes
      if (response.data.comentarios) {
        setComentarios(response.data.comentarios);
      }
    } catch (error) {
      console.error("Erro ao obter detalhes do livro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivroDetalhes();
  }, [id, token]);

  // Função para atualizar comentários após novo envio
  const atualizarComentarios = () => {
    fetchLivroDetalhes();
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Typography variant="h6" align="center">
          Carregando detalhes do livro...
        </Typography>
      ) : (
        <div>
          {livro ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h4" component="h1" gutterBottom>
                    {livro.titulo}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      {livro.imagem ? (
                        <Box
                          component="img"
                          sx={{
                            width: "100%",
                            maxHeight: 300,
                            objectFit: "contain",
                            borderRadius: 1,
                          }}
                          src={livro.imagem}
                          alt={`Capa do livro ${livro.titulo}`}
                        />
                      ) : (
                        <Paper
                          sx={{
                            height: 200,
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: "grey.200",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Sem imagem disponível
                          </Typography>
                        </Paper>
                      )}
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Typography variant="body1" gutterBottom>
                        <strong>Autor:</strong> {livro.autor}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Editora:</strong>{" "}
                        {livro.editora || "Não informada"}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Gênero:</strong> {livro.genero}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Ano de Publicação:</strong>{" "}
                        {livro.anoPublicacao}
                      </Typography>
                      {livro.preco && (
                        <Typography variant="body1" gutterBottom>
                          <strong>Preço:</strong> R${" "}
                          {livro.preco.toFixed(2).replace(".", ",")}
                        </Typography>
                      )}
                      {livro.descricao && (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          <strong>Descrição:</strong> {livro.descricao}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {livro.leitura && (
                <Grid item xs={12}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="h5" gutterBottom>
                      Leitura
                    </Typography>
                    <Box
                      sx={{
                        whiteSpace: "pre-line",
                        p: 2,
                        bgcolor: "grey.100",
                        borderRadius: 1,
                        maxHeight: "300px",
                        overflow: "auto",
                      }}
                    >
                      {livro.leitura}
                    </Box>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <AvaliacaoLivros
                        onAvaliacaoEnviada={atualizarComentarios}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ComentarioLivros
                        onComentarioEnviado={atualizarComentarios}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h5" gutterBottom>
                    Comentários
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {comentarios && comentarios.length > 0 ? (
                    <Box>
                      {comentarios.map((comentario, index) => (
                        <Card
                          key={comentario.id || index}
                          variant="outlined"
                          sx={{ mb: 1 }}
                        >
                          <CardContent>
                            <Typography variant="body2">
                              {comentario.texto || comentario.comentario}
                            </Typography>
                            {comentario.usuario && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Por: {comentario.usuario}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body1">
                      Nenhum comentário disponível.
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" align="center">
                Nenhum livro encontrado.
              </Typography>
            </Paper>
          )}
        </div>
      )}
    </Container>
  );
};

export default LivrosDetalhes;
