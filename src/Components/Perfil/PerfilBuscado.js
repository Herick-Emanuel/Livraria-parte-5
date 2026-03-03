import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  PersonAdd,
  PersonRemove,
  HourglassEmpty,
  CheckCircle,
} from "@mui/icons-material";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Perfil.css";

function PerfilBuscado() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [amizade, setAmizade] = useState(null);
  const [loadingAmizade, setLoadingAmizade] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    const fetchAmizade = async () => {
      try {
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

  const enviarSolicitacao = async () => {
    try {
      const token = localStorage.getItem("token");
      const meuId = Number(localStorage.getItem("id")); // Converter para number
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
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
    }
  };

  const removerAmizade = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3030/amizades/${amizade.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAmizade(null);
    } catch (error) {
      console.error("Erro ao remover amizade:", error);
    }
  };

  const renderBotaoAmizade = () => {
    if (loadingAmizade) return null;
    if (!amizade) {
      return (
        <Button 
          className="btn-perfil" 
          onClick={enviarSolicitacao}
          startIcon={<PersonAdd />}
        >
          ➕ Adicionar Amigo
        </Button>
      );
    }
    if (amizade.status === "pendente") {
      const meuId = Number(localStorage.getItem("id"));
      if (meuId === amizade.amigo_id) {
        return (
          <Button 
            className="btn-perfil" 
            startIcon={<CheckCircle />}
          >
            ✅ Aceitar / Rejeitar
          </Button>
        );
      }
      return (
        <Button 
          className="btn-perfil outline" 
          disabled
          startIcon={<HourglassEmpty />}
        >
          ⏳ Solicitação Enviada
        </Button>
      );
    }
    if (amizade.status === "aceito") {
      return (
        <Button 
          className="btn-perfil secondary" 
          onClick={removerAmizade}
          startIcon={<PersonRemove />}
        >
          ❌ Desfazer Amizade
        </Button>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box className="loading-container">
          <CircularProgress sx={{ color: "#667eea" }} />
        </Box>
      </Container>
    );
  }

  if (!usuario) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper className="perfil-card" elevation={0}>
          <Typography>Usuário não encontrado.</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }} className="container-perfil">
      <Paper className="perfil-card fade-in" elevation={0}>
        <Box className="perfil-header" sx={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box className="perfil-avatar" sx={{ mb: 2 }}>
            <Avatar
              src={usuario.imagemPerfil}
              alt={usuario.apelido}
              sx={{ width: 120, height: 120 }}
            />
          </Box>
          <Box className="perfil-dados">
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              {usuario.apelido}
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", mb: 1 }}>
              ✉️ {usuario.email}
            </Typography>
            <Typography variant="body2" sx={{ color: "#667eea", fontWeight: 500 }}>
              {usuario.cargo === "autor" ? "✍️ Autor" : 
               usuario.cargo === "administrador" ? "⚙️ Administrador" : 
               "🛒 Cliente"}
            </Typography>
          </Box>
        </Box>

        <Box className="perfil-biografia" sx={{ mt: 3 }}>
          <Box className="biografia-texto">
            {usuario.biografia || "📝 Este usuário ainda não possui uma biografia."}
          </Box>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          {renderBotaoAmizade()}
        </Box>
      </Paper>
    </Container>
  );
}

export default PerfilBuscado;
