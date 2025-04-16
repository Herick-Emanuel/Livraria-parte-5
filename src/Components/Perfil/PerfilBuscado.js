import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  ArrowBack,
  PersonAdd,
  Check,
  Close,
  Delete,
  MoreVert,
  Share as ShareIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function PerfilBuscado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [amizade, setAmizade] = useState(null);
  const [loadingAmizade, setLoadingAmizade] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mostrarMensagem = (mensagem, severidade = "success") => {
    setSnackbar({
      open: true,
      message: mensagem,
      severity: severidade,
    });
  };

  const voltar = () => {
    navigate("/home/perfil");
  };

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setCarregando(true);
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:3030/usuario/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsuario(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        mostrarMensagem("Não foi possível carregar este perfil", "error");
      } finally {
        setCarregando(false);
      }
    };

    const fetchAmizade = async () => {
      try {
        setLoadingAmizade(true);
        const token = localStorage.getItem("token");
        const meuId = Number(localStorage.getItem("id"));
        const amigoId = Number(id);
        const { data } = await axios.get("http://localhost:3030/amizades", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            $or: [
              { usuario_id: meuId, amigo_id: amigoId },
              { usuario_id: amigoId, amigo_id: meuId },
            ],
          },
        });
        if (data.data && data.data.length > 0) {
          setAmizade(data.data[0]);
        }
      } catch (error) {
        console.error("Erro ao buscar amizade:", error);
      } finally {
        setLoadingAmizade(false);
      }
    };

    fetchUsuario();
    fetchAmizade();
  }, [id]);

  const compartilharPerfil = () => {
    const urlPerfil = window.location.href;
    navigator.clipboard.writeText(urlPerfil);
    mostrarMensagem("URL do perfil copiada para a área de transferência!");
  };

  const enviarSolicitacao = async () => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      const meuId = Number(localStorage.getItem("id"));
      const amigoId = Number(id);
      const { data } = await axios.post(
        "http://localhost:3030/amizades",
        {
          usuario_id: meuId,
          amigo_id: amigoId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAmizade(data);
      mostrarMensagem("Solicitação de amizade enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      mostrarMensagem("Erro ao enviar solicitação de amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const aceitarSolicitacao = async () => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3030/amizades/${amizade.id}`,
        { status: "aceito" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAmizade({ ...amizade, status: "aceito" });
      mostrarMensagem("Solicitação de amizade aceita com sucesso!");
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
      mostrarMensagem("Erro ao aceitar solicitação de amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const recusarSolicitacao = async () => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3030/amizades/${amizade.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmizade(null);
      mostrarMensagem("Solicitação de amizade recusada.");
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error);
      mostrarMensagem("Erro ao recusar solicitação de amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const removerAmizade = async () => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3030/amizades/${amizade.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmizade(null);
      mostrarMensagem("Amizade removida com sucesso.");
    } catch (error) {
      console.error("Erro ao remover amizade:", error);
      mostrarMensagem("Erro ao remover amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const renderBotaoAmizade = () => {
    if (loadingAmizade) return null;

    const meuId = Number(localStorage.getItem("id"));
    if (Number(id) === meuId) {
      return null; // É o próprio perfil do usuário
    }

    if (!amizade) {
      return (
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={enviarSolicitacao}
          disabled={carregando}
          sx={{
            backgroundColor: "#ccbd9e",
            color: "#333",
            "&:hover": { backgroundColor: "#b5a78a" },
          }}
        >
          {carregando ? <CircularProgress size={24} /> : "Adicionar Amigo"}
        </Button>
      );
    }

    if (amizade.status === "pendente") {
      if (meuId === amizade.amigo_id) {
        return (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Check />}
              onClick={aceitarSolicitacao}
              disabled={carregando}
              color="success"
            >
              Aceitar
            </Button>
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={recusarSolicitacao}
              disabled={carregando}
              color="error"
            >
              Recusar
            </Button>
          </Box>
        );
      }
      return (
        <Button
          variant="outlined"
          disabled
          sx={{ color: "#ccbd9e", borderColor: "#ccbd9e" }}
        >
          Solicitação Enviada
        </Button>
      );
    }

    if (amizade.status === "aceito") {
      return (
        <Button
          variant="outlined"
          startIcon={<Delete />}
          onClick={removerAmizade}
          disabled={carregando}
          color="error"
        >
          Desfazer Amizade
        </Button>
      );
    }

    return null;
  };

  if (carregando && !usuario) {
    return (
      <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
        <CircularProgress sx={{ color: "#ccbd9e" }} />
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            py: 3,
            px: 4,
            backgroundColor: "#676e81",
            mb: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton onClick={voltar} sx={{ mr: 2, color: "#ccbd9e" }}>
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h4"
                sx={{ color: "#333", fontWeight: "medium" }}
              >
                Perfil de {usuario?.apelido}
              </Typography>
            </Box>
            <IconButton onClick={compartilharPerfil} sx={{ color: "#ccbd9e" }}>
              <ShareIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Avatar
                  src={usuario?.imagemPerfil}
                  alt={usuario?.apelido}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "3px solid #ccbd9e",
                    boxShadow: 2,
                  }}
                />

                <Typography variant="h5" sx={{ mt: 2, color: "#333" }}>
                  {usuario?.apelido}
                </Typography>

                {renderBotaoAmizade()}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "#f9f6f0",
                  border: "1px solid #ccbd9e",
                  minHeight: "200px",
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#333" }}>
                    Sobre
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {usuario?.biografia || "Este usuário não possui biografia."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default PerfilBuscado;
