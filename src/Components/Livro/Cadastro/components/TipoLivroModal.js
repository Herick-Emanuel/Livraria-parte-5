import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Divider,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import "../Cadastro.css";

const TipoLivroModal = ({ open, onClose, onSelectTipo }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/home/livros/livros-cadastrados");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: "#495168",
          color: "#ccbd9e",
        },
      }}
    >
      <DialogTitle
        sx={{ textAlign: "center", fontSize: "1.5rem", fontWeight: "bold" }}
      >
        Selecione o Tipo de Livro
      </DialogTitle>
      <Divider sx={{ backgroundColor: "#ccbd9e", opacity: 0.3 }} />
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card
              onClick={() => onSelectTipo("fisico")}
              sx={{
                cursor: "pointer",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                },
                backgroundColor: "#585f74",
                color: "#ccbd9e",
                border: "1px solid #ccbd9e",
              }}
            >
              <CardMedia
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pt: 4,
                  pb: 2,
                }}
              >
                <MenuBookIcon sx={{ fontSize: 80, color: "#ccbd9e" }} />
              </CardMedia>
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  Livro Físico
                </Typography>
                <Divider
                  sx={{ backgroundColor: "#ccbd9e", opacity: 0.3, mb: 2 }}
                />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Versão impressa do livro
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Precisa informar preço
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Permite definir a editora
                </Typography>
                <Typography variant="body2">
                  • Cadastre a capa do livro
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ccbd9e",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "#b5a78a",
                    },
                  }}
                >
                  Selecionar Livro Físico
                </Button>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              onClick={() => onSelectTipo("virtual")}
              sx={{
                cursor: "pointer",
                height: "100%",
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                },
                backgroundColor: "#585f74",
                color: "#ccbd9e",
                border: "1px solid #ccbd9e",
              }}
            >
              <CardMedia
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pt: 4,
                  pb: 2,
                }}
              >
                <AutoStoriesIcon sx={{ fontSize: 80, color: "#ccbd9e" }} />
              </CardMedia>
              <CardContent>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center", mb: 2 }}
                >
                  Livro Virtual
                </Typography>
                <Divider
                  sx={{ backgroundColor: "#ccbd9e", opacity: 0.3, mb: 2 }}
                />
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Versão digital do livro
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Upload de qualquer formato de texto
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Suporta TXT, DOC, PDF, RTF, HTML, MD e mais
                </Typography>
                <Typography variant="body2">• Tamanho máximo: 100MB</Typography>
                <Typography variant="body2">
                  • Cadastre a capa do livro
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#ccbd9e",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: "#b5a78a",
                    },
                  }}
                >
                  Selecionar Livro Virtual
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
        <Button onClick={handleCancel} sx={{ color: "#ccbd9e" }}>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TipoLivroModal;
