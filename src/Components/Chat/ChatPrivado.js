import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Badge,
  InputAdornment,
  Chip,
  Grid,
} from "@mui/material";
import {
  Send as SendIcon,
  Search as SearchIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material";
import "./ChatPrivado.css";

function ChatPrivado() {
  const { id } = useParams();
  const [amigos, setAmigos] = useState([]);
  const [conversas, setConversas] = useState([]);
  const [amigoSelecionado, setAmigoSelecionado] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const meuId = parseInt(localStorage.getItem("id"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3030/usuario/${meuId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarioLogado(data);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      }
    };
    carregarUsuario();
  }, [meuId, token]);

  useEffect(() => {
    if (id && amigos.length > 0) {
      const amigo = amigos.find(a => a.id === parseInt(id));
      if (amigo) {
        setAmigoSelecionado(amigo);
      }
    }
  }, [id, amigos]);

  useEffect(() => {
    const carregarAmigos = async () => {
      try {
        setCarregando(true);
        const { data } = await axios.get(
          "http://localhost:3030/amizades",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { 
              status: "aceito",
              $or: [{ usuario_id: meuId }, { amigo_id: meuId }],
            },
          }
        );

        let amizades = data.data || [];
        
        // Fallback: se $or não funcionou, carregar todas e filtrar no cliente
        if (amizades.length === 0) {
          const { data: todasAmizades } = await axios.get(
            "http://localhost:3030/amizades",
            {
              headers: { Authorization: `Bearer ${token}` },
              params: { status: "aceito" },
            }
          );
          amizades = (todasAmizades.data || []).filter(a => 
            a.usuario_id === meuId || a.amigo_id === meuId
          );
        }

        const amigosFormatados = amizades.map((amizade) => {
          const amigo =
            amizade.usuario_id === meuId ? amizade.amigo : amizade.usuario;
          console.log("Amizade carregada:", { amizade_id: amizade.id, amigo: amigo?.apelido, amigo_id: amigo?.id });
          return {
            ...amigo,
            amizadeId: amizade.id,
          };
        }).filter(a => a.id); // Filtrar itens sem id

        console.log("Amigos carregados no chat:", amigosFormatados);
        setAmigos(amigosFormatados);
      } catch (error) {
        console.error("Erro ao carregar amigos:", error);
      } finally {
        setCarregando(false);
      }
    };

    if (meuId && token) {
      carregarAmigos();
    }
  }, [meuId, token]);

  useEffect(() => {
    if (amigoSelecionado) {
      carregarMensagens();
    }
  }, [amigoSelecionado]);

  const carregarMensagens = async () => {
    try {
      // O servidor filtra automaticamente via hook restrictMessageAccess
      const { data } = await axios.get(
        "http://localhost:3030/mensagens",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            // Filtrar por amigo específico
            $or: [
              { destinatario_id: amigoSelecionado.id },
              { remetente_id: amigoSelecionado.id }
            ]
          }
        }
      );
      const mensagensOrdenadas = (data.data || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMensagens(mensagensOrdenadas);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
      // Fallback: carregar todas as mensagens e filtrar no cliente
      try {
        const { data: fallback } = await axios.get(
          "http://localhost:3030/mensagens",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        const filtradas = (fallback.data || []).filter(msg =>
          (msg.remetente_id === meuId && msg.destinatario_id === amigoSelecionado.id) ||
          (msg.remetente_id === amigoSelecionado.id && msg.destinatario_id === meuId)
        );
        const ordenadas = filtradas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setMensagens(ordenadas);
      } catch (fallbackError) {
        console.error("Erro no fallback:", fallbackError);
      }
    }
  };

  const enviarMensagem = async () => {
    if (!mensagem.trim() || !amigoSelecionado) return;

    try {
      await axios.post(
        "http://localhost:3030/mensagens",
        {
          remetente_id: meuId,
          destinatario_id: amigoSelecionado.id,
          mensagem: mensagem,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMensagem("");
      carregarMensagens();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const amigosFiltrados = amigos.filter((amigo) =>
    (amigo.apelido || "").toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <Box className="chat-container">
      <Grid container spacing={0} sx={{ height: "100%", backgroundColor: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
        <Grid item xs={12} sm={4} sx={{ borderRight: "1px solid #e0e0e0", display: "flex", flexDirection: "column", maxHeight: "600px" }}>
          <Box sx={{ p: 2, borderBottom: "2px solid #f0f0f0", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <Typography variant="h6" sx={{ color: "white", fontWeight: 700, mb: 2 }}>
              💬 Chats Privados
            </Typography>
            <TextField
              size="small"
              placeholder="Buscar amigos..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "white",
                borderRadius: "8px",
                "& input": { fontSize: "0.9rem" },
              }}
              fullWidth
            />
          </Box>

          <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
            {carregando ? (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CircularProgress size={30} />
              </Box>
            ) : amigosFiltrados.length > 0 ? (
              <List disablePadding>
                {amigosFiltrados.map((amigo) => (
                  <React.Fragment key={amigo.id}>
                    <ListItem
                      button
                      onClick={() => setAmigoSelecionado(amigo)}
                      sx={{
                        backgroundColor:
                          amigoSelecionado?.id === amigo.id
                            ? "rgba(102, 126, 234, 0.15)"
                            : "transparent",
                        borderLeft:
                          amigoSelecionado?.id === amigo.id
                            ? "4px solid #667eea"
                            : "4px solid transparent",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(102, 126, 234, 0.1)",
                        },
                        py: 1.5,
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: "#44b700",
                              color: "#44b700",
                              boxShadow:
                                "0 0 0 2px white",
                              "&::after": {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                animation: "ripple 1.2s infinite ease-in-out",
                                border: "1px solid currentColor",
                              },
                            },
                          }}
                        >
                          <Avatar
                            src={amigo.imagemPerfil}
                            sx={{ width: 48, height: 48, cursor: "pointer" }}
                          >
                            {amigo.apelido?.charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#333" }}>
                            {amigo.apelido || "Sem nome"}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: "#999" }}>
                            Clique para conversar
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#999" }}>
                  {termoPesquisa
                    ? "Nenhum amigo encontrado"
                    : "Nenhum amigo para conversar"}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} sx={{ display: "flex", flexDirection: "column" }}>
          {amigoSelecionado ? (
            <>
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #e0e0e0",
                  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Avatar
                  src={amigoSelecionado.imagemPerfil}
                  sx={{ width: 40, height: 40 }}
                >
                  {amigoSelecionado.apelido?.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {amigoSelecionado.apelido || "Amigo"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#999" }}>
                    Online
                  </Typography>
                </Box>
                <Chip
                  icon="ℹ️"
                  label="Info"
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Box
                sx={{
                  flex: 1,
                  overflow: "auto",
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {mensagens.length > 0 ? (
                  mensagens.map((msg) => (
                    <Box
                      key={msg.id}
                      sx={{
                        display: "flex",
                        justifyContent:
                          msg.remetente_id === meuId ? "flex-end" : "flex-start",
                      }}
                    >
                      <Paper
                        sx={{
                          maxWidth: "70%",
                          p: 1.5,
                          backgroundColor:
                            msg.remetente_id === meuId
                              ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                              : "#fff",
                          color: msg.remetente_id === meuId ? "white" : "#333",
                          borderRadius: "12px",
                          boxShadow:
                            msg.remetente_id === meuId
                              ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                              : "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Typography variant="body2">
                          {msg.mensagem}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            mt: 0.5,
                            opacity: 0.7,
                          }}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ textAlign: "center", py: 5 }}>
                    <Typography variant="body2" sx={{ color: "#999" }}>
                      Inicie uma conversa! 💬
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "white",
                  display: "flex",
                  gap: 1,
                  alignItems: "flex-end",
                }}
              >
                <IconButton size="small" color="primary">
                  <AttachFileIcon />
                </IconButton>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Digite sua mensagem..."
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviarMensagem();
                    }
                  }}
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
                <IconButton size="small" color="primary">
                  <EmojiIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={enviarMensagem}
                  disabled={!mensagem.trim()}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:disabled": {
                      background: "#ccc",
                    },
                  }}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" sx={{ color: "#999", mb: 1 }}>
                  💬 Selecione um amigo
                </Typography>
                <Typography variant="body2" sx={{ color: "#bbb" }}>
                  para iniciar uma conversa
                </Typography>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChatPrivado;
