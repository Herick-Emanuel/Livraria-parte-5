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
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  MenuBook,
  Person,
  CalendarToday,
  Category,
  Business,
  AttachMoney,
} from "@mui/icons-material";
import "../Livro.css";

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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress sx={{ color: "#667eea", mb: 2 }} size={60} />
          <Typography variant="h6" sx={{ color: "#667eea" }}>
            Carregando detalhes do livro...
          </Typography>
        </Box>
      ) : (
        <div>
          {livro ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  className="fade-in"
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "24px",
                    padding: "40px",
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Barra superior decorativa */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    }}
                  />

                  <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      mb: 4,
                    }}
                  >
                    {livro.titulo}
                  </Typography>

                  <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                      {livro.imagem ? (
                        <Box
                          component="img"
                          sx={{
                            width: "100%",
                            maxHeight: 450,
                            objectFit: "cover",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                            border: "4px solid #667eea",
                          }}
                          src={livro.imagem}
                          alt={`Capa do livro ${livro.titulo}`}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 450,
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                          }}
                        >
                          <MenuBook sx={{ fontSize: 100, color: "rgba(255,255,255,0.8)", mb: 2 }} />
                          <Typography variant="body1" sx={{ color: "white" }}>
                            Sem imagem disponível
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Person sx={{ color: "#667eea", fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: "#333" }}>
                            <strong>Autor:</strong> {livro.autor}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Business sx={{ color: "#667eea", fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: "#333" }}>
                            <strong>Editora:</strong> {livro.editora || "Não informada"}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <Category sx={{ color: "#667eea", fontSize: 28 }} />
                          <Chip
                            label={livro.genero}
                            sx={{
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                              color: "white",
                              fontWeight: 600,
                              fontSize: "1rem",
                              padding: "20px 12px",
                            }}
                          />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <CalendarToday sx={{ color: "#667eea", fontSize: 28 }} />
                          <Typography variant="h6" sx={{ color: "#333" }}>
                            <strong>Ano:</strong> {livro.anoPublicacao}
                          </Typography>
                        </Box>

                        {livro.preco && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <AttachMoney sx={{ color: "#4ade80", fontSize: 28 }} />
                            <Chip
                              label={`R$ ${livro.preco.toFixed(2).replace(".", ",")}`}
                              sx={{
                                background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "1.3rem",
                                padding: "25px 15px",
                              }}
                            />
                          </Box>
                        )}

                        {livro.descricao && (
                          <Box
                            sx={{
                              mt: 3,
                              p: 3,
                              background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
                              borderRadius: "16px",
                              boxShadow: "0 8px 20px rgba(253, 203, 110, 0.3)",
                            }}
                          >
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
                              📝 Descrição
                            </Typography>
                            <Typography variant="body1" sx={{ color: "#333", lineHeight: 1.7 }}>
                              {livro.descricao}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {livro.leitura && (
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      background: "rgba(255, 255, 255, 0.95)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "24px",
                      padding: "30px",
                      boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <MenuBook sx={{ color: "#667eea", fontSize: 32 }} />
                      Conteúdo do Livro
                    </Typography>
                    <Box
                      sx={{
                        whiteSpace: "pre-line",
                        p: 3,
                        bgcolor: "#f9fafb",
                        borderRadius: "12px",
                        maxHeight: "400px",
                        overflow: "auto",
                        border: "2px solid #e5e7eb",
                        fontFamily: "'Georgia', serif",
                        fontSize: "1.05rem",
                        lineHeight: 1.8,
                        color: "#333",
                      }}
                    >
                      {livro.leitura}
                    </Box>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "24px",
                    padding: "30px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <AvaliacaoLivros onAvaliacaoEnviada={atualizarComentarios} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <ComentarioLivros onComentarioEnviado={atualizarComentarios} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "24px",
                    padding: "30px",
                    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#333",
                      mb: 3,
                    }}
                  >
                    💬 Comentários
                  </Typography>
                  <Divider sx={{ mb: 3, borderColor: "#e5e7eb" }} />

                  {comentarios && comentarios.length > 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {comentarios.map((comentario, index) => (
                        <Card
                          key={comentario.id || index}
                          sx={{
                            borderRadius: "12px",
                            border: "2px solid #e5e7eb",
                            boxShadow: "none",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: "#667eea",
                              boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
                            },
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: "flex", alignItems: "start", gap: 2 }}>
                              <Avatar
                                sx={{
                                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                }}
                              >
                                {comentario.usuario ? comentario.usuario[0].toUpperCase() : "?"}
                              </Avatar>
                              <Box sx={{ flex: 1 }}>
                                <Typography
                                  variant="body1"
                                  sx={{ color: "#333", mb: 1, lineHeight: 1.6 }}
                                >
                                  {comentario.texto || comentario.comentario}
                                </Typography>
                                {comentario.usuario && (
                                  <Typography variant="caption" sx={{ color: "#667eea", fontWeight: 500 }}>
                                    — {comentario.usuario}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 6,
                        background: "rgba(102, 126, 234, 0.05)",
                        borderRadius: "12px",
                        border: "2px dashed #667eea",
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#666" }}>
                        Nenhum comentário ainda. Seja o primeiro a comentar!
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Paper
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "24px",
                padding: "60px 40px",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                textAlign: "center",
              }}
            >
              <MenuBook sx={{ fontSize: 80, color: "#667eea", opacity: 0.5, mb: 2 }} />
              <Typography variant="h5" sx={{ color: "#666", fontWeight: 500 }}>
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
