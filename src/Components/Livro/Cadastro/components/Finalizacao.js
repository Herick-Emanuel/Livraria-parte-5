import React from "react";
import {
  Grid,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  Alert,
} from "@mui/material";
import "../Cadastro.css";

const Finalizacao = ({
  tipoLivro,
  novoLivro,
  livroFisico,
  nomeArquivo,
  previewImage,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card
          elevation={0}
          sx={{ mb: 2, backgroundColor: "#585f74", color: "#ccbd9e" }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Resumo do Livro
            </Typography>
            <Divider sx={{ mb: 2, backgroundColor: "#ccbd9e", opacity: 0.3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Tipo:</Typography>
                <Typography variant="body2" sx={{ color: "#d8ccb2", mb: 2 }}>
                  {tipoLivro === "fisico" ? "Físico" : "Virtual"}
                </Typography>

                <Typography variant="subtitle2">Título:</Typography>
                <Typography variant="body2" sx={{ color: "#d8ccb2", mb: 2 }}>
                  {novoLivro.titulo || "Não informado"}
                </Typography>

                <Typography variant="subtitle2">Autor:</Typography>
                <Typography variant="body2" sx={{ color: "#d8ccb2", mb: 2 }}>
                  {novoLivro.autor || "Não informado"}
                </Typography>

                <Typography variant="subtitle2">Gênero:</Typography>
                <Typography variant="body2" sx={{ color: "#d8ccb2", mb: 2 }}>
                  {novoLivro.genero || "Não informado"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Ano de Publicação:</Typography>
                <Typography variant="body2" sx={{ color: "#d8ccb2", mb: 2 }}>
                  {novoLivro.anoPublicacao || "Não informado"}
                </Typography>

                {tipoLivro === "fisico" && (
                  <>
                    <Typography variant="subtitle2">Preço:</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#d8ccb2", mb: 2 }}
                    >
                      {livroFisico.preco
                        ? `R$ ${livroFisico.preco}`
                        : "Não informado"}
                    </Typography>

                    <Typography variant="subtitle2">Editora:</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#d8ccb2", mb: 2 }}
                    >
                      {novoLivro.editora || "Não informada"}
                    </Typography>
                  </>
                )}

                {tipoLivro === "virtual" && (
                  <>
                    <Typography variant="subtitle2">Arquivo:</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#d8ccb2", mb: 2 }}
                    >
                      {nomeArquivo ? (
                        <>
                          {nomeArquivo}{" "}
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{
                              backgroundColor: "rgba(204, 189, 158, 0.3)",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              ml: 1,
                            }}
                          >
                            {nomeArquivo.split(".").pop().toUpperCase()}
                          </Typography>
                        </>
                      ) : (
                        "Nenhum arquivo selecionado"
                      )}
                    </Typography>
                  </>
                )}
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Descrição:</Typography>
                <Typography variant="body2" sx={{ color: "#d8ccb2", mb: 2 }}>
                  {novoLivro.descricao || "Não informada"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2">Capa:</Typography>
                {previewImage ? (
                  <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Box
                      component="img"
                      src={previewImage}
                      alt="Capa do livro"
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 150,
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "#d8ccb2" }}>
                    Nenhuma capa selecionada
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 2, color: "#333" }}>
              Após o cadastro, o livro passará por uma análise antes de ser
              publicado.
            </Alert>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Finalizacao;
