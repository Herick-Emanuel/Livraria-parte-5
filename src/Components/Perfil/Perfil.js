import React, { useEffect, useState, useCallback } from "react";
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
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Tooltip,
  Chip,
  useTheme,
  useMediaQuery,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Search,
  Share as ShareIcon,
  Menu as MenuIcon,
  Settings,
  Group,
  Favorite,
  Edit as EditIcon,
  PhotoCamera,
  Public,
  VisibilityOff,
  AccountCircle,
  ExitToApp,
  PersonAdd,
  Delete,
  Check,
  Close,
} from "@mui/icons-material";
import PerfilPostit from "./PerfilPostit";
import "./Perfil.css";

function Perfil() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeStep, setActiveStep] = useState(0);
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
  const [tabValue, setTabValue] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [carregando, setCarregando] = useState(false);

  // Debounce para busca automática
  const [buscaTimeout, setBuscaTimeout] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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

  const compartilharPerfil = () => {
    const urlPerfil = window.location.href;
    navigator.clipboard.writeText(urlPerfil);
    mostrarMensagem("URL do perfil copiada para a área de transferência!");
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        setCarregando(true);
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
        // Atualizar estados com dados do usuário
        if (data.biografia) setBiografia(data.biografia);
        if (data.imagemPerfil) setImagemPerfil(data.imagemPerfil);
        if (data.perfil) setPerfilPublico(data.perfil === "Publico");
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
        mostrarMensagem("Erro ao carregar dados do perfil", "error");
        navigate("/home/perfil");
      } finally {
        setCarregando(false);
      }
    };
    carregarUsuario();
  }, [navigate]);

  const salvarBiografia = async () => {
    try {
      setCarregando(true);
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3030/usuario/${id}`,
        { biografia },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditandoBiografia(false);
      localStorage.setItem("biografia", biografia);
      mostrarMensagem("Biografia atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar biografia:", error);
      mostrarMensagem("Erro ao salvar biografia", "error");
    } finally {
      setCarregando(false);
    }
  };

  const atualizarImagemPerfil = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) return;

      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        mostrarMensagem(
          "Formato de imagem não suportado. Use PNG, JPEG, JPG ou WEBP.",
          "error"
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        mostrarMensagem("A imagem não deve exceder 5MB", "error");
        return;
      }

      setCarregando(true);
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
      mostrarMensagem("Imagem de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar imagem de perfil:", error);
      mostrarMensagem("Erro ao atualizar imagem de perfil", "error");
    } finally {
      setCarregando(false);
    }
  };

  const togglePerfilPublico = async () => {
    try {
      setCarregando(true);
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
        localStorage.setItem(
          "perfilPublico",
          usuarioAtualizado.perfil === "Publico"
        );
        mostrarMensagem(`Perfil alterado para ${novoPerfil} com sucesso!`);
      } else {
        console.error(
          "Erro ao alterar visibilidade do perfil. Resposta inválida:",
          usuarioAtualizado
        );
        mostrarMensagem("Erro ao alterar visibilidade do perfil", "error");
      }
    } catch (error) {
      console.error("Erro ao alterar visibilidade do perfil:", error);
      mostrarMensagem("Erro ao alterar visibilidade do perfil", "error");
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    mostrarMensagem("Logout realizado com sucesso!");
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  // Função de debounce para busca
  const handleBuscaChange = (e) => {
    const valor = e.target.value;
    setTermoPesquisa(valor);

    // Limpa o timeout anterior se houver um
    if (buscaTimeout) {
      clearTimeout(buscaTimeout);
    }

    // Se o campo estiver vazio, não faz a busca
    if (!valor.trim()) {
      setPerfisEncontrados([]);
      return;
    }

    // Define um novo timeout para buscar apenas depois que o usuário parar de digitar
    const novoTimeout = setTimeout(() => {
      buscarPerfis(valor);
    }, 500); // 500ms de delay

    setBuscaTimeout(novoTimeout);
  };

  // Função de busca otimizada
  const buscarPerfis = async (termo) => {
    if (!termo || !termo.trim()) {
      setPerfisEncontrados([]);
      return;
    }

    try {
      setCarregandoPesquisa(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3030/usuario", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: termo,
          perfil: "Publico",
        },
      });
      const resultados = response.data.data || response.data || [];
      setPerfisEncontrados(resultados);

      if (resultados.length === 0 && termo.trim()) {
        mostrarMensagem("Nenhum perfil encontrado com este termo", "info");
      }
    } catch (error) {
      console.error("Erro ao pesquisar perfis:", error);
      mostrarMensagem("Erro ao pesquisar perfis", "error");
    } finally {
      setCarregandoPesquisa(false);
    }
  };

  // Mantém a função existente para o botão de busca
  const pesquisarPerfis = () => {
    if (!termoPesquisa.trim()) {
      mostrarMensagem("Digite um termo para pesquisar", "warning");
      return;
    }

    buscarPerfis(termoPesquisa);
  };

  const handlePerfilClick = (id) => {
    navigate(`/home/perfil/${id}`);
  };

  const aceitarSolicitacao = async (solicitacaoId) => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:3030/amizades/${solicitacaoId}`,
        { status: "aceito" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      mostrarMensagem("Solicitação de amizade aceita com sucesso!");
      // Atualizar listas
      await fetchAmigosESolicitacoes();
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
      mostrarMensagem("Erro ao aceitar solicitação de amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const recusarSolicitacao = async (solicitacaoId) => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3030/amizades/${solicitacaoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarMensagem("Solicitação de amizade recusada com sucesso!");
      // Atualizar listas
      await fetchAmigosESolicitacoes();
    } catch (error) {
      console.error("Erro ao recusar solicitação:", error);
      mostrarMensagem("Erro ao recusar solicitação de amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const removerAmizade = async (amizadeId) => {
    try {
      setCarregando(true);
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3030/amizades/${amizadeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      mostrarMensagem("Amizade removida com sucesso!");
      // Atualizar lista de amigos
      await fetchAmigosESolicitacoes();
    } catch (error) {
      console.error("Erro ao remover amizade:", error);
      mostrarMensagem("Erro ao remover amizade", "error");
    } finally {
      setCarregando(false);
    }
  };

  const fetchAmigosESolicitacoes = async () => {
    try {
      setCarregando(true);
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
      mostrarMensagem("Erro ao carregar amigos e solicitações", "error");
    } finally {
      setCarregando(false);
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
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#ccbd9e",
                borderBottom: "1px solid #ccbd9e",
                pb: 1,
                mb: 3,
              }}
            >
              Configurações do Perfil
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Privacidade
              </Typography>
              <Card
                variant="outlined"
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      {perfilPublico
                        ? "Seu perfil é público"
                        : "Seu perfil é privado"}
                    </Typography>
                    <Button
                      startIcon={perfilPublico ? <Public /> : <VisibilityOff />}
                      variant="contained"
                      onClick={togglePerfilPublico}
                      size="small"
                      sx={{
                        backgroundColor: "#ccbd9e",
                        color: "#333",
                        "&:hover": { backgroundColor: "#b5a78a" },
                      }}
                    >
                      {perfilPublico ? "Tornar Privado" : "Tornar Público"}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Conta
              </Typography>
              <Card
                variant="outlined"
                sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
              >
                <CardContent>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<ExitToApp />}
                    onClick={logout}
                    sx={{ borderColor: "#ccbd9e", color: "#333" }}
                  >
                    Sair da Conta
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        );
      case "amigos":
        return (
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#ccbd9e",
                borderBottom: "1px solid #ccbd9e",
                pb: 1,
                mb: 3,
              }}
            >
              Amigos
            </Typography>

            {solicitacoesPendentes.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Solicitações Pendentes
                  <Chip
                    label={solicitacoesPendentes.length}
                    color="error"
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                {solicitacoesPendentes.map((solicitacao) => (
                  <Card
                    key={solicitacao.id}
                    variant="outlined"
                    sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            src={solicitacao.usuario?.imagemPerfil}
                            sx={{ mr: 2 }}
                          />
                          <Typography>
                            {solicitacao.usuario?.apelido || "Solicitante"}
                          </Typography>
                        </Box>
                        <Box>
                          <Tooltip title="Aceitar">
                            <IconButton
                              color="success"
                              onClick={() => aceitarSolicitacao(solicitacao.id)}
                              disabled={carregando}
                            >
                              <Check />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Recusar">
                            <IconButton
                              color="error"
                              onClick={() => recusarSolicitacao(solicitacao.id)}
                              disabled={carregando}
                            >
                              <Close />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            <Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Meus Amigos
                {listaAmigos.length > 0 && (
                  <Chip
                    label={listaAmigos.length}
                    color="primary"
                    size="small"
                    sx={{ ml: 1, backgroundColor: "#ccbd9e", color: "#333" }}
                  />
                )}
              </Typography>

              {listaAmigos.length > 0 ? (
                listaAmigos.map((amizade) => {
                  const meuId = parseInt(localStorage.getItem("id"));
                  const amigo =
                    parseInt(amizade.usuario_id) === meuId
                      ? amizade.amigo
                      : amizade.usuario;

                  return (
                    <Card
                      key={amizade.id}
                      variant="outlined"
                      sx={{ mb: 2, backgroundColor: "#f5f5f5" }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => handlePerfilClick(amigo.id)}
                          >
                            <Avatar src={amigo?.imagemPerfil} sx={{ mr: 2 }} />
                            <Typography>{amigo?.apelido || "Amigo"}</Typography>
                          </Box>
                          <Tooltip title="Remover amizade">
                            <IconButton
                              color="error"
                              onClick={() => removerAmizade(amizade.id)}
                              disabled={carregando}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Alert severity="info">
                  Você ainda não tem amigos adicionados.
                </Alert>
              )}
            </Box>
          </Box>
        );
      case "desejos":
        return (
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                color: "#ccbd9e",
                borderBottom: "1px solid #ccbd9e",
                pb: 1,
              }}
            >
              Lista de Desejos
            </Typography>
            <Alert severity="info" sx={{ mt: 2 }}>
              Funcionalidade em desenvolvimento. Em breve você poderá adicionar
              livros à sua lista de desejos!
            </Alert>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
            <Typography
              variant="h4"
              gutterBottom
              sx={{ color: "#333", fontWeight: "medium" }}
            >
              Meu Perfil
            </Typography>
            <Box>
              <IconButton
                sx={{ color: "#ccbd9e" }}
                onClick={compartilharPerfil}
              >
                <ShareIcon />
              </IconButton>
              <IconButton
                sx={{ color: "#ccbd9e" }}
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={4}>
            {/* Coluna da esquerda - Informações do perfil */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Tooltip title="Atualizar foto">
                      <label htmlFor="icon-button-file">
                        <IconButton
                          component="span"
                          sx={{
                            backgroundColor: "#ccbd9e",
                            color: "#333",
                            "&:hover": { backgroundColor: "#b5a78a" },
                          }}
                        >
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </label>
                    </Tooltip>
                  }
                >
                  <Avatar
                    src={imagemPerfil}
                    alt="Foto de Perfil"
                    sx={{
                      width: 120,
                      height: 120,
                      border: "3px solid #ccbd9e",
                      boxShadow: 2,
                    }}
                  />
                </Badge>
                <input
                  id="icon-button-file"
                  type="file"
                  hidden
                  onChange={atualizarImagemPerfil}
                  accept="image/*"
                />

                <Typography variant="h5" sx={{ mt: 2, color: "#333" }}>
                  {usuario?.apelido || "Carregando..."}
                </Typography>

                <Typography variant="body2" sx={{ color: "#777", mb: 2 }}>
                  {usuario?.email || ""}
                </Typography>

                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Chip
                    icon={
                      perfilPublico ? (
                        <Public fontSize="small" />
                      ) : (
                        <VisibilityOff fontSize="small" />
                      )
                    }
                    label={perfilPublico ? "Perfil Público" : "Perfil Privado"}
                    sx={{
                      backgroundColor: perfilPublico ? "#ccbd9e" : "#f0f0f0",
                      color: perfilPublico ? "#333" : "#666",
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "#f9f6f0",
                    border: "1px solid #ccbd9e",
                    boxShadow: 1,
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <EditIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "#ccbd9e" }}
                      />
                      Sobre Mim
                    </Typography>

                    {editandoBiografia ? (
                      <Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={biografia}
                          onChange={(e) => setBiografia(e.target.value)}
                          sx={{ mb: 2 }}
                          placeholder="Conte um pouco sobre você..."
                        />
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                          }}
                        >
                          <Button
                            variant="outlined"
                            onClick={() => setEditandoBiografia(false)}
                            sx={{
                              color: "#ccbd9e",
                              borderColor: "#ccbd9e",
                              "&:hover": { borderColor: "#b5a78a" },
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="contained"
                            onClick={salvarBiografia}
                            disabled={carregando}
                            sx={{
                              backgroundColor: "#ccbd9e",
                              color: "#333",
                              "&:hover": { backgroundColor: "#b5a78a" },
                            }}
                          >
                            {carregando ? (
                              <CircularProgress size={24} />
                            ) : (
                              "Salvar"
                            )}
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.95rem", mb: 2, minHeight: "80px" }}
                        >
                          {biografia || "Nenhuma biografia cadastrada."}
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => setEditandoBiografia(true)}
                          size="small"
                          sx={{
                            color: "#ccbd9e",
                            borderColor: "#ccbd9e",
                            "&:hover": { borderColor: "#b5a78a" },
                          }}
                        >
                          Editar Biografia
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ mt: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    backgroundColor: "#f9f6f0",
                    border: "1px solid #ccbd9e",
                  }}
                >
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 2,
                        fontWeight: "bold",
                        color: "#333",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Group
                        fontSize="small"
                        sx={{ mr: 1, color: "#ccbd9e" }}
                      />
                      Amigos
                      {listaAmigos.length > 0 && (
                        <Chip
                          label={listaAmigos.length}
                          size="small"
                          sx={{
                            ml: 1,
                            backgroundColor: "#ccbd9e",
                            color: "#333",
                          }}
                        />
                      )}
                    </Typography>

                    {listaAmigos.length > 0 ? (
                      <Grid container spacing={1}>
                        {listaAmigos.slice(0, 3).map((amizade) => {
                          const meuId = parseInt(localStorage.getItem("id"));
                          const amigo =
                            parseInt(amizade.usuario_id) === meuId
                              ? amizade.amigo
                              : amizade.usuario;

                          return (
                            <Grid item xs={4} key={amizade.id}>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  cursor: "pointer",
                                }}
                                onClick={() => handlePerfilClick(amigo.id)}
                              >
                                <Avatar
                                  src={amigo?.imagemPerfil}
                                  sx={{ width: 40, height: 40 }}
                                />
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: "0.8rem",
                                    mt: 1,
                                    textAlign: "center",
                                  }}
                                >
                                  {(amigo?.apelido || "").length > 8
                                    ? `${amigo?.apelido.slice(0, 8)}...`
                                    : amigo?.apelido}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    ) : (
                      <Typography variant="body2">
                        Você ainda não possui amigos.
                      </Typography>
                    )}

                    {listaAmigos.length > 0 && (
                      <Button
                        fullWidth
                        variant="text"
                        onClick={() => {
                          setViewDrawer("amigos");
                          setDrawerOpen(true);
                        }}
                        sx={{
                          mt: 2,
                          color: "#ccbd9e",
                          "&:hover": { backgroundColor: "#f5f5f5" },
                        }}
                      >
                        Ver todos
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Grid>

            {/* Coluna da direita - Pesquisa de perfis */}
            <Grid item xs={12} md={8}>
              <Card
                variant="outlined"
                sx={{
                  mb: 3,
                  border: "1px solid #ccbd9e",
                  boxShadow: 1,
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: "#333" }}>
                    Pesquisar Usuários
                  </Typography>

                  <Box display="flex" gap={2} alignItems="center" mb={2}>
                    <TextField
                      label="Buscar por nome ou apelido"
                      value={termoPesquisa}
                      onChange={handleBuscaChange}
                      fullWidth
                      variant="outlined"
                      size="small"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          pesquisarPerfis();
                          e.preventDefault();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={pesquisarPerfis}
                      disabled={carregandoPesquisa}
                      sx={{
                        backgroundColor: "#ccbd9e",
                        color: "#333",
                        "&:hover": { backgroundColor: "#b5a78a" },
                      }}
                    >
                      {carregandoPesquisa ? (
                        <CircularProgress size={24} />
                      ) : (
                        "Buscar"
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {carregandoPesquisa ? (
                <Box display="flex" justifyContent="center" my={4}>
                  <CircularProgress sx={{ color: "#ccbd9e" }} />
                </Box>
              ) : perfisEncontrados.length > 0 ? (
                <Box>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ mb: 2, fontWeight: "medium" }}
                  >
                    Resultados da Pesquisa
                  </Typography>

                  <Grid container spacing={2}>
                    {perfisEncontrados.map((perfil) => (
                      <Grid item xs={12} sm={6} key={perfil.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            cursor: "pointer",
                            "&:hover": { boxShadow: 3 },
                            transition: "box-shadow 0.3s ease",
                          }}
                          onClick={() => handlePerfilClick(perfil.id)}
                        >
                          <CardContent>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                src={perfil.imagemPerfil}
                                sx={{ width: 50, height: 50, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {perfil.apelido}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {perfil.biografia || "Sem biografia."}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : termoPesquisa ? (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                  <Typography color="text.secondary">
                    Nenhum resultado encontrado para "{termoPesquisa}".
                  </Typography>
                </Box>
              ) : null}
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 350 },
            backgroundColor: "#fff",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
          }}
        >
          <Typography variant="h6" sx={{ color: "#333" }}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ borderBottom: "1px solid #eee" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              p: 1,
            }}
          >
            <Tooltip title="Configurações">
              <IconButton
                onClick={() => setViewDrawer("config")}
                sx={{
                  color: viewDrawer === "config" ? "#ccbd9e" : "inherit",
                  transform:
                    viewDrawer === "config" ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s",
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Amigos">
              <IconButton
                onClick={() => setViewDrawer("amigos")}
                sx={{
                  color: viewDrawer === "amigos" ? "#ccbd9e" : "inherit",
                  transform:
                    viewDrawer === "amigos" ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s",
                }}
              >
                <Badge
                  badgeContent={solicitacoesPendentes.length}
                  color="error"
                >
                  <Group />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Lista de Desejos">
              <IconButton
                onClick={() => setViewDrawer("desejos")}
                sx={{
                  color: viewDrawer === "desejos" ? "#ccbd9e" : "inherit",
                  transform:
                    viewDrawer === "desejos" ? "scale(1.1)" : "scale(1)",
                  transition: "all 0.2s",
                }}
              >
                <Favorite />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        {renderDrawerContent()}
      </Drawer>

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

export default Perfil;
