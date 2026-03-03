import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [loginUsuario, setLoginUsuario] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (loginUsuario) {
        await handleLogin(values);
      } else {
        await handleRegister(values);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro: ${error.message || "Ocorreu um erro inesperado"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ apelido, email, senha, cargo }) => {
    try {
      setLoading(true);

      await axios.post("http://localhost:3030/usuario", {
        apelido,
        email,
        password: senha,
        cargo,
      });

      alert("Usuário cadastrado com sucesso! Faça o login para continuar.");
      setLoginUsuario(true);
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar usuário. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async ({ email, senha }) => {
    try {
      setLoading(true);

      const response = await axios.post("http://localhost:3030/authentication", {
        strategy: "local",
        email,
        password: senha,
      });

      if (response.data.accessToken) {
        const { user } = response.data;

        localStorage.setItem("token", response.data.accessToken);
        localStorage.setItem("id", user.id);
        localStorage.setItem("apelido", user.apelido);
        localStorage.setItem("cargo", user.cargo);

        navigate(`/home`);
        
        alert(`Bem-vindo, ${user.apelido}!`);
      } else {
        alert("Senha incorreta ou usuário não registrado");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao realizar o login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  const validationsLogin = yup.object().shape({
    email: yup
      .string()
      .email("Email inválido")
      .required("O email é obrigatório"),
    senha: yup
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .required("A senha é obrigatória"),
  });

  const validationsRegister = yup.object().shape({
    apelido: yup.string().required("O apelido é obrigatório"),
    email: yup
      .string()
      .email("Email inválido")
      .required("O email é obrigatório"),
    senha: yup
      .string()
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .required("A senha é obrigatória"),
    confirmation: yup
      .string()
      .oneOf([yup.ref("senha"), null], "As senhas são diferentes")
      .required("A confirmação da senha é obrigatória"),
    cargo: yup.string().required("O cargo é obrigatório"),
  });

  return (
    <div className="body">
      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="container-login">
        <div className="login-header">
          <h1 className="login-title">📚 Livraria</h1>
          <p className="login-subtitle">
            {loginUsuario
              ? "Bem-vindo de volta!"
              : "Crie sua conta gratuitamente"}
          </p>
        </div>

        <div className="form-toggle">
          <button
            className={`toggle-button ${loginUsuario ? "active" : ""}`}
            onClick={() => setLoginUsuario(true)}
            type="button"
          >
            Login
          </button>
          <button
            className={`toggle-button ${!loginUsuario ? "active" : ""}`}
            onClick={() => setLoginUsuario(false)}
            type="button"
          >
            Cadastro
          </button>
        </div>

        <Formik
          initialValues={{
            apelido: "",
            email: "",
            senha: "",
            confirmation: "",
            cargo: "cliente",
          }}
          onSubmit={handleSubmit}
          validationSchema={
            loginUsuario ? validationsLogin : validationsRegister
          }
          enableReinitialize
        >
          {({ values }) => (
            <Form className="form">
              <div className={`form-content ${loginUsuario ? "login-mode" : "register-mode"}`}>
                {!loginUsuario ? (
                  <>
                    {/* Linha 1: Nome e Email lado a lado */}
                    <div className="form-row fade-in">
                      <div className="form-group">
                        <label htmlFor="apelido" className="form-label">
                          <span className="label-icon">👤</span>
                          Nome de Usuário
                        </label>
                        <Field
                          id="apelido"
                          name="apelido"
                          type="text"
                          className="form-field"
                          placeholder="Digite seu nome"
                        />
                        <ErrorMessage
                          component="span"
                          name="apelido"
                          className="form-error"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          <span className="label-icon">✉️</span>
                          Email
                        </label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className="form-field"
                          placeholder="seu@email.com"
                        />
                        <ErrorMessage
                          component="span"
                          name="email"
                          className="form-error"
                        />
                      </div>
                    </div>

                    {/* Linha 2: Senha e Confirmar Senha lado a lado */}
                    <div className="form-row fade-in">
                      <div className="form-group">
                        <label htmlFor="senha" className="form-label">
                          <span className="label-icon">🔒</span>
                          Senha
                        </label>
                        <div className="password-input-wrapper">
                          <Field
                            id="senha"
                            name="senha"
                            type={showPassword ? "text" : "password"}
                            className="form-field"
                            placeholder="Digite sua senha"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex="-1"
                          >
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                        <ErrorMessage
                          component="span"
                          name="senha"
                          className="form-error"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmation" className="form-label">
                          <span className="label-icon">🔐</span>
                          Confirmar Senha
                        </label>
                        <div className="password-input-wrapper">
                          <Field
                            id="confirmation"
                            name="confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            className="form-field"
                            placeholder="Confirme sua senha"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            tabIndex="-1"
                          >
                            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                          </button>
                        </div>
                        <ErrorMessage
                          component="span"
                          name="confirmation"
                          className="form-error"
                        />
                      </div>
                    </div>

                    {/* Tipo de Conta (largura completa) */}
                    <div className="form-group fade-in">
                      <label htmlFor="cargo" className="form-label">
                        <span className="label-icon">💼</span>
                        Tipo de Conta
                      </label>
                      <Field as="select" id="cargo" name="cargo" className="form-field">
                        <option value="cliente">🛒 Cliente</option>
                        <option value="autor">✍️ Autor</option>
                        <option value="administrador">⚙️ Administrador</option>
                      </Field>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Modo Login: campos em coluna única */}
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        <span className="label-icon">✉️</span>
                        Email
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        className="form-field"
                        placeholder="seu@email.com"
                      />
                      <ErrorMessage
                        component="span"
                        name="email"
                        className="form-error"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="senha" className="form-label">
                        <span className="label-icon">🔒</span>
                        Senha
                      </label>
                      <div className="password-input-wrapper">
                        <Field
                          id="senha"
                          name="senha"
                          type={showPassword ? "text" : "password"}
                          className="form-field"
                          placeholder="Digite sua senha"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex="-1"
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                      <ErrorMessage
                        component="span"
                        name="senha"
                        className="form-error"
                      />
                    </div>
                  </>
                )}

                <button
                  className={`button-submit ${loading ? "loading" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner"></span>
                  ) : loginUsuario ? (
                    <>
                      <span>Entrar</span>
                      <span className="button-icon">→</span>
                    </>
                  ) : (
                    <>
                      <span>Criar Conta</span>
                      <span className="button-icon">✓</span>
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="login-footer">
          <p className="footer-text">
            {loginUsuario ? "Ainda não tem uma conta?" : "Já possui uma conta?"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
