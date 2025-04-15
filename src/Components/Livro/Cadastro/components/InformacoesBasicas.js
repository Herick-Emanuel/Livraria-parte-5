import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import "../Cadastro.css";

const InformacoesBasicas = ({
  novoLivro,
  handleInputChange,
  handleGeneroChange,
  validationErrors,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Título"
          variant="outlined"
          value={novoLivro.titulo}
          onChange={(e) => handleInputChange("titulo", e.target.value)}
          error={!!validationErrors.titulo}
          helperText={validationErrors.titulo}
          required
          InputProps={{
            sx: {
              color: "#ccbd9e",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccbd9e",
              },
            },
          }}
          InputLabelProps={{
            sx: { color: "#ccbd9e" },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Autor"
          variant="outlined"
          value={novoLivro.autor}
          onChange={(e) => handleInputChange("autor", e.target.value)}
          error={!!validationErrors.autor}
          helperText={validationErrors.autor}
          required
          InputProps={{
            sx: {
              color: "#ccbd9e",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccbd9e",
              },
            },
          }}
          InputLabelProps={{
            sx: { color: "#ccbd9e" },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl
          fullWidth
          error={!!validationErrors.genero}
          sx={{
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccbd9e",
            },
            "& .MuiSelect-select": {
              color: "#ccbd9e",
            },
            "& .MuiInputLabel-root": {
              color: "#ccbd9e",
            },
          }}
        >
          <InputLabel id="genero-label">Gênero</InputLabel>
          <Select
            labelId="genero-label"
            value={novoLivro.genero}
            onChange={handleGeneroChange}
            label="Gênero"
            required
          >
            <MenuItem value="">Selecione o Gênero</MenuItem>
            <MenuItem value="Fantasia">Fantasia</MenuItem>
            <MenuItem value="Romance">Romance</MenuItem>
            <MenuItem value="Ficcao">Ficção</MenuItem>
            <MenuItem value="Distopia">Distopia</MenuItem>
            <MenuItem value="Acao">Ação</MenuItem>
            <MenuItem value="Aventura">Aventura</MenuItem>
            <MenuItem value="Ficcao Cientifica">Ficção Científica</MenuItem>
            <MenuItem value="Cientifico">Científico</MenuItem>
            <MenuItem value="Historia">História</MenuItem>
            <MenuItem value="Suspense">Suspense</MenuItem>
            <MenuItem value="Terror">Terror</MenuItem>
          </Select>
          {validationErrors.genero && (
            <FormHelperText sx={{ color: "#f44336" }}>
              {validationErrors.genero}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default InformacoesBasicas;
