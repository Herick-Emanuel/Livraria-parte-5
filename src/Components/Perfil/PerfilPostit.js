import React from "react";
import { Box, Button } from "@mui/material";
import "../Perfil/Perfil.css";

function PerfilPostit({
  biografia,
  setBiografia,
  editandoBiografia,
  setEditandoBiografia,
  salvarBiografia,
}) {
  return (
    <Box className="perfil-biografia">
      {editandoBiografia ? (
        <>
          <textarea
            className="biografia-input"
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            placeholder="Escreva algo sobre você..."
            rows={6}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              className="btn-perfil" 
              onClick={salvarBiografia}
              sx={{ flex: 1 }}
            >
              ✓ Salvar
            </Button>
            <Button 
              className="btn-perfil outline" 
              onClick={() => setEditandoBiografia(false)}
              sx={{ flex: 1 }}
            >
              ✕ Cancelar
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box className="biografia-texto">
            {biografia || "✨ Clique em 'Editar' para adicionar uma biografia sobre você..."}
          </Box>
          <Button
            className="btn-perfil"
            onClick={() => setEditandoBiografia(true)}
            sx={{ alignSelf: 'flex-end', mt: 2 }}
          >
            ✏️ Editar Biografia
          </Button>
        </>
      )}
    </Box>
  );
}

export default PerfilPostit;
