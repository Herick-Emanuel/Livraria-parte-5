/*
  Componente Perfil:
  - Responsável por exibir e gerenciar o perfil do usuário.
  - Utiliza React, axios para requisições HTTP, e react-router-dom para navegação.
*/
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
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [perfisEncontrados, setPerfisEncontrados] = useState([]);
  const [idUsuarioLogado, setIdUsuarioLogado] = useState(
    localStorage.getItem("id") || null
  );
  const navigate = useNavigate();

  // Efeito colateral para carregar o usuário ao montar o componente
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
        setIdUsuarioLogado(id);
      } catch (error) {
        console.error("Erro ao obter usuário:", error);
        navigate("/home/perfil");
      }
    };

    carregarUsuario();
  }, [navigate]);

  // Função para salvar a biografia do usuário
  const salvarBiografia = async () => {
    try {
      localStorage.setItem("biografia", biografia);
      setEditandoBiografia(false);
    } catch (error) {
      console.error("Erro ao salvar biografia:", error);
    }
  };

  // Função para atualizar a imagem de perfil do usuário
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

  // Função para alternar a visibilidade do perfil público
  const togglePerfilPublico = () => {
    setPerfilPublico((prevState) => !prevState);
    localStorage.setItem("perfilPublico", !perfilPublico);
  };

  // Função para realizar o logout do usuário
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Função para pesquisar perfis de outros usuários
  const pesquisarPerfis = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:3030/usuario/pesquisar?termo=${termoPesquisa}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPerfisEncontrados(response.data);
    } catch (error) {
      console.error("Erro ao pesquisar perfis:", error);
    }
  };

  return (
    <div className="container-perfil">
      <h1>Perfil do Usuário</h1>

      <label>Nome:</label>
      <span>{usuario?.apelido}</span>

      <label>Email:</label>
      <span>{usuario?.email}</span>

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

      <div>
        <label>Pesquisar Perfis:</label>
        <input
          type="text"
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
        />
        <button onClick={pesquisarPerfis}>Pesquisar</button>
      </div>

      {perfisEncontrados.length > 0 && (
        <ul>
          {perfisEncontrados.map((perfil) => (
            <li key={perfil.id}>
              <p>Nome: {perfil.nome}</p>
              <p>Email: {perfil.email}</p>
              {perfil.id !== idUsuarioLogado && (
                <>
                  <p>Livros Publicados: {perfil.livrosPublicados}</p>
                  <p>Textos Publicados: {perfil.textosPublicados}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="sidebar">
        <div className="carrinho-section">
          <img src="/carrinho-icon.png" alt="Ícone do Carrinho" width="30" />
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