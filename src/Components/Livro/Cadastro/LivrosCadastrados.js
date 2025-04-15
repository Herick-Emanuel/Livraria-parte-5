import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Grid,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Paper,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  Rating,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import UpdateIcon from "@mui/icons-material/Update";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import "./Cadastro.css";

const LivrosCadastrados = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [livros, setLivros] = useState({ data: [] });
  const [filtroGenero, setFiltroGenero] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [conteudoLeituraMap, setConteudoLeituraMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ message: "", type: "" });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    action: null,
    livroId: null,
    actionType: "",
  });
  const [tabAtual, setTabAtual] = useState(0);
  const [filtroPesquisa, setFiltroPesquisa] = useState("");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const token = localStorage.getItem("token");

  const fetchLivros = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3030/livros", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setLivros(response.data);
      } else {
        console.warn("Formato inesperado de dados:", response.data);
        setLivros({ data: [] });
      }
    } catch (error) {
      console.error("Erro ao obter livros:", error);
      setFeedback({
        message: "Erro ao carregar livros. Tente novamente mais tarde.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLivros();
  }, [fetchLivros]);

  const handleConfirmDialogOpen = (
    title,
    message,
    action,
    livroId,
    actionType
  ) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      action,
      livroId,
      actionType,
    });
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialog({
      ...confirmDialog,
      open: false,
    });
  };

  const handleConfirmAction = async () => {
    handleConfirmDialogClose();

    if (confirmDialog.action) {
      try {
        await confirmDialog.action(confirmDialog.livroId);
        setFeedback({
          message: `Operação "${confirmDialog.actionType}" realizada com sucesso!`,
          type: "success",
        });
      } catch (error) {
        console.error(`Erro na operação ${confirmDialog.actionType}:`, error);
        setFeedback({
          message: `Erro ao realizar a operação. ${error.message}`,
          type: "error",
        });
      }
    }
  };

  const aprovarLivro = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: "Aprovado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLivros();
    } catch (error) {
      console.error("Erro ao aprovar o livro:", error);
      throw error;
    }
  };

  const reprovarLivro = async (livroId) => {
    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: "Reprovado" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLivros();
    } catch (error) {
      console.error("Erro ao reprovar o livro:", error);
      throw error;
    }
  };

  const handleChangeStatus = async (livroId) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/livros/${livroId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const currentStatus = response.data.status;
      let newStatus;

      switch (currentStatus) {
        case "Em análise":
          newStatus = "Esgotado";
          break;
        case "Esgotado":
          newStatus = "Revisão";
          break;
        case "Revisão":
          newStatus = "Em análise";
          break;
        default:
          newStatus = "Em análise";
          break;
      }

      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchLivros();
      setFeedback({
        message: `Status alterado para: ${newStatus}`,
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao alterar o status do livro:", error);
      setFeedback({
        message: "Erro ao alterar o status do livro",
        type: "error",
      });
    }
  };

  const generosPossiveis = [
    "Fantasia",
    "Romance",
    "Distopia",
    "Acao",
    "Aventura",
    "Terror",
    "Suspense",
    "Historia",
    "Cientifico",
    "Ficcao",
    "Ficcao Cientifica",
  ];

  const statusPossiveis = [
    "Aprovado",
    "Reprovado",
    "Em análise",
    "Esgotado",
    "Revisão",
  ];

  const handleChangeGenero = async (livroId) => {
    try {
      const response = await axios.get(
        `http://localhost:3030/livros/${livroId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const currentGenero = response.data.genero;
      const indexAtual = generosPossiveis.indexOf(currentGenero);
      const newGenero =
        indexAtual === -1 || indexAtual === generosPossiveis.length - 1
          ? generosPossiveis[0]
          : generosPossiveis[indexAtual + 1];

      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { genero: newGenero },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchLivros();
      setFeedback({
        message: `Gênero alterado para: ${newGenero}`,
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao alterar o gênero do livro:", error);
      setFeedback({
        message: "Erro ao alterar o gênero do livro",
        type: "error",
      });
    }
  };

  const handleConteudoLeituraChange = (livroId, conteudo) => {
    setConteudoLeituraMap({
      ...conteudoLeituraMap,
      [livroId]: conteudo,
    });
  };

  const handleAtualizarLeitura = async (livroId) => {
    const conteudo = conteudoLeituraMap[livroId];

    if (!conteudo || conteudo.trim() === "") {
      setFeedback({
        message: "O conteúdo de leitura não pode estar vazio",
        type: "error",
      });
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3030/livros/${livroId}`,
        { leitura: conteudo },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Limpar apenas o conteúdo atualizado
      setConteudoLeituraMap({
        ...conteudoLeituraMap,
        [livroId]: "",
      });

      fetchLivros();
      setFeedback({
        message: "Conteúdo de leitura atualizado com sucesso",
        type: "success",
      });
    } catch (error) {
      console.error("Erro ao atualizar a leitura do livro:", error);
      setFeedback({
        message: "Erro ao atualizar o conteúdo de leitura",
        type: "error",
      });
    }
  };

  const handleFiltrarPorGenero = (genero) => {
    setFiltroGenero(genero);
  };

  const handleFiltrarPorStatus = (status) => {
    setFiltroStatus(status);
  };

  const handleChangePesquisa = (event) => {
    setFiltroPesquisa(event.target.value);
  };

  const handleChangeTab = (event, newValue) => {
    setTabAtual(newValue);
  };

  const toggleMostrarFiltros = () => {
    setMostrarFiltros(!mostrarFiltros);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Aprovado":
        return "status-aprovado";
      case "Reprovado":
        return "status-reprovado";
      case "Em análise":
        return "status-analise";
      case "Esgotado":
        return "status-esgotado";
      case "Revisão":
        return "status-revisao";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Aprovado":
        return <CheckCircleIcon fontSize="small" />;
      case "Reprovado":
        return <CancelIcon fontSize="small" />;
      case "Em análise":
        return <UpdateIcon fontSize="small" />;
      case "Esgotado":
        return <AutorenewIcon fontSize="small" />;
      case "Revisão":
        return <EditIcon fontSize="small" />;
      default:
        return null;
    }
  };

  const formatarPreco = (preco) => {
    if (!preco && preco !== 0) return "Não informado";

    // Garante que o preço é um número
    const precoNum = Number(preco);
    if (isNaN(precoNum)) return preco;

    // Formata para R$ 0,00
    return `R$ ${precoNum.toFixed(2).replace(".", ",")}`;
  };

  // Filtragem por status, gênero e pesquisa
  const livrosFiltrados = livros.data.filter((livro) => {
    // Filtro por pesquisa
    const pesquisaMatch =
      filtroPesquisa === "" ||
      livro.titulo.toLowerCase().includes(filtroPesquisa.toLowerCase()) ||
      livro.autor.toLowerCase().includes(filtroPesquisa.toLowerCase());

    // Filtro por gênero
    const generoMatch = filtroGenero === "" || livro.genero === filtroGenero;

    // Filtro por status
    const statusMatch = filtroStatus === "" || livro.status === filtroStatus;

    // Filtro por tabs
    let tabMatch = true;
    if (tabAtual === 1) {
      tabMatch = livro.status === "Em análise";
    } else if (tabAtual === 2) {
      tabMatch = livro.status === "Aprovado";
    } else if (tabAtual === 3) {
      tabMatch = livro.status === "Reprovado";
    }

    return pesquisaMatch && generoMatch && statusMatch && tabMatch;
  });

  const countLivrosPorStatus = (status) => {
    return livros.data.filter((livro) => livro.status === status).length;
  };

  const closeFeedback = () => {
    setFeedback({ message: "", type: "" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }} className="livros-container">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          className="livros-titulo"
        >
          Gerenciamento de Livros
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabAtual}
            onChange={handleChangeTab}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            centered={!isMobile}
            className="livros-tabs"
            sx={{ mb: 2 }}
          >
            <Tab
              label="Todos"
              icon={
                <Badge badgeContent={livros.data.length} color="primary">
                  <MenuBookIcon />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Em Análise"
              icon={
                <Badge
                  badgeContent={countLivrosPorStatus("Em análise")}
                  color="warning"
                >
                  <UpdateIcon />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Aprovados"
              icon={
                <Badge
                  badgeContent={countLivrosPorStatus("Aprovado")}
                  color="success"
                >
                  <CheckCircleIcon />
                </Badge>
              }
              iconPosition="start"
            />
            <Tab
              label="Reprovados"
              icon={
                <Badge
                  badgeContent={countLivrosPorStatus("Reprovado")}
                  color="error"
                >
                  <CancelIcon />
                </Badge>
              }
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                placeholder="Pesquisar por título ou autor..."
                variant="outlined"
                size="small"
                value={filtroPesquisa}
                onChange={handleChangePesquisa}
                sx={{ backgroundColor: "#f9f9f9" }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                startIcon={<FilterListIcon />}
                onClick={toggleMostrarFiltros}
                sx={{ height: "40px" }}
              >
                {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
              </Button>
            </Grid>
          </Grid>

          {mostrarFiltros && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="select-genero-label">
                      Filtrar por Gênero
                    </InputLabel>
                    <Select
                      labelId="select-genero-label"
                      id="selectGenero"
                      value={filtroGenero}
                      label="Filtrar por Gênero"
                      onChange={(e) => handleFiltrarPorGenero(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Todos os Gêneros</em>
                      </MenuItem>
                      {generosPossiveis.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="select-status-label">
                      Filtrar por Status
                    </InputLabel>
                    <Select
                      labelId="select-status-label"
                      id="selectStatus"
                      value={filtroStatus}
                      label="Filtrar por Status"
                      onChange={(e) => handleFiltrarPorStatus(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Todos os Status</em>
                      </MenuItem>
                      {statusPossiveis.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        ) : livrosFiltrados.length > 0 ? (
          <Grid container spacing={3}>
            {livrosFiltrados.map((livro) => (
              <Grid item xs={12} sm={6} md={4} key={livro.id}>
                <Card
                  variant="outlined"
                  className="livro-card"
                  sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "none",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  >
                    <Tooltip title={livro.status}>
                      <Chip
                        label={livro.status}
                        size="small"
                        icon={getStatusIcon(livro.status)}
                        className={getStatusColor(livro.status)}
                        sx={{
                          fontWeight: "bold",
                          boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                        }}
                      />
                    </Tooltip>
                  </Box>

                  {livro.imagem ? (
                    <CardMedia
                      component="img"
                      image={livro.imagem}
                      alt={`Capa do livro ${livro.titulo}`}
                      sx={{ height: 200, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#495168",
                        color: "#ccbd9e",
                      }}
                    >
                      <Typography variant="body2">
                        Sem imagem disponível
                      </Typography>
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      pb: 1,
                      backgroundColor: "#495168",
                      color: "#ccbd9e",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontWeight: "bold",
                        color: "#ccbd9e",
                        height: "3rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {livro.titulo}
                    </Typography>

                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, color: "#ccbd9e" }}
                        >
                          <strong>Autor:</strong> {livro.autor}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, color: "#ccbd9e" }}
                        >
                          <strong>Gênero:</strong> {livro.genero}
                        </Typography>
                        {livro.editora && (
                          <Typography
                            variant="body2"
                            sx={{ mb: 0.5, color: "#ccbd9e" }}
                          >
                            <strong>Editora:</strong> {livro.editora}
                          </Typography>
                        )}
                        <Typography
                          variant="body2"
                          sx={{ mb: 0.5, color: "#ccbd9e" }}
                        >
                          <strong>Ano:</strong> {livro.anoPublicacao}
                        </Typography>

                        {livro.preco !== null && livro.preco !== undefined && (
                          <Typography
                            variant="body2"
                            sx={{
                              mb: 0.5,
                              fontWeight: "bold",
                              color: "#ccbd9e",
                            }}
                          >
                            <strong>Preço:</strong> {formatarPreco(livro.preco)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>

                    {livro.descricao && (
                      <Typography variant="body2" className="livros-descricao">
                        <strong>Descrição:</strong> {livro.descricao}
                      </Typography>
                    )}
                  </CardContent>

                  <Divider />

                  <Box sx={{ p: 2, backgroundColor: "#495168" }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{ color: "#ccbd9e" }}
                    >
                      Ações
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="inherit"
                          fullWidth
                          startIcon={<EditIcon />}
                          onClick={() => handleChangeGenero(livro.id)}
                          sx={{ color: "#ccbd9e", borderColor: "#ccbd9e" }}
                        >
                          Alterar Gênero
                        </Button>
                      </Grid>

                      {livro.status === "Em análise" && (
                        <>
                          <Grid item xs={6}>
                            <Button
                              variant="outlined"
                              size="small"
                              color="inherit"
                              fullWidth
                              startIcon={<CheckCircleIcon />}
                              onClick={() =>
                                handleConfirmDialogOpen(
                                  "Aprovar Livro",
                                  `Deseja aprovar o livro "${livro.titulo}"?`,
                                  aprovarLivro,
                                  livro.id,
                                  "Aprovar"
                                )
                              }
                              sx={{ color: "#4caf50", borderColor: "#4caf50" }}
                            >
                              Aprovar
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              variant="outlined"
                              size="small"
                              color="inherit"
                              fullWidth
                              startIcon={<CancelIcon />}
                              onClick={() =>
                                handleConfirmDialogOpen(
                                  "Reprovar Livro",
                                  `Deseja reprovar o livro "${livro.titulo}"?`,
                                  reprovarLivro,
                                  livro.id,
                                  "Reprovar"
                                )
                              }
                              sx={{ color: "#f44336", borderColor: "#f44336" }}
                            >
                              Reprovar
                            </Button>
                          </Grid>
                        </>
                      )}

                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="inherit"
                          fullWidth
                          startIcon={<AutorenewIcon />}
                          onClick={() =>
                            handleConfirmDialogOpen(
                              "Mudar Status",
                              `Deseja alterar o status do livro "${livro.titulo}"?`,
                              handleChangeStatus,
                              livro.id,
                              "Alterar Status"
                            )
                          }
                          sx={{ color: "#ccbd9e", borderColor: "#ccbd9e" }}
                        >
                          Mudar Status
                        </Button>
                      </Grid>

                      {livro.leitura && (
                        <Grid item xs={12}>
                          <Divider
                            sx={{
                              my: 1,
                              backgroundColor: "#ccbd9e",
                              opacity: 0.3,
                            }}
                          />
                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            sx={{ color: "#ccbd9e" }}
                          >
                            Atualizar Conteúdo
                          </Typography>
                          <TextField
                            label="Novo Conteúdo"
                            multiline
                            rows={2}
                            variant="outlined"
                            size="small"
                            value={conteudoLeituraMap[livro.id] || ""}
                            onChange={(e) =>
                              handleConteudoLeituraChange(
                                livro.id,
                                e.target.value
                              )
                            }
                            fullWidth
                            sx={{
                              mb: 1,
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "#ccbd9e",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#ccbd9e",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#ccbd9e",
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: "#ccbd9e",
                              },
                              "& .MuiInputBase-input": {
                                color: "#ccbd9e",
                              },
                            }}
                          />

                          <Button
                            variant="contained"
                            size="small"
                            color="inherit"
                            fullWidth
                            onClick={() => handleAtualizarLeitura(livro.id)}
                            disabled={
                              !conteudoLeituraMap[livro.id] ||
                              conteudoLeituraMap[livro.id].trim() === ""
                            }
                            sx={{
                              backgroundColor: "#ccbd9e",
                              color: "#fff",
                              "&:hover": {
                                backgroundColor: "#b5a78a",
                              },
                            }}
                          >
                            Atualizar Leitura
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert
            severity="info"
            variant="filled"
            sx={{
              mt: 2,
              bgcolor: "#ccbd9e",
              color: "#333",
              border: "1px solid #b5a78a",
            }}
          >
            Nenhum livro encontrado. Ajuste os filtros ou cadastre novos livros.
          </Alert>
        )}
      </Paper>

      {/* Diálogo de confirmação */}
      <Dialog open={confirmDialog.open} onClose={handleConfirmDialogClose}>
        <DialogTitle className="dialog-titulo">
          {confirmDialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmAction}
            color="inherit"
            variant="contained"
            autoFocus
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={!!feedback.message}
        autoHideDuration={5000}
        onClose={closeFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={closeFeedback}
          severity={feedback.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LivrosCadastrados;
