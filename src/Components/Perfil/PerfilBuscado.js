import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Paper, Avatar, Typography, Box } from "@mui/material";

function PerfilBuscado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

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
    fetchUsuario();
  }, [id, navigate]);

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
      </Paper>
    </Container>
  );
}

export default PerfilBuscado;
