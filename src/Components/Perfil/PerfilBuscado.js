import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

function PerfilBuscado() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [amizade, setAmizade] = useState(null);
  const [loadingAmizade, setLoadingAmizade] = useState(true);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
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
      }
    };

    const fetchAmizade = async () => {
      try {
        const token = localStorage.getItem("token");
        const meuId = Number(localStorage.getItem("id")); // Converter para number
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
        <Button variant="contained" onClick={enviarSolicitacao}>
          Adicionar Amigo
        </Button>
      );
    }
    if (amizade.status === "pendente") {
      const meuId = Number(localStorage.getItem("id"));
      if (meuId === amizade.amigo_id) {
        return (
          <Button variant="contained" color="primary">
            Aceitar / Rejeitar
          </Button>
        );
      }
      return (
        <Button variant="outlined" disabled>
          Solicitação Enviada
        </Button>
      );
    }
    if (amizade.status === "aceito") {
      return (
        <Button variant="outlined" color="secondary" onClick={removerAmizade}>
          Desfazer Amizade
        </Button>
      );
    }
    return null;
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            src={usuario.imagemPerfil}
            alt={usuario.apelido}
            sx={{ width: 80, height: 80, mr: 2 }}
          />
          <Typography variant="h5">{usuario.apelido}</Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {usuario.biografia || "Este usuário não possui biografia."}
        </Typography>
        {renderBotaoAmizade()}
      </Paper>
    </Container>
  );
}

export default PerfilBuscado;
