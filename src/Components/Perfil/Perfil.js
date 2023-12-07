import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [biografia, setBiografia] = useState(
    localStorage.getItem("biografia") || ""
  );
  const [imagemPerfil, setImagemPerfil] = useState(
    localStorage.getItem("imagemPerfil") || ""
  );
  const [editandoBiografia, setEditandoBiografia] = useState(false);
  const [perfilPublico, setPerfilPublico] = useState(
    localStorage.getItem("perfilPublico") === "true"
  );
  const navigate = useNavigate();

  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `http://localhost:3030/usuario/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsuario(data);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
        navigate("/home/perfil");
      }
    };

    carregarUsuario();
  }, [navigate]);

  const salvarBiografia = async () => {
    try {
      // Lógica para salvar a biografia no servidor, se necessário
      localStorage.setItem("biografia", biografia);
      setEditandoBiografia(false);
    } catch (error) {
      console.error("Erro ao salvar biografia:", error);
      // Adicione lógica para lidar com erros
    }
  };

  const atualizarImagemPerfil = async (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("imagemPerfil", file);

        const { data } = await axios.post(
          `http://localhost:3030/usuario/${id}/imagemPerfil`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setImagemPerfil(data.imagemPerfil);
        localStorage.setItem("imagemPerfil", data.imagemPerfil);
      }
    } catch (error) {
      console.error("Erro ao atualizar imagem de perfil:", error);
    }
  };

  const togglePerfilPublico = () => {
    setPerfilPublico((prevState) => !prevState);
    localStorage.setItem("perfilPublico", !perfilPublico);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  if (!usuario) {
    return null;
  }

  return (
    <div className="container-perfil">
      <h1>Perfil do Usuário</h1>

      <label>Nome:</label>
      <span>{usuario.apelido}</span>

      <label>Email:</label>
      <span>{usuario.email}</span>

      <label>Foto de Perfil:</label>
      <label htmlFor="inputFile" className="custom-file-upload">
        <span>Escolher Imagem</span>
        <input
          type="file"
          id="inputFile"
          onChange={atualizarImagemPerfil}
          accept="image/*"
        />
      </label>
      {imagemPerfil && (
        <img src={imagemPerfil} alt="Foto de Perfil" width="70" />
      )}

      <label>Biografia:</label>
      {editandoBiografia ? (
        <>
          <textarea
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
          ></textarea>
          <button onClick={salvarBiografia}>Salvar Biografia</button>
        </>
      ) : (
        <>
          <div>{biografia}</div>
          <button onClick={() => setEditandoBiografia(true)}>
            Editar Biografia
          </button>
        </>
      )}

      <div>
        <label>Perfil {perfilPublico ? "Público" : "Privado"}:</label>
        <button onClick={togglePerfilPublico}>
          {perfilPublico ? "Tornar Privado" : "Tornar Público"}
        </button>
      </div>

      <div className="sidebar">
        <div className="carrinho-section">
          <img
            src="/carrinho-icon.png"
            alt="Ícone do Carrinho"
            width="30"
          />
          <a href="/carrinho/pedidos">Ir para o Carrinho</a>
        </div>
        <div className="user-image-section">
          <img
            src={imagemPerfil}
            alt="Imagem de Perfil do Usuário"
            width="30"
          />
        </div>
      </div>

      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Perfil;