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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
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
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Visibility as VisibilityIcon,
  PersonAdd as PersonAddIcon,
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
  const [viewDrawer, setViewDrawer] = useState("config");
  const [listaAmigos, setListaAmigos] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);
  const [amodalAberto, setAmodalAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [carregandoAcoes, setCarregandoAcoes] = useState({});

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

  const buscarUsuariosAdicionar = async () => {
    try {
      const token = localStorage.getItem("token");
      const meuId = localStorage.getItem("id");
      const { data } = await axios.get("http://localhost:3030/usuario", {
        headers: { Authorization: `Bearer ${token}` },
        params: { perfil: "Publico" },
      });
      
      const usuarios = (data.data || data || []).filter(u => u.id != meuId);
      setUsuariosDisponiveis(usuarios);
    } catch (error) {
      console.error("Erro ao buscar usuários disponíveis:", error);
    }
  };

  const adicionarAmigo = async (amigoId) => {
    try {
      setCarregandoAcoes(prev => ({ ...prev, [amigoId]: true }));
      const token = localStorage.getItem("token");
      const meuId = localStorage.getItem("id");
      
      await axios.post(
        "http://localhost:3030/amizades",
        { usuario_id: meuId, amigo_id: amigoId, status: "pendente" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAmodalAberto(false);
      setUsuarioSelecionado(null);
      alert("Solicitação de amizade enviada!");
    } catch (error) {
      console.error("Erro ao adicionar amigo:", error);
      alert("Erro ao enviar solicitação");
    } finally {
      setCarregandoAcoes(prev => ({ ...prev, [amigoId]: false }));
    }
  };

  const aceitarSolicitacao = async (amizadeId) => {
    try {
      setCarregandoAcoes(prev => ({ ...prev, [amizadeId]: true }));
      const token = localStorage.getItem("token");
      
      await axios.patch(
        `http://localhost:3030/amizades/${amizadeId}`,
        { status: "aceito" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchAmigosESolicitacoes();
      alert("Amizade aceita!");
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
    } finally {
      setCarregandoAcoes(prev => ({ ...prev, [amizadeId]: false }));
    }
  };

  const rejeitarSolicitacao = async (amizadeId) => {
    try {
      setCarregandoAcoes(prev => ({ ...prev, [amizadeId]: true }));
      const token = localStorage.getItem("token");
      
      await axios.delete(
        `http://localhost:3030/amizades/${amizadeId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      fetchAmigosESolicitacoes();
      alert("Solicitação rejeitada!");
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
    } finally {
      setCarregandoAcoes(prev => ({ ...prev, [amizadeId]: false }));
    }
  };

  const removerAmigo = async (amizadeId) => {
    if (window.confirm("Tem certeza que deseja remover este amigo?")) {
      try {
        setCarregandoAcoes(prev => ({ ...prev, [amizadeId]: true }));
        const token = localStorage.getItem("token");
        
        await axios.delete(
          `http://localhost:3030/amizades/${amizadeId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        fetchAmigosESolicitacoes();
        alert("Amigo removido!");
      } catch (error) {
        console.error("Erro ao remover amigo:", error);
      } finally {
        setCarregandoAcoes(prev => ({ ...prev, [amizadeId]: false }));
      }
    }
  };

  const irParaChat = (amigoId) => {
    navigate(`/home/chat-privado/${amigoId}`);
  };

  useEffect(() => {
    if (drawerOpen && viewDrawer === "amigos") {
      fetchAmigosESolicitacoes();
      buscarUsuariosAdicionar();
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
            <Button
              fullWidth
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => {
                setAmodalAberto(true);
                buscarUsuariosAdicionar();
              }}
              sx={{
                background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                color: "white",
                fontWeight: 600,
                mb: 3,
                borderRadius: "8px",
                "&:hover": {
                  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                }
              }}
            >
              Adicionar Amigo
            </Button>

            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              👥 Meus Amigos
            </Typography>
            {listaAmigos.length > 0 ? (
              <Box sx={{ mb: 3 }}>
                {listaAmigos.map((amizade) => {
                  const meuId = parseInt(localStorage.getItem("id"));
                  const amigo =
                    parseInt(amizade.usuario_id) === meuId
                      ? amizade.amigo
                      : amizade.usuario;
                  return (
                    <Box 
                      key={amizade.id} 
                      className="amigo-item-expandido"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        p: 1.5,
                        mb: 1,
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "rgba(255,255,255,0.12)",
                        }
                      }}
                    >
                      <Avatar 
                        src={amigo?.imagemPerfil} 
                        sx={{ width: 40, height: 40, cursor: "pointer" }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ color: 'white', fontWeight: 500 }}>
                          {amigo?.apelido || "Amigo"}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => irParaChat(amigo?.id)}
                        disabled={carregandoAcoes[amizade.id]}
                        sx={{ color: "#4ade80" }}
                      >
                        <ChatIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handlePerfilClick(amigo?.id)}
                        disabled={carregandoAcoes[amizade.id]}
                        sx={{ color: "#667eea" }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => removerAmigo(amizade.id)}
                        disabled={carregandoAcoes[amizade.id]}
                        sx={{ color: "#ef4444" }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                Nenhum amigo encontrado.
              </Typography>
            )}

            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              📬 Solicitações Pendentes
            </Typography>
            {solicitacoesPendentes.length > 0 ? (
              <Box>
                {solicitacoesPendentes.map((solicitacao) => (
                  <Box 
                    key={solicitacao.id} 
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      p: 1.5,
                      mb: 1,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.12)",
                      }
                    }}
                  >
                    <Badge
                      badgeContent="!"
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#ef4444",
                        }
                      }}
                    >
                      <Avatar
                        src={solicitacao.usuario?.imagemPerfil}
                        sx={{ width: 40, height: 40, cursor: "pointer" }}
                      />
                    </Badge>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>
                        {solicitacao.usuario?.apelido || "Solicitante"}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() => aceitarSolicitacao(solicitacao.id)}
                      disabled={carregandoAcoes[solicitacao.id]}
                      sx={{ color: "#4ade80" }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => rejeitarSolicitacao(solicitacao.id)}
                      disabled={carregandoAcoes[solicitacao.id]}
                      sx={{ color: "#ef4444" }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Nenhuma solicitação pendente.
              </Typography>
            )}
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

          <PerfilPostit
            biografia={biografia}
            setBiografia={setBiografia}
            editandoBiografia={editandoBiografia}
            setEditandoBiografia={setEditandoBiografia}
            salvarBiografia={salvarBiografia}
          />

          <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
            <Box className="drawer-content">
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

      <Dialog 
        open={amodalAberto} 
        onClose={() => {
          setAmodalAberto(false);
          setUsuarioSelecionado(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        {usuarioSelecionado ? (
          <>
            <DialogTitle sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontWeight: 700 }}>
              Adicionar Amigo
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  src={usuarioSelecionado.imagemPerfil}
                  sx={{ width: 80, height: 80, margin: "0 auto", mb: 2 }}
                >
                  {usuarioSelecionado.apelido?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                  {usuarioSelecionado.apelido}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", mt: 1 }}>
                  {usuarioSelecionado.email}
                </Typography>
                <Typography variant="body2" sx={{ color: "#667eea", mt: 2, fontStyle: "italic" }}>
                  {usuarioSelecionado.biografia || "Sem biografia"}
                </Typography>
                <Box sx={{ mt: 2, p: 1, backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    Perfil: {usuarioSelecionado.perfil === "Publico" ? "🔓 Público" : "🔒 Privado"}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
              <Button 
                onClick={() => setUsuarioSelecionado(null)}
                sx={{ color: "#666" }}
              >
                Retroceder
              </Button>
              <Button
                variant="contained"
                onClick={() => adicionarAmigo(usuarioSelecionado.id)}
                disabled={carregandoAcoes[usuarioSelecionado.id]}
                sx={{
                  background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
                  color: "white",
                }}
              >
                {carregandoAcoes[usuarioSelecionado.id] ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Enviar Solicitação"
                )}
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontWeight: 700 }}>
              Selecione um Amigo
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <List sx={{ width: "100%" }}>
                {usuariosDisponiveis.length > 0 ? (
                  usuariosDisponiveis.map((usuario) => (
                    <React.Fragment key={usuario.id}>
                      <ListItem
                        button
                        onClick={() => setUsuarioSelecionado(usuario)}
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": {
                            backgroundColor: "rgba(102, 126, 234, 0.1)",
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={usuario.imagemPerfil} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={usuario.apelido}
                          secondary={usuario.email}
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                ) : (
                  <Typography sx={{ py: 3, textAlign: "center", color: "#999" }}>
                    Nenhum usuário disponível para adicionar
                  </Typography>
                )}
              </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={() => {
                  setAmodalAberto(false);
                  setUsuarioSelecionado(null);
                }}
              >
                Cancelar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
