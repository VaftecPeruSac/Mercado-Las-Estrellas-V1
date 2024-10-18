import { Box, Button, Container, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useResponsive from '../../hooks/Responsive/useResponsive';
// import { mostrarAlerta } from '../Alerts/Registrar';
import axios from "axios";
import { manejarError, mostrarAlerta, mostrarAlertaConfirmacion } from "../Alerts/Registrar";
import Cookies from 'js-cookie';

const Login: React.FC = () => {

  // Para el login
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("1");
  const { login } = useAuth();

  // Para redirigir
  const navigate = useNavigate();

  // Variables para el responsive
  const { isLaptop, isTablet, isMobile, isSmallMobile } = useResponsive();

  // const IniciarSesion = (event: React.FormEvent) => {
  //   event.preventDefault();
  //   if (usuario === "Admin" && password === "12345" && rol === "3") {
  //     mostrarAlerta("Inicio de sesión", `Bienvenido ${usuario}.\nSesión iniciada con éxito.`, "success");
  //     // Iniciamos sesión
  //     login();
  //     // Redirigimos a la página de inicio
  //     navigate("/home");
  //   } else {
  //     mostrarAlerta("Error de credenciales", "Credenciales no válidas. Por favor, inténtelo nuevamente.", "error");
  //   }
  // };
  // Iniciar Sesion
  const IniciarSesion = async () => {
    const dataToSend = { usuario, password };  
    try {
      const response = await axios.post('https://mercadolasestrellas.online/intranet/public/v1/login',dataToSend);
      if (response.status === 200) {
        const { token } = response.data;
          Cookies.set('token', token, { path: '/', secure: true, sameSite: 'strict' });
          login(usuario); 
          mostrarAlerta(
          'Inicio   de sesión',
          `Bienvenido ${usuario}.`,
          'success'
        );
        navigate('/home');
      } else {
        mostrarAlerta('Error');
      }
    } catch (error) {
      manejarError(error);
    }
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
          width: isSmallMobile ? "100%" : isMobile ? "280px" : isTablet ? "50%" : isLaptop ? "35%" : "440px",
          height: isLaptop || isSmallMobile ? "90%" : "80%",
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

            {/* Usuario */}
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
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </Box>

            {/* Contraseña */}
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

            {/* Seleccionar rol */}
            <Box>
              <Typography
                sx={{
                  mb: "2px",
                  fontWeight: "bold",
                  fontSize: isSmallMobile || isLaptop ? "14px" : "auto",
                  color: "#0AB544",
                }}
              >
                Rol
              </Typography>
              <FormControl fullWidth required>
                <Select
                  labelId="rol-label"
                  value={rol}
                  inputProps={{ style: { height: "3rem" } }}
                  onChange={(e) => setRol(e.target.value)}
                >
                  <MenuItem value="1">Socio</MenuItem>
                  <MenuItem value="2">Cajero</MenuItem>
                  <MenuItem value="3">Administrador</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Boton iniciar sesión */}
            <Button
              variant="contained"
              // type="submit"
              type="button"
              sx={{
                width: isLaptop || isSmallMobile ? "100%" : "215px",
                mt: isLaptop || isSmallMobile ? 3 : 4,
                mb: isLaptop ? 2 : 0,
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