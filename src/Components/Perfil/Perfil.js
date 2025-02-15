import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Paper,
  Divider,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, ShoppingCart } from "@mui/icons-material";
import "./Perfil.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [biografia, setBiografia] = useState(
    localStorage.getItem("biografia") || ""
  );
  const [imagemPerfil, setImagemPerfil] = useState(
    localStorage.getItem("imagemPerfil") || ""
  );
  const [editandoBiografia, setEditandoBiografia] = useState(false);
  const [perfilPublico, setPerfilPublico] = useState(
    localStorage.getItem("perfilPublico") === "true"
  );
  const [idUsuarioLogado, setIdUsuarioLogado] = useState(
    localStorage.getItem("id") || null
  );
  const navigate = useNavigate();

  // Estados para pesquisa de perfis
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [perfisEncontrados, setPerfisEncontrados] = useState([]);
  const [carregandoPesquisa, setCarregandoPesquisa] = useState(false);

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:3030/usuario/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsuario(data);
        setIdUsuarioLogado(id);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
        navigate("/home/perfil");
      }
    };
    carregarUsuario();
  }, [navigate]);

  const salvarBiografia = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3030/usuario/${id}`,
        { biografia },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditandoBiografia(false);
      localStorage.setItem("biografia", biografia);
    } catch (error) {
      console.error("Erro ao salvar biografia:", error);
    }
  };

  const atualizarImagemPerfil = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("imagemPerfil", file);
        const { data } = await axios.post(
          `http://localhost:3030/usuario/${id}/imagemPerfil`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setImagemPerfil(data.imagemPerfil);
        localStorage.setItem("imagemPerfil", data.imagemPerfil);
      }
    } catch (error) {
      console.error("Erro ao atualizar imagem de perfil:", error);
    }
  };

  const togglePerfilPublico = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      const novoPerfil = perfilPublico ? "Privado" : "Publico";
      const { data: usuarioAtualizado } = await axios.patch(
        `http://localhost:3030/usuario/${id}`,
        { perfil: novoPerfil },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (usuarioAtualizado && usuarioAtualizado.perfil) {
        setPerfilPublico(usuarioAtualizado.perfil === "Publico");
        localStorage.setItem("perfilPublico", usuarioAtualizado.perfil);
      } else {
        console.error(
          "Erro ao alterar visibilidade do perfil. Resposta inválida:",
          usuarioAtualizado
        );
      }
    } catch (error) {
      console.error("Erro ao alterar visibilidade do perfil:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const salvarPerfil = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:3030/usuario/${id}`,
        {
          biografia,
          imagemPerfil,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      localStorage.setItem("biografia", biografia);
      localStorage.setItem("imagemPerfil", imagemPerfil);
      console.log("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const pesquisarPerfis = async () => {
    try {
      setCarregandoPesquisa(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3030/usuario", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: termoPesquisa,
          perfil: "Publico",
        },
      });

      console.log("Resposta completa:", response);
      console.log("Configuração da resposta:", response.config);

      const resultados = response.data.data || response.data || [];
      setPerfisEncontrados(resultados);
    } catch (error) {
      console.error("Erro ao pesquisar perfis:", error);
    } finally {
      setCarregandoPesquisa(false);
    }
  };

  const handlePerfilClick = (id) => {
    navigate(`/home/perfil/${id}`);
  };

  const handleCartClick = () => {
    navigate("/home/carrinho/desejos");
  };

  return (
    <>
      <Container className="container-perfil" maxWidth="md" sx={{ mt: 4 }}>
        <Paper className="perfil-card" sx={{ p: 4 }}>
          <Box
            className="perfil-header"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={imagemPerfil}
                alt="Foto de Perfil"
                sx={{ width: 80, height: 80, mr: 2 }}
              />
              <Box>
                <Typography variant="h5">{usuario?.apelido}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {usuario?.email}
                </Typography>
              </Box>
            </Box>
            <Button onClick={handleCartClick}>
              <ShoppingCart fontSize="large" />
            </Button>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Box className="perfil-imagem" sx={{ mb: 3 }}>
            <Typography variant="subtitle1">
              Atualizar Foto de Perfil:
            </Typography>
            <Button variant="contained" component="label" sx={{ mt: 1 }}>
              Escolher Imagem
              <input
                type="file"
                hidden
                onChange={atualizarImagemPerfil}
                accept="image/*"
              />
            </Button>
          </Box>

          <Box className="perfil-biografia" sx={{ mb: 3 }}>
            <Typography variant="subtitle1">Biografia:</Typography>
            {editandoBiografia ? (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  value={biografia}
                  onChange={(e) => setBiografia(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button variant="contained" onClick={salvarBiografia}>
                  Salvar Biografia
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {biografia || "Sem biografia cadastrada."}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setEditandoBiografia(true)}
                >
                  Editar Biografia
                </Button>
              </Box>
            )}
          </Box>

          <Box className="perfil-config" sx={{ mb: 3 }}>
            <Typography variant="subtitle1">
              Perfil {perfilPublico ? "Público" : "Privado"}:
            </Typography>
            <Button
              variant="contained"
              onClick={togglePerfilPublico}
              sx={{ mt: 1 }}
            >
              {perfilPublico ? "Tornar Privado" : "Tornar Público"}
            </Button>
          </Box>

          <Box
            className="perfil-actions"
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button variant="contained" onClick={salvarPerfil}>
              Salvar Perfil
            </Button>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pesquisar Perfis
          </Typography>

          <Box display="flex" gap={2} alignItems="center" mb={2}>
            <TextField
              label="Termo de Pesquisa"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={pesquisarPerfis}
              startIcon={<Search />}
            >
              Pesquisar
            </Button>
          </Box>

          {carregandoPesquisa && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}

          {!carregandoPesquisa && perfisEncontrados.length > 0 && (
            <Grid container spacing={2}>
              {perfisEncontrados.map((perfil) => (
                <Grid item xs={12} sm={6} md={4} key={perfil.id}>
                  <Paper
                    sx={{
                      p: 2,
                      cursor: "pointer",
                      textAlign: "center",
                      "&:hover": {
                        boxShadow: 6,
                      },
                    }}
                    onClick={() => handlePerfilClick(perfil.id)}
                  >
                    <Avatar
                      src={perfil.imagemPerfil}
                      alt={perfil.apelido}
                      sx={{ width: 60, height: 60, margin: "auto" }}
                    />
                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                      {perfil.apelido}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {perfil.biografia || "Sem biografia."}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}

          {!carregandoPesquisa && perfisEncontrados.length === 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Nenhum perfil encontrado.
            </Alert>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Perfil;
