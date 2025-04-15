import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  FormControl,
  Select,
  MenuItem,
  Button,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";

const AvaliacaoLivros = ({ onAvaliacaoEnviada }) => {
  const { id } = useParams();
  const { register, handleSubmit, reset, formState } = useForm();
  const [avaliacao, setAvaliacao] = useState(3);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Substituir por valor númerico de avaliação
      data.avaliacao = avaliacao;

      await axios.post(`http://localhost:3030/livros/${id}/avaliacao`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Feedback de sucesso e resetar formulário
      setSuccess(true);
      reset();

      // Notificar componente pai para atualizar comentários
      if (onAvaliacaoEnviada) {
        onAvaliacaoEnviada();
      }
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Erro ao enviar avaliação"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
  };

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h6" gutterBottom>
        Avaliar Livro
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography component="legend" sx={{ mr: 2 }}>
              Avaliação:
            </Typography>
            <Rating
              name="avaliacao"
              value={avaliacao}
              onChange={(event, newValue) => {
                setAvaliacao(newValue);
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ alignSelf: "flex-start" }}
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </Button>
        </Box>
      </form>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Snackbar open={success} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Avaliação enviada com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AvaliacaoLivros;
