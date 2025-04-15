import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

const ComentarioLivros = ({ onComentarioEnviado }) => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Verificar se o comentário não está vazio
      if (!data.comentario || data.comentario.trim() === "") {
        throw new Error("O comentário não pode estar vazio");
      }

      await axios.post(`http://localhost:3030/livros/${id}/comentarios`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Feedback de sucesso e resetar formulário
      setSuccess(true);
      reset();

      // Notificar componente pai para atualizar comentários
      if (onComentarioEnviado) {
        onComentarioEnviado();
      }
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
      setError(
        error.response?.data?.message ||
          error.message ||
          "Erro ao enviar comentário"
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
        Comentar Livro
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Seu comentário"
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            error={!!errors.comentario}
            helperText={errors.comentario?.message}
            {...register("comentario", {
              required: "Comentário é obrigatório",
            })}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ alignSelf: "flex-start" }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Enviando...
              </>
            ) : (
              "Enviar Comentário"
            )}
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
          Comentário enviado com sucesso!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ComentarioLivros;
