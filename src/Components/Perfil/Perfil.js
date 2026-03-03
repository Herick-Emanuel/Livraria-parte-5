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
  Logout as LogoutIcon,
  PhotoCamera,
  Public,
  Lock,
} from "@mui/icons-material";
import PerfilPostit from "./PerfilPostit";
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
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              ⚙️ Configurações
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Em desenvolvimento...
            </Typography>
          </Box>
        );
      case "amigos":
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              👥 Lista de Amigos
            </Typography>
            {listaAmigos.length > 0 ? (
              <Box>
                {listaAmigos.map((amizade) => {
                  const meuId = parseInt(localStorage.getItem("id"));
                  const amigo =
                    parseInt(amizade.usuario_id) === meuId
                      ? amizade.amigo
                      : amizade.usuario;
                  return (
                    <Box key={amizade.id} className="amigo-item">
                      <Avatar 
                        src={amigo?.imagemPerfil} 
                        className="amigo-avatar"
                        sx={{ width: 45, height: 45 }}
                      />
                      <Typography className="amigo-nome">
                        {amigo?.apelido || "Amigo"}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Nenhum amigo encontrado.
              </Typography>
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                📬 Solicitações Pendentes
              </Typography>
              {solicitacoesPendentes.length > 0 ? (
                <Box>
                  {solicitacoesPendentes.map((solicitacao) => (
                    <Box key={solicitacao.id} className="amigo-item">
                      <Avatar
                        src={solicitacao.usuario?.imagemPerfil}
                        className="amigo-avatar"
                        sx={{ width: 45, height: 45 }}
                      />
                      <Typography className="amigo-nome">
                        {solicitacao.usuario?.apelido || "Solicitante"}
                      </Typography>
                      <Badge color="error" badgeContent="!" sx={{ ml: 'auto' }} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Nenhuma solicitação pendente.
                </Typography>
              )}
            </Box>
          </Box>
        );
      case "desejos":
        return (
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              ❤️ Lista de Desejos
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Em desenvolvimento...
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container className="container-perfil" maxWidth="md" sx={{ mt: 4 }}>
        <Paper className="perfil-card" elevation={0}>
          {/* Header do Perfil */}
          <Box className="perfil-header">
            <Box className="perfil-info">
              <Box className="perfil-avatar">
                <Avatar
                  src={imagemPerfil}
                  alt="Foto de Perfil"
                  sx={{ width: 100, height: 100 }}
                />
              </Box>
              <Box className="perfil-dados">
                <Typography variant="h5" component="h1">
                  {usuario?.apelido}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mt: 0.5 }}>
                  ✉️ {usuario?.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "#667eea", mt: 0.5, fontWeight: 500 }}>
                  {usuario?.cargo === "autor" ? "✍️ Autor" : 
                   usuario?.cargo === "administrador" ? "⚙️ Administrador" : 
                   "🛒 Cliente"}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                className="icon-btn"
                onClick={handleDrawerToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon fontSize="large" />
              </IconButton>
              <IconButton
                className="icon-btn"
                onClick={compartilharPerfil}
              >
                <ShareIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>

          {/* Botões de Ação */}
          <Box className="perfil-actions">
            <Button 
              className="btn-perfil" 
              component="label"
              startIcon={<PhotoCamera />}
            >
              📸 Atualizar Foto
              <input
                type="file"
                hidden
                onChange={atualizarImagemPerfil}
                accept="image/*"
              />
            </Button>
            <Button
              className={`btn-perfil ${perfilPublico ? 'secondary' : ''}`}
              onClick={togglePerfilPublico}
              startIcon={perfilPublico ? <Public /> : <Lock />}
            >
              {perfilPublico ? "🔓 Tornar Privado" : "🔒 Tornar Público"}
            </Button>
            <Button 
              className="btn-perfil outline" 
              onClick={logout}
              startIcon={<LogoutIcon />}
            >
              Sair
            </Button>
          </Box>

          {/* Post-it de Biografia */}
          <PerfilPostit
            biografia={biografia}
            setBiografia={setBiografia}
            editandoBiografia={editandoBiografia}
            setEditandoBiografia={setEditandoBiografia}
            salvarBiografia={salvarBiografia}
          />

          {/* Drawer Lateral */}
          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
            <Box className="drawer-content">
              {/* Navbar horizontal com três ícones */}
              <Box className="drawer-nav">
                <IconButton 
                  onClick={() => setViewDrawer("config")}
                  className={viewDrawer === "config" ? "active" : ""}
                >
                  <Settings fontSize="large" />
                </IconButton>
                <IconButton 
                  onClick={() => setViewDrawer("amigos")}
                  className={viewDrawer === "amigos" ? "active" : ""}
                >
                  <Badge
                    badgeContent={solicitacoesPendentes.length}
                    color="error"
                  >
                    <Group fontSize="large" />
                  </Badge>
                </IconButton>
                <IconButton 
                  onClick={() => setViewDrawer("desejos")}
                  className={viewDrawer === "desejos" ? "active" : ""}
                >
                  <Favorite fontSize="large" />
                </IconButton>
              </Box>
              {renderDrawerContent()}
            </Box>
          </Drawer>
        </Paper>
      </Container>

      {/* Seção de Pesquisa de Perfis */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper className="pesquisa-perfil" elevation={0}>
          <Box className="pesquisa-header">
            <Search className="search-icon" sx={{ color: "#667eea" }} />
            <Typography variant="h6" component="h2">
              Buscar Pessoas
            </Typography>
          </Box>

          <Box className="search-box">
            <TextField
              className="search-input"
              placeholder="Digite o nome ou email..."
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && pesquisarPerfis()}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              className="btn-perfil"
              onClick={pesquisarPerfis}
              sx={{ minWidth: '120px' }}
            >
              Buscar
            </Button>
          </Box>

          {carregandoPesquisa && (
            <Box className="loading-container">
              <CircularProgress sx={{ color: "#667eea" }} />
            </Box>
          )}

          {!carregandoPesquisa && perfisEncontrados.length > 0 && (
            <Box className="perfis-grid fade-in">
              {perfisEncontrados.map((perfil) => (
                <Box
                  key={perfil.id}
                  className="perfil-card-mini"
                  onClick={() => handlePerfilClick(perfil.id)}
                >
                  <Avatar
                    src={perfil.imagemPerfil}
                    alt={perfil.apelido}
                    sx={{ width: 60, height: 60, margin: '0 auto' }}
                  />
                  <Typography component="h3">
                    {perfil.apelido}
                  </Typography>
                  <Typography component="p">
                    {perfil.biografia || "Sem biografia."}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {!carregandoPesquisa && perfisEncontrados.length === 0 && termoPesquisa && (
            <Alert severity="info" className="alert-info">
              Nenhum perfil encontrado para "{termoPesquisa}"
            </Alert>
          )}
        </Paper>
      </Container>
    </>
  );
}

export default Perfil;
