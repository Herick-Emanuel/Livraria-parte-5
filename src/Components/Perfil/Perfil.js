import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  InputAdornment,
  CircularProgress,
  Alert,
  Box,
  Avatar,
  IconButton,
  Drawer,
  Badge,
} from "@mui/material";
import {
  Search,
  Share as ShareIcon,
  Menu as MenuIcon,
  Settings,
  Group,
  Favorite,
} from "@mui/icons-material";
import PerfilPostit from "./PerfilPostit";

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

  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [perfisEncontrados, setPerfisEncontrados] = useState([]);
  const [carregandoPesquisa, setCarregandoPesquisa] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewDrawer, setViewDrawer] = useState("config"); // "config", "amigos", "desejos"
  const [listaAmigos, setListaAmigos] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const compartilharPerfil = () => {
    const urlPerfil = window.location.href;
    navigator.clipboard.writeText(urlPerfil);
    alert("URL do perfil copiada para a área de transferência!");
  };

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

  const fetchAmigosESolicitacoes = async () => {
    try {
      const token = localStorage.getItem("token");
      const meuId = localStorage.getItem("id");
      // Busca amizades aceitas
      const { data: amigosData } = await axios.get(
        "http://localhost:3030/amizades",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: "aceito",
            $or: [{ usuario_id: meuId }, { amigo_id: meuId }],
          },
        }
      );
      // Busca solicitações pendentes onde o usuário é o destinatário
      const { data: solicitacoesData } = await axios.get(
        "http://localhost:3030/amizades",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: "pendente",
            amigo_id: meuId,
          },
        }
      );
      setListaAmigos(amigosData.data || []);
      setSolicitacoesPendentes(solicitacoesData.data || []);
    } catch (error) {
      console.error("Erro ao buscar amigos/solicitações:", error);
    }
  };

  useEffect(() => {
    if (drawerOpen && viewDrawer === "amigos") {
      fetchAmigosESolicitacoes();
    }
  }, [drawerOpen, viewDrawer]);

  const renderDrawerContent = () => {
    switch (viewDrawer) {
      case "config":
        return <Typography variant="h6">Configurações do Perfil</Typography>;
      case "amigos":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Lista de Amigos
            </Typography>
            {listaAmigos.length > 0 ? (
              <Box>
                {listaAmigos.map((amizade) => {
                  const meuId = parseInt(localStorage.getItem("id"));
                  // Supondo que a resposta contenha os dados do outro usuário em "amigo" ou "usuario"
                  const amigo =
                    parseInt(amizade.usuario_id) === meuId
                      ? amizade.amigo
                      : amizade.usuario;
                  return (
                    <Box
                      key={amizade.id}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Avatar src={amigo?.imagemPerfil} sx={{ mr: 1 }} />
                      <Typography>{amigo?.apelido || "Amigo"}</Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography>Nenhum amigo encontrado.</Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Solicitações Pendentes</Typography>
              {solicitacoesPendentes.length > 0 ? (
                <Box>
                  {solicitacoesPendentes.map((solicitacao) => (
                    <Box
                      key={solicitacao.id}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Avatar
                        src={solicitacao.usuario?.imagemPerfil}
                        sx={{ mr: 1 }}
                      />
                      <Typography>
                        {solicitacao.usuario?.apelido || "Solicitante"}
                      </Typography>
                      <Badge color="error" badgeContent="!" sx={{ ml: 1 }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography>Nenhuma solicitação pendente.</Typography>
              )}
            </Box>
          </Box>
        );
      case "desejos":
        return <Typography variant="h6">Lista de Desejos</Typography>;
      default:
        return null;
    }
  };

  return (
    <>
      <Container className="container-perfil" maxWidth="md" sx={{ mt: 4 }}>
        <Paper className="perfil-card" sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
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
                <Typography variant="body2" color="#ccbd9e">
                  {usuario?.email}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                sx={{ mr: 1, color: "text.primary" }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon fontSize="large" />
              </IconButton>
              <IconButton
                sx={{ color: "text.primary" }}
                onClick={compartilharPerfil}
              >
                <ShareIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Button variant="contained" component="label" sx={{ mr: 1 }}>
              Atualizar Foto
              <input
                type="file"
                hidden
                onChange={atualizarImagemPerfil}
                accept="image/*"
              />
            </Button>
            <Button
              variant="contained"
              onClick={togglePerfilPublico}
              sx={{ mr: 1 }}
            >
              {perfilPublico ? "Tornar Privado" : "Tornar Público"}
            </Button>
            <Button variant="contained" onClick={logout}>
              Logout
            </Button>
          </Box>

          <PerfilPostit
            biografia={biografia}
            setBiografia={setBiografia}
            editandoBiografia={editandoBiografia}
            setEditandoBiografia={setEditandoBiografia}
            salvarBiografia={salvarBiografia}
          />

          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
            <Box sx={{ width: 300, p: 2 }}>
              {/* Navbar horizontal com três ícones */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  mb: 2,
                }}
              >
                <IconButton onClick={() => setViewDrawer("config")}>
                  <Settings
                    color={viewDrawer === "config" ? "primary" : "inherit"}
                  />
                </IconButton>
                <IconButton onClick={() => setViewDrawer("amigos")}>
                  <Badge
                    badgeContent={solicitacoesPendentes.length}
                    color="error"
                  >
                    <Group
                      color={viewDrawer === "amigos" ? "primary" : "inherit"}
                    />
                  </Badge>
                </IconButton>
                <IconButton onClick={() => setViewDrawer("desejos")}>
                  <Favorite
                    color={viewDrawer === "desejos" ? "primary" : "inherit"}
                  />
                </IconButton>
              </Box>
              {renderDrawerContent()}
            </Box>
          </Drawer>
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
