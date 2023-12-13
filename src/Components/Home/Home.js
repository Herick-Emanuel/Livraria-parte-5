import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';
import CadastrarLivro from "../Livro/Cadastro/CadastrarLivro";
import LivrosCadastrados from "../Livro/Cadastro/LivrosCadastrados";
import Perfil from "../Perfil/Perfil"
import './Home.css'
import Carrinho from '../Carrinho/Carrinho';
import AprovarTexto from '../Livro/AprovarTexto';
import LancamentoDeLivro from '../Livro/LancamentoDeLivro';
import LivrosDetalhes from '../Livro/Elementos/LivrosDetalhes';
import LivrosPublicados from '../Livro/LivrosPublicados';

const Home = ({ feathers }) => {
  return (
    <div className="home-container">
      <Navbar>
        <Navbar.Brand as={Link} to="/home">Logo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>

            <NavDropdown title="Livro" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/home/livros" className='nav-dropdown'>Livros</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/livros/lancamento-livro" className='nav-dropdown'>Lançamentos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/livros/livros-cadastrados" className='nav-dropdown'>Livros Cadastrados</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/livros/cadastrar-livro" className='nav-dropdown'>Cadastrar Livro</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/livros/aprovar-texto" className='nav-dropdown'>Aprovar texto</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Informações" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/home/perfil" className='nav-dropdown'>Perfil</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/comunidade" className='nav-dropdown'>Comunidade</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/chat-publico" className='nav-dropdown'>Chat publico</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/chat-privado" className='nav-dropdown'>Chat privado</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Carrinho" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/home/carrinho/pedidos" className='nav-dropdown'>Pedidos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/carrinho/desejos" className='nav-dropdown'>Lista de desejos</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/home/carrinho/vendas" className='nav-dropdown'>Vendas</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="page-content">
        <Routes>
          <Route path="/home" element={<h2>Home</h2>} />
          <Route path="/livros/*" element={<LivrosPublicados feathers={feathers}/>} />
          <Route path="/livros/cadastrar-livro" element={<CadastrarLivro feathers={feathers} />} />
          <Route path="/livros/livros-cadastrados" element={<LivrosCadastrados feathers={feathers} />} />
          <Route path="/livros/:id/*" element={<LivrosDetalhes feathers={feathers}/>} />
          <Route path="/livros/aprovar-texto" element={<AprovarTexto feathers={feathers}/>}/>
          <Route path="/livros/lancamento-livro" element={<LancamentoDeLivro feathers={feathers}/>}/>
          <Route path="/perfil" element={<Perfil feathers={feathers} />} />
          <Route path="/carrinho/*" element={<Carrinho feathers={feathers} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;