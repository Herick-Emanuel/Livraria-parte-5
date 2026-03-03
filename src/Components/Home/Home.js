import React, { useState } from "react";
import { Link, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import CadastrarLivro from "../Livro/Cadastro/CadastrarLivro";
import LivrosCadastrados from "../Livro/Cadastro/LivrosCadastrados";
import Perfil from "../Perfil/Perfil";
import PerfilBuscado from "../Perfil/PerfilBuscado";
import Carrinho from "../Carrinho/Carrinho";
import LancamentoDeLivro from "../Livro/Publicados/LancamentoDeLivro";
import LivrosDetalhes from "../Livro/Elementos/LivrosDetalhes";
import LivrosPublicados from "../Livro/Publicados/LivrosPublicados";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ChatIcon from "@mui/icons-material/Chat";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import { theme } from "../../theme";
import "./Home.css";

const Home = ({ feathers }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    livro: true,
    info: false,
    carrinho: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: <HomeIcon />,
      path: "/home",
      children: null,
    },
    {
      id: "livro",
      label: "Livro",
      icon: <BookIcon />,
      children: [
        { label: "📚 Livros", path: "/home/livros", icon: <BookIcon /> },
        { label: "✨ Lançamentos", path: "/home/livros/lancamento-livro", icon: <NewReleasesIcon /> },
        { label: "📋 Livros Cadastrados", path: "/home/livros/livros-cadastrados", icon: <LocalOfferIcon /> },
        { label: "➕ Cadastrar Livro", path: "/home/livros/cadastrar-livro", icon: <AddIcon /> },
      ],
    },
    {
      id: "info",
      label: "Informações",
      icon: <PersonIcon />,
      children: [
        { label: "👤 Perfil", path: "/home/perfil", icon: <PersonIcon /> },
        { label: "👥 Comunidade", path: "/home/comunidade", icon: <GroupIcon /> },
        { label: "💬 Chat público", path: "/home/chat-publico", icon: <ChatIcon /> },
        { label: "💌 Chat privado", path: "/home/chat-privado", icon: <ChatIcon /> },
      ],
    },
    {
      id: "carrinho",
      label: "Carrinho",
      icon: <ShoppingCartIcon />,
      children: [
        { label: "📦 Pedidos", path: "/home/carrinho/pedidos", icon: <ShoppingCartIcon /> },
        { label: "❤️ Lista de Desejos", path: "/home/carrinho/desejos", icon: <FavoriteBorderIcon /> },
        { label: "💰 Vendas", path: "/home/carrinho/vendas", icon: <LocalOfferIcon /> },
      ],
    },
  ];

  const SidebarContent = () => (
    <div className="sidebar-content">
      <div className="sidebar-branding">
        {sidebarOpen && <span className="sidebar-title">Livraria</span>}
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Retrair" : "Expandir"}
        >
          {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.children ? (
              <div>
                <button
                  className={`sidebar-item ${expandedSections[item.id] ? "expanded" : ""}`}
                  onClick={() => toggleSection(item.id)}
                >
                  <div className="sidebar-item-icon">{item.icon}</div>
                  {sidebarOpen && (
                    <>
                      <span className="sidebar-item-label">{item.label}</span>
                      <span className="sidebar-item-toggle">
                        {expandedSections[item.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </span>
                    </>
                  )}
                </button>
                {expandedSections[item.id] && sidebarOpen && (
                  <div className="sidebar-submenu">
                    {item.children.map((child) => (
                      <button
                        key={child.path}
                        className={`sidebar-subitem ${isActive(child.path) ? "active" : ""}`}
                        onClick={() => handleNavigation(child.path)}
                      >
                        <div className="sidebar-subitem-icon">{child.icon}</div>
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="sidebar-item-icon">{item.icon}</div>
                {sidebarOpen && <span className="sidebar-item-label">{item.label}</span>}
              </button>
            )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="home-container">
        {/* Topbar - Apenas Logo */}
        <div className="topbar">
          <div className="topbar-brand">📚 Livraria</div>
        </div>

        <div className="home-wrapper">
          {/* Sidebar Desktop */}
          <aside className={`sidebar ${sidebarOpen ? "expanded" : "collapsed"}`}>
            <SidebarContent />
          </aside>

          {/* Sidebar Mobile (Drawer) */}
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            className="mobile-drawer"
            PaperProps={{
              sx: {
                width: 280,
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(10px)",
              },
            }}
          >
            <SidebarContent />
          </Drawer>

          {/* Main Content */}
          <main className={`main-content ${!sidebarOpen ? "full-width" : ""}`}>
            <Routes>
              <Route path="/home" element={<h2>Home</h2>} />
              <Route
                path="/livros/*"
                element={<LivrosPublicados feathers={feathers} />}
              />
              <Route
                path="/livros/cadastrar-livro"
                element={<CadastrarLivro feathers={feathers} />}
              />
              <Route
                path="/livros/livros-cadastrados"
                element={<LivrosCadastrados feathers={feathers} />}
              />
              <Route
                path="/livros/:id/*"
                element={<LivrosDetalhes feathers={feathers} />}
              />
              <Route
                path="/livros/lancamento-livro"
                element={<LancamentoDeLivro feathers={feathers} />}
              />
              <Route path="/perfil" element={<Perfil feathers={feathers} />} />
              <Route path="/perfil/:id" element={<PerfilBuscado />} />
              <Route
                path="/carrinho/*"
                element={<Carrinho feathers={feathers} />}
              />
            </Routes>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Home;
