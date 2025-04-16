import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

function PerfilPostit({
  biografia,
  setBiografia,
  editandoBiografia,
  setEditandoBiografia,
  salvarBiografia,
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#f9f6f0",
        border: "1px solid #ccbd9e",
        boxShadow: 1,
        height: 250,
        overflowY: "auto",
      }}
    >
      <CardContent sx={{ height: "100%", p: 2 }}>
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
          <EditIcon fontSize="small" sx={{ mr: 1, color: "#ccbd9e" }} />
          Biografia
        </Typography>

        {editandoBiografia ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 60px)",
            }}
          >
            <TextField
              fullWidth
              multiline
              rows={5}
              value={biografia}
              onChange={(e) => setBiografia(e.target.value)}
              sx={{
                flex: 1,
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#ccbd9e",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ccbd9e",
                  },
                },
              }}
              placeholder="Conte um pouco sobre você..."
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                onClick={() => setEditandoBiografia(false)}
                sx={{
                  color: "#ccbd9e",
                  borderColor: "#ccbd9e",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#b5a78a",
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={salvarBiografia}
                sx={{
                  backgroundColor: "#ccbd9e",
                  color: "#333",
                  "&:hover": {
                    backgroundColor: "#b5a78a",
                  },
                }}
              >
                Salvar
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 60px)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                flex: 1,
                color: "#555",
                whiteSpace: "pre-wrap",
                overflowWrap: "break-word",
              }}
            >
              {biografia || "Sem biografia cadastrada."}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setEditandoBiografia(true)}
              sx={{
                mt: 2,
                alignSelf: "flex-end",
                color: "#ccbd9e",
                borderColor: "#ccbd9e",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#b5a78a",
                },
              }}
            >
              Editar
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default PerfilPostit;
