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

  const salvarBiografia = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:3030/usuario/${id}`,
        { biografia },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditandoBiografia(false);
    } catch (error) {
      console.error("Erro ao salvar biografia:", error);
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

  const togglePerfilPublico = async () => {
    try {
      const id = localStorage.getItem("id");
      const token = localStorage.getItem("token");
    
      const novoPerfil = perfilPublico ? "Privado" : "Publico";
    
      const { data: usuarioAtualizado } = await axios.patch(
        `http://localhost:3030/usuario/${id}`,
        { perfil: novoPerfil },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
      if (usuarioAtualizado && usuarioAtualizado.perfil) {
        setPerfilPublico(usuarioAtualizado.perfil === "Publico");
        localStorage.setItem("perfilPublico", usuarioAtualizado.perfil);
      } else {
        console.error("Erro ao alterar visibilidade do perfil. Resposta inválida:", usuarioAtualizado);
      }
    } catch (error) {
      console.error("Erro ao alterar visibilidade do perfil:", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const pesquisarPerfis = async () => {
    try {
      console.log("Perfil Pesquisado!")
      const token = localStorage.getItem('token');
  
      const response = await axios.get(
        `http://localhost:3030/usuario?apelido=${termoPesquisa}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setPerfisEncontrados(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar perfis:', error);
    }
  };

  return (
    <div className="container-perfil">
      <h1>Perfil do Usuário</h1>

      <label>Nome:
      <span>{usuario?.apelido}</span>
      </label>

      <label>Email:
      <span>{usuario?.email}</span>
      </label>
      
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
              <p>Nome: {perfil.apelido}</p>
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
          <a href="/carrinho/pedidos">
            <img
              src="/carrinho-de-compras.png"
              alt="Ícone do Carrinho"
              width="30"
            />
          </a>
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