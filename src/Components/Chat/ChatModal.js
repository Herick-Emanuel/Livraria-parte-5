import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:3030");

function ChatModal({ open, onClose, amigo, meuId }) {
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");

  useEffect(() => {
    if (open) {
      const fetchMensagens = async () => {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get("http://localhost:3030/mensagens", {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              remetente_id: meuId,
              destinatario_id: amigo.id,
            },
          });
          setMensagens(data.data || []);
        } catch (error) {
          console.error("Erro ao buscar mensagens:", error);
        }
      };
      fetchMensagens();

      // Listener para novas mensagens em tempo real
      socket.on("mensagem", (mensagem) => {
        if (
          (mensagem.remetente_id === amigo.id &&
            mensagem.destinatario_id === meuId) ||
          (mensagem.remetente_id === meuId &&
            mensagem.destinatario_id === amigo.id)
        ) {
          setMensagens((prev) => [...prev, mensagem]);
        }
      });
    }
    return () => {
      socket.off("mensagem");
    };
  }, [open, amigo, meuId]);

  const enviarMensagem = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        remetente_id: meuId,
        destinatario_id: amigo.id,
        mensagem: novaMensagem,
      };
      const { data } = await axios.post(
        "http://localhost:3030/mensagens",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMensagens([...mensagens, data]);
      setNovaMensagem("");
      socket.emit("mensagem", data);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Chat com {amigo.apelido}
        </Typography>
        <List sx={{ maxHeight: 200, overflowY: "auto" }}>
          {mensagens.map((msg) => (
            <ListItem key={msg.id}>
              <ListItemText
                primary={msg.mensagem}
                secondary={msg.remetente_id === meuId ? "Você" : amigo.apelido}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", mt: 2 }}>
          <TextField
            fullWidth
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <Button onClick={enviarMensagem} variant="contained" sx={{ ml: 1 }}>
            Enviar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ChatModal;
