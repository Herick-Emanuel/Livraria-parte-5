import React from "react";
import { Box, Paper, Typography, Button, TextField } from "@mui/material";

function PerfilPostit({
  biografia,
  setBiografia,
  editandoBiografia,
  setEditandoBiografia,
  salvarBiografia,
}) {
  return (
    <Paper
      sx={{
        backgroundColor: "#260729",
        p: 2,
        boxShadow: 4,
        border: "1px solid #260729",
        height: 250,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {editandoBiografia ? (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            sx={{ flex: 1, mb: 1 }}
          />
          <Button variant="contained" onClick={salvarBiografia}>
            Salvar Biografia
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Typography variant="body1" sx={{ flex: 1 }}>
            {biografia || "Sem biografia cadastrada."}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setEditandoBiografia(true)}
            sx={{ mt: 1, alignSelf: "flex-end" }}
          >
            Editar Biografia
          </Button>
        </Box>
      )}
    </Paper>
  );
}

export default PerfilPostit;
