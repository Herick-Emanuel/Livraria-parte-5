import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cadastro.css";

import {
  Button,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useDropzone } from "react-dropzone";

import TipoLivroModal from "./components/TipoLivroModal";
import InformacoesBasicas from "./components/InformacoesBasicas";
import DetalhesLivro from "./components/DetalhesLivro";
import Finalizacao from "./components/Finalizacao";

const CadastrarLivro = () => {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [novoLivro, setNovoLivro] = useState({
    titulo: "",
    autor: "",
    editora: "",
    genero: "",
    anoPublicacao: "",
    descricao: "",
    capa: "",
  });

  const [tipoLivro, setTipoLivro] = useState("");
  const [livroFisico, setLivroFisico] = useState({ preco: "" });
  const [conteudoLivro, setConteudoLivro] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [nomeArquivo, setNomeArquivo] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const tiposArquivosPermitidos = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/pdf",
  ];

  const steps = ["Informações Básicas", "Detalhes do Livro", "Finalização"];

  const handleFecharModal = () => {
    if (tipoLivro) {
      setModalAberto(false);
    } else {
      setError("Por favor, selecione um tipo de livro para continuar");
    }
  };

  const handleSelecionarTipo = (tipo) => {
    setTipoLivro(tipo);
    setModalAberto(false);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validarInformacoesBasicas()) {
      return;
    }
    if (activeStep === 1 && !validarDetalhesLivro()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReabrirModal = () => {
    setModalAberto(true);
  };

  const handleCancel = () => {
    navigate("home/livros/livros-cadastrados");
  };

  const validarInformacoesBasicas = () => {
    const erros = {};

    if (!novoLivro.titulo.trim()) {
      erros.titulo = "O título é obrigatório";
    }

    if (!novoLivro.autor.trim()) {
      erros.autor = "O autor é obrigatório";
    }

    if (!novoLivro.genero) {
      erros.genero = "Selecione um gênero";
    }

    setValidationErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const validarDetalhesLivro = () => {
    const erros = {};

    if (!novoLivro.anoPublicacao) {
      erros.anoPublicacao = "O ano de publicação é obrigatório";
    } else {
      const ano = parseInt(novoLivro.anoPublicacao, 10);
      const anoAtual = new Date().getFullYear();
      if (isNaN(ano) || ano < 0) {
        erros.anoPublicacao = "Ano de publicação deve ser um número positivo";
      } else if (ano > anoAtual + 2) {
        erros.anoPublicacao = `Ano de publicação não pode ser maior que ${
          anoAtual + 2
        }`;
      }
    }

    if (tipoLivro === "fisico") {
      if (!livroFisico.preco.trim()) {
        erros.preco = "O preço é obrigatório para livros físicos";
      } else {
        const precoStr = livroFisico.preco.replace(",", ".");
        const preco = parseFloat(precoStr);
        if (isNaN(preco) || preco < 0) {
          erros.preco = "Preço deve ser um número positivo";
        }
      }
    } else if (tipoLivro === "virtual") {
      const temConteudo =
        conteudoLivro &&
        (conteudoLivro.startsWith("Arquivo binário:") ||
          conteudoLivro.trim() !== "");

      const temArquivoSemConteudo = nomeArquivo && !temConteudo;

      if (!temConteudo && !nomeArquivo) {
        erros.conteudo =
          "É necessário fornecer o conteúdo ou arquivo do livro virtual";
      } else if (temArquivoSemConteudo) {
        erros.conteudo =
          "Houve um problema ao ler o arquivo. Tente novamente ou escolha outro arquivo.";
      }
    }

    setValidationErrors(erros);
    return Object.keys(erros).length === 0;
  };

  const handleInputChange = (field, value) => {
    setNovoLivro({ ...novoLivro, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({
        ...validationErrors,
        [field]: null,
      });
    }
  };

  const handleFileInputChange = (file) => {
    if (!file) return;

    setNomeArquivo(file.name);

    const isTextFile =
      file.type.startsWith("text/") ||
      tiposArquivosPermitidos.includes(file.type) ||
      /\.(txt|doc|docx|pdf|rtf|md|markdown|html|xml|csv|epub|odt|json)$/i.test(
        file.name
      );

    if (!isTextFile) {
      setError(
        "Tipo de arquivo não permitido. Aceitamos arquivos de texto como TXT, DOC, DOCX, PDF, RTF, etc."
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`O arquivo excede o tamanho máximo de 100MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      let conteudo = e.target.result;

      if (conteudo.length > 1000000) {
        conteudo =
          conteudo.substring(0, 1000000) +
          "\n\n[Conteúdo truncado devido ao tamanho do arquivo. O arquivo completo estará disponível após aprovação.]";
      }

      setConteudoLivro(conteudo);
      setError(null);
    };

    if (
      file.type === "application/pdf" ||
      file.type.includes("application/") ||
      /\.(pdf|doc|docx|epub)$/i.test(file.name)
    ) {
      setConteudoLivro(
        `Arquivo binário: ${file.name} (${file.type || "tipo desconhecido"})`
      );
    } else {
      reader.readAsText(file);
    }
  };

  const handleGeneroChange = (e) => {
    setNovoLivro({ ...novoLivro, genero: e.target.value });
    if (validationErrors.genero) {
      setValidationErrors({
        ...validationErrors,
        genero: null,
      });
    }
  };

  const uploadImage = async (file) => {
    const allowedTypes = ["image/png", "image/webp", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Tipo de imagem não permitido. Aceitamos PNG, WEBP, JPG e JPEG."
      );
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("O arquivo excede o tamanho máximo de 20MB.");
      return;
    }
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    const img = new Image();
    img.onload = async () => {
      let { width, height } = img;
      const maxDimension = 1080;
      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError("Erro ao processar a imagem.");
          setLoading(false);
          return;
        }
        try {
          const formData = new FormData();
          formData.append("file", blob, file.name);
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "http://localhost:3030/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const imageUrl = response.data.url;
          setNovoLivro((prev) => ({ ...prev, capa: imageUrl }));
          setError(null);
        } catch (uploadError) {
          console.error("Erro ao fazer upload da imagem:", uploadError);
          setError(
            "Erro ao fazer upload da imagem: " +
              (uploadError.response?.data?.message || uploadError.message)
          );
        } finally {
          setLoading(false);
        }
      }, file.type);
    };
    img.onerror = () => {
      setError("Erro ao carregar a imagem.");
      setLoading(false);
    };
    reader.onloadend = () => {
      img.src = reader.result;
    };
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      uploadImage(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".webp", ".jpeg", ".jpg"] },
    maxSize: 20 * 1024 * 1024,
  });

  const validarFormulario = () => {
    const errosBasicos = !validarInformacoesBasicas();
    if (errosBasicos) {
      setActiveStep(0);
      return false;
    }

    const errosDetalhes = !validarDetalhesLivro();
    if (errosDetalhes) {
      setActiveStep(1);
      return false;
    }

    return true;
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
    setError(null);
  };

  const handleAdicionarLivro = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ano = parseInt(novoLivro.anoPublicacao, 10);

      let livroData = {
        titulo: novoLivro.titulo.trim(),
        autor: novoLivro.autor.trim(),
        editora: novoLivro.editora.trim() || " ",
        genero: novoLivro.genero,
        anoPublicacao: ano,
        descricao: novoLivro.descricao.trim() || " ",
        imagem: novoLivro.capa,
        status: "Em análise",
        preco: 0,
        publicar: 0,
      };

      if (tipoLivro === "fisico") {
        const precoStr = livroFisico.preco.replace(",", ".");
        const preco = parseFloat(precoStr);
        if (!isNaN(preco) && preco >= 0) {
          livroData.preco = preco;
        }
      } else {
        livroData.preco = 0;

        let conteudo = conteudoLivro;
        const isBinaryFile =
          conteudoLivro && conteudoLivro.startsWith("Arquivo binário:");

        if (isBinaryFile) {
          livroData.comentario = `${nomeArquivo}. O conteúdo estará disponível após aprovação.`;
          livroData.descricao = `${livroData.descricao}`;
        } else {
          if (conteudo && conteudo.length > 10000) {
            conteudo =
              conteudo.substring(0, 10000) +
              "\n\n[Conteúdo truncado para envio. O conteúdo completo estará disponível após processamento.]";
          }
          livroData.comentario =
            conteudo || `[Livro virtual] ${nomeArquivo || "Sem conteúdo"}`;
          livroData.descricao = `[LIVRO VIRTUAL] ${livroData.descricao}`;
        }
      }

      const token = localStorage.getItem("token");
      const livrosExistentes = await axios.get("http://localhost:3030/livros", {
        params: { titulo: novoLivro.titulo, autor: novoLivro.autor },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (
        livrosExistentes.data &&
        Array.isArray(livrosExistentes.data.data) &&
        livrosExistentes.data.data.length > 0
      ) {
        throw new Error(
          "Este livro já foi cadastrado com o mesmo título e autor."
        );
      }

      await axios.post("http://localhost:3030/livros", livroData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setNovoLivro({
        titulo: "",
        autor: "",
        editora: "",
        genero: "",
        anoPublicacao: "",
        descricao: "",
        capa: "",
      });
      setLivroFisico({ preco: "" });
      setConteudoLivro("");
      setPreviewImage(null);
      setNomeArquivo("");
      setActiveStep(0);
      setModalAberto(true);
      setTipoLivro("");

      setSuccess(true);
    } catch (error) {
      console.error("Erro ao adicionar livro", error);
      console.error(
        "Detalhes do erro:",
        JSON.stringify(error.response?.data, null, 2)
      );
      let mensagemErro =
        error.response?.data?.message ||
        error.message ||
        "Erro ao adicionar livro. Verifique os campos e tente novamente.";

      if (
        error.response?.status === 413 ||
        (error.message && error.message.includes("payload"))
      ) {
        mensagemErro =
          "Os dados são muito grandes para serem enviados. Tente um arquivo menor ou com menos conteúdo.";
      } else if (error.response?.status === 400) {
        if (error.response?.data?.message === "validation failed") {
          if (
            error.response?.data?.data &&
            error.response?.data?.data.length > 0
          ) {
            const primeiroErro = error.response.data.data[0];
            if (primeiroErro.keyword === "additionalProperties") {
              mensagemErro = `O servidor não aceita o campo '${primeiroErro.params.additionalProperty}'. Este é provavelmente um problema de compatibilidade com a API.`;
            } else if (primeiroErro.keyword === "required") {
              mensagemErro = `Falta o campo obrigatório: ${primeiroErro.params.missingProperty}`;
            } else if (primeiroErro.keyword === "type") {
              mensagemErro = `O campo ${primeiroErro.instancePath.replace(
                "/",
                ""
              )} deve ser do tipo ${primeiroErro.params.type}`;
            } else {
              mensagemErro = `Erro de validação: ${primeiroErro.message} (${primeiroErro.keyword})`;
            }
          } else {
            mensagemErro =
              "Erro de validação ao cadastrar o livro. Verifique se todos os campos estão corretos.";
          }
        } else {
          mensagemErro =
            "Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.";
        }
      }

      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <InformacoesBasicas
            novoLivro={novoLivro}
            handleInputChange={handleInputChange}
            handleGeneroChange={handleGeneroChange}
            validationErrors={validationErrors}
          />
        );
      case 1:
        return (
          <DetalhesLivro
            tipoLivro={tipoLivro}
            novoLivro={novoLivro}
            livroFisico={livroFisico}
            setLivroFisico={setLivroFisico}
            handleInputChange={handleInputChange}
            validationErrors={validationErrors}
            onDrop={onDrop}
            getRootProps={getRootProps}
            getInputProps={getInputProps}
            isDragActive={isDragActive}
            previewImage={previewImage}
            handleFileInputChange={handleFileInputChange}
            nomeArquivo={nomeArquivo}
            maxFileSize={MAX_FILE_SIZE}
          />
        );
      case 2:
        return (
          <Finalizacao
            tipoLivro={tipoLivro}
            novoLivro={novoLivro}
            livroFisico={livroFisico}
            nomeArquivo={nomeArquivo}
            previewImage={previewImage}
          />
        );
      default:
        return "Passo desconhecido";
    }
  };

  return (
    <>
      <TipoLivroModal
        open={modalAberto}
        onClose={handleFecharModal}
        onSelectTipo={handleSelecionarTipo}
      />

      {!modalAberto && (
        <Paper
          elevation={3}
          className="container-cadastro"
          sx={{ py: 3, px: 4 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h4" className="h2" gutterBottom>
              Cadastro de Livro {tipoLivro === "fisico" ? "Físico" : "Virtual"}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleReabrirModal}
              sx={{
                color: "#ccbd9e",
                borderColor: "#ccbd9e",
                "&:hover": {
                  borderColor: "#b5a78a",
                },
              }}
            >
              Alterar Tipo
            </Button>
          </Box>

          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 4,
              mt: 3,
              "& .MuiStepLabel-label": {
                color: "#ccbd9e",
              },
              "& .MuiStepIcon-root": {
                color: "#ccbd9e",
              },
              "& .MuiStepIcon-text": {
                fill: "#333",
              },
              "& .Mui-completed": {
                color: "#ccbd9e !important",
              },
              "& .Mui-active": {
                color: "#ccbd9e !important",
              },
            }}
          >
            {steps.map((label) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          <form onSubmit={handleAdicionarLivro}>
            <Box sx={{ mb: 4 }}>{getStepContent(activeStep)}</Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", pt: 2 }}
            >
              <Button
                color="inherit"
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ mr: 1, color: "#ccbd9e" }}
              >
                Voltar
              </Button>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  color="inherit"
                  onClick={handleCancel}
                  sx={{ color: "#ccbd9e" }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      backgroundColor: "#ccbd9e",
                      color: "#333",
                      "&:hover": {
                        backgroundColor: "#b5a78a",
                      },
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{ mr: 1, color: "#333" }}
                        />
                        Enviando...
                      </>
                    ) : (
                      "Cadastrar Livro"
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    sx={{
                      backgroundColor: "#ccbd9e",
                      color: "#333",
                      "&:hover": {
                        backgroundColor: "#b5a78a",
                      },
                    }}
                  >
                    Próximo
                  </Button>
                )}
              </Box>
            </Box>
          </form>

          <Snackbar
            open={!!error || success}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={error ? "error" : "success"}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {error || "Livro cadastrado com sucesso!"}
            </Alert>
          </Snackbar>
        </Paper>
      )}
    </>
  );
};

export default CadastrarLivro;
