import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [loginUsuario, setLoginUsuario] = useState(true);
  const [loading, setLoading] = useState(false);
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

  const toggleForm = () => {
    setLoginUsuario((prevLogin) => !prevLogin);
  };

  return (
    <div className="body">
      <div className="container-login">
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
        >
          <Form
            className={`form ${loginUsuario ? "login-form" : "register-form"}`}
          >
            <div className="form-group">
              <Field
                name="apelido"
                type="text"
                className="form-field"
                placeholder="Nome"
              />
              <ErrorMessage
                component="span"
                name="apelido"
                className="form-error"
              />
            </div>
            <div className="form-group">
              <Field
                name="email"
                type="email"
                className="form-field"
                placeholder="Email"
              />
              <ErrorMessage
                component="span"
                name="email"
                className="form-error"
              />
            </div>
            <div className="form-group">
              <Field
                name="senha"
                type="password"
                className="form-field"
                placeholder="Senha"
              />
              <ErrorMessage
                component="span"
                name="senha"
                className="form-error"
              />
            </div>
            {!loginUsuario && (
              <>
                <div className="form-group">
                  <Field
                    name="confirmation"
                    type="password"
                    className="form-field"
                    placeholder="Confirmação de Senha"
                  />
                  <ErrorMessage
                    component="span"
                    name="confirmation"
                    className="form-error"
                  />
                </div>
                <div className="form-group">
                  <label>Cargo:</label>
                  <Field as="select" name="cargo" className="form-field">
                    <option value="cliente">Cliente</option>
                    <option value="autor">Autor</option>
                    <option value="administrador">Administrador</option>
                  </Field>
                </div>
              </>
            )}
            <button className="button" type="submit" disabled={loading}>
              {loginUsuario ? "Entrar" : "Cadastrar"}
            </button>
          </Form>
        </Formik>

        <button className="button" onClick={toggleForm}>
          {loginUsuario ? "Cadastre-se" : "Logar"}
        </button>
      </div>
    </div>
  );
}

export default Login;
