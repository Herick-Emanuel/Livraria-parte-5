import React from "react";
import {
  Grid,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "../Cadastro.css";

const DetalhesLivro = ({
  tipoLivro,
  novoLivro,
  livroFisico,
  setLivroFisico,
  handleInputChange,
  validationErrors,
  onDrop,
  getRootProps,
  getInputProps,
  isDragActive,
  previewImage,
  handleFileInputChange,
  nomeArquivo,
  maxFileSize = 100 * 1024 * 1024,
}) => {
  const tiposArquivosPermitidos = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/pdf",
    "text/html",
    "text/csv",
    "text/markdown",
    "text/richtext",
    "text/xml",
    "application/rtf",
    "application/x-rtf",
    "application/epub+zip",
    "application/x-ibooks+zip",
    "application/vnd.oasis.opendocument.text",
    "text/",
    "application/json",
  ];

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  const isFileTypeAllowed = (fileType) => {
    if (fileType.startsWith("text/")) return true;

    return tiposArquivosPermitidos.includes(fileType);
  };

  const extensoesAceitas =
    ".txt,.doc,.docx,.pdf,.html,.csv,.md,.markdown,.rtf,.xml,.epub,.odt,.json";

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={tipoLivro === "fisico" ? 6 : 12}>
        <TextField
          fullWidth
          label="Ano de Publicação"
          variant="outlined"
          type="number"
          value={novoLivro.anoPublicacao}
          onChange={(e) => handleInputChange("anoPublicacao", e.target.value)}
          error={!!validationErrors.anoPublicacao}
          helperText={validationErrors.anoPublicacao}
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

      {tipoLivro === "fisico" && (
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Preço"
            variant="outlined"
            value={livroFisico.preco}
            onChange={(e) =>
              setLivroFisico({ ...livroFisico, preco: e.target.value })
            }
            error={!!validationErrors.preco}
            helperText={validationErrors.preco}
            required
            placeholder="Ex: 29,90"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ color: "#ccbd9e" }}>
                  R$
                </InputAdornment>
              ),
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
      )}

      {tipoLivro === "fisico" && (
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Editora"
            variant="outlined"
            value={novoLivro.editora}
            onChange={(e) => handleInputChange("editora", e.target.value)}
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
      )}

      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Descrição"
          multiline
          rows={4}
          variant="outlined"
          value={novoLivro.descricao}
          onChange={(e) => handleInputChange("descricao", e.target.value)}
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
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ display: "flex", alignItems: "center", color: "#ccbd9e" }}
        >
          Capa do Livro
          <Tooltip title="A capa é essencial para atrair leitores. Recomendamos imagens com boa resolução e que representem bem o conteúdo do livro.">
            <IconButton size="small" sx={{ color: "#ccbd9e" }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "2px dashed",
            borderColor: isDragActive ? "#ccbd9e" : "rgba(204, 189, 158, 0.5)",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            mb: 2,
            backgroundColor: isDragActive
              ? "rgba(204, 189, 158, 0.08)"
              : "transparent",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              borderColor: "#ccbd9e",
              backgroundColor: "rgba(204, 189, 158, 0.04)",
            },
          }}
        >
          <input {...getInputProps()} />
          {previewImage ? (
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={previewImage}
                alt="Pré-visualização da capa"
                sx={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  mb: 2,
                }}
              />
              <Typography
                variant="caption"
                display="block"
                sx={{ color: "#ccbd9e" }}
              >
                Clique ou arraste para alterar a imagem
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2 }}>
              <CloudUploadIcon sx={{ fontSize: 60, color: "#ccbd9e", mb: 2 }} />
              <Typography
                variant="body1"
                sx={{ color: "#ccbd9e" }}
                gutterBottom
              >
                Arraste e solte a imagem da capa aqui
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#ccbd9e" }}
                gutterBottom
              >
                ou clique para selecionar
              </Typography>
              <Typography variant="caption" sx={{ color: "#ccbd9e" }}>
                Formatos aceitos: PNG, JPEG, JPG, WEBP (até 5MB)
              </Typography>
            </Box>
          )}
        </Box>
      </Grid>

      {tipoLivro === "virtual" && (
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", color: "#ccbd9e" }}
          >
            Conteúdo do Livro
            <Tooltip title="Faça upload do conteúdo completo do livro. Este conteúdo será disponibilizado para leitura após aprovação.">
              <IconButton size="small" sx={{ color: "#ccbd9e" }}>
                <InfoOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Card
            variant="outlined"
            sx={{ mb: 2, backgroundColor: "#585f74", borderColor: "#ccbd9e" }}
          >
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  sx={{
                    backgroundColor: validationErrors.conteudo
                      ? "#f44336"
                      : "#ccbd9e",
                    color: "#333",
                    "&:hover": {
                      backgroundColor: validationErrors.conteudo
                        ? "#d32f2f"
                        : "#b5a78a",
                    },
                  }}
                >
                  {nomeArquivo ? "Alterar Arquivo" : "Selecionar Arquivo"}
                  <input
                    type="file"
                    accept={extensoesAceitas}
                    hidden
                    onChange={(e) => handleFileInputChange(e.target.files[0])}
                  />
                </Button>
              </Box>

              {nomeArquivo ? (
                <Alert severity="success" sx={{ mb: 1, color: "#333" }}>
                  Arquivo selecionado: {nomeArquivo}
                </Alert>
              ) : (
                <Alert severity="info" sx={{ color: "#333" }}>
                  Nenhum arquivo selecionado. Selecione qualquer arquivo de
                  texto como:
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .TXT
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .DOC
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .DOCX
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .PDF
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .RTF
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .MD
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      .HTML
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        backgroundColor: "rgba(204, 189, 158, 0.2)",
                        p: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      e outros
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 1 }}
                  >
                    Tamanho máximo: {formatFileSize(maxFileSize)}
                  </Typography>
                </Alert>
              )}

              {validationErrors.conteudo && (
                <Typography
                  color="error"
                  variant="caption"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  {validationErrors.conteudo}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default DetalhesLivro;
