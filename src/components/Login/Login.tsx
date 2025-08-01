import { Box, Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useResponsive from '../../hooks/Responsive/useResponsive';
import { manejarError, mostrarAlerta } from "../Alerts/Registrar";
import Cookies from 'js-cookie';
import apiClient from "../../Utils/apliClient";

const Login: React.FC = () => {

  const [nomUsuario, setNomUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, usuario } = useAuth();
  const navigate = useNavigate();

  const { isLaptop, isTablet, isMobile, isSmallMobile } = useResponsive();

  const IniciarSesion = async () => {
    const dataToSend = { usuario: nomUsuario, password };
    apiClient.post("/login", dataToSend)
      .then((response) => {
        const { token } = response.data;
        Cookies.set('token', token, { path: '/', secure: true, sameSite: 'strict' });

        localStorage.setItem("autenticado", JSON.stringify(true));
        // if (!usuario) {
        //   window.location.replace('/home');
        // } else {
        //   login(usuario);
        //   window.location.replace('/home');
        //   mostrarAlerta('Inicio de sesión', `Bienvenido ${nomUsuario}.`, 'success');
        // }
        // mostrarAlerta('Inicio de sesión', `Bienvenido ${nomUsuario}.`, 'success');
        window.location.replace('/home');
        // navigate("/home");
        // window.location.href = "/home";
      })
      .catch((error) => {
        manejarError(error.response.data);
      });
  };

  const busquedaRapida = () => {
    navigate("/busqueda-rapida");
  }

  return (
    <Container
      component="main"
      sx={{ maxWidth: "100vw", maxHeight: "100vh" }}
    >
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <Box sx={{
          boxSizing: isSmallMobile || isLaptop ? "border-box" : "content-box",
          width: isSmallMobile ? "100%" : isMobile ? "280px" : isTablet ? "50%" : isLaptop ? "35%" : "400px",
          height: "auto",
          maxHeight: "680px",
          border: "1px solid",
          borderRadius: "15px",
          p: isSmallMobile ? "30px" : isLaptop ? "30px 35px" : "50px 35px",
          display: "flex",
          flexDirection: "column",
        }}>

          <Typography
            component="h1"
            sx={{
              textAlign: "center",
              fontSize: isSmallMobile ? "20px" : isLaptop ? "22px" : isMobile ? "24px" : "28px",
              fontWeight: "bold",
              mb: isSmallMobile || isLaptop ? 2 : 4
            }}
          >
            Ingresar SYSTEM MERCADO
          </Typography>

          <Box component="form">

            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  mb: "2px",
                  fontWeight: "bold",
                  fontSize: isSmallMobile || isLaptop ? "14px" : "auto",
                  color: "#0AB544",
                }}
              >
                Nombre de usuario
              </Typography>
              <TextField
                fullWidth
                required
                id="usuario"
                name="usuario"
                placeholder="Ingrese su nombre completo"
                InputProps={{ style: { height: "3rem" } }}
                InputLabelProps={{ style: { color: "#0AB544" } }}
                value={nomUsuario}
                onChange={(e) => setNomUsuario(e.target.value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography
                sx={{
                  mb: "2px",
                  fontWeight: "bold",
                  fontSize: isSmallMobile || isLaptop ? "14px" : "auto",
                  color: "#0AB544",
                }}
              >
                Contraseña
              </Typography>
              <TextField
                fullWidth
                required
                type="password"
                id="password"
                name="password"
                placeholder="Ingrese su contraseña"
                InputProps={{ style: { height: "3rem" } }}
                InputLabelProps={{ style: { color: "#0AB544" } }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>

            <Button
              variant="contained"
              type="button"
              sx={{
                width: isLaptop || isSmallMobile ? "100%" : "215px",
                mt:1,
                mb: 3,
                p: "10px 50px",
                textTransform: "inherit",
                fontSize: "16px",
                fontWeight: "500",
                color: "white",
                bgcolor: "#0AB544",
                "&:hover": { bgcolor: "#388E3C" }
              }}
              onClick={IniciarSesion}
            >
              Iniciar sesión
            </Button>

          </Box>

          <Box sx={{ mt: "auto" }}>

            <Typography
              sx={{
                mt: 3,
                mb: "2px",
                fontSize: isLaptop || isSmallMobile ? "16px" : "18px",
                fontWeight: "bold",
                color: "#0AB544",
              }}
            >
              Busqueda rápida de puesto
            </Typography>

            <Typography sx={{ color: "#9C9C9C", fontSize: isSmallMobile ? "12px" : isLaptop ? "14px" : "auto" }}>
              Realiza una busqueda de reporte global de cada puesto
            </Typography>

            <Button
              variant="contained"
              type="submit"
              sx={{
                width: isLaptop || isSmallMobile ? "100%" : "215px",
                mt: isLaptop || isSmallMobile ? 2 : 4,
                p: "10px 50px",
                textTransform: "inherit",
                fontSize: "16px",
                fontWeight: "500",
                color: "#0AB544",
                bgcolor: "#FFF",
                border: "1px solid #0AB544",
                "&:hover": { bgcolor: "#0AB544", color: "#FFF" }
              }}
            onClick={busquedaRapida}
            >
              Buscar puesto
            </Button>

          </Box>

        </Box>

      </Box>

    </Container>
  )
}

export default Login;