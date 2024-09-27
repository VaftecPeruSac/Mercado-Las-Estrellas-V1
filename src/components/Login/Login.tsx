import { Box, Button, Container, FormControl, MenuItem, Select, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useResponsive from '../Responsive';

const Login: React.FC = () => {

  // Para el login
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("1");
  const { login } = useAuth();

  // Para redirigir
  const navigate = useNavigate();
  
  // Variables para el responsive
  const { isMobile, isSmallMobile } = useResponsive();

  // Iniciar sesion
  const IniciarSesion = (event: React.FormEvent) => {
    event.preventDefault();
    if(usuario === "Admin" && password === "12345" && rol === "3"){
      alert(`Bienvenido ${usuario} \nSesión iniciada con exito`);
      // Iniciamos sesión
      login();
      // Redirigimos a la pagina de inicio
      navigate("/home");
    } else {
      alert("Credenciales no validas. Por favor intentelo nuevamente.");
    }
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
          boxSizing: isSmallMobile ? "border-box" : "content-box",
          width: isSmallMobile ? "100%" : isMobile ? "280px" : "440px",
          height: isSmallMobile ? "620px" : "680px",
          border: "1px solid",
          borderRadius: "15px",
          p: isSmallMobile ? "10px 30px" : "50px 35px"
        }}>

          <Typography
            component="h1"
            sx={{
              textAlign: "center",
              fontSize: isSmallMobile ? "22px" : isMobile ? "24px" : "28px",
              fontWeight: "bold",
              mb: isSmallMobile ? 2 : 4
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
                  fontSize: isSmallMobile ? "14px" : "auto",
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
                InputLabelProps={{
                  style: { color: "#0AB544" }
                }}
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
                  fontSize: isSmallMobile ? "14px" : "auto",
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
                InputLabelProps={{
                  style: { color: "#0AB544" }
                }}
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
                  fontSize: isSmallMobile ? "14px" : "auto",
                  color: "#0AB544",
                }}
              >
                Rol
              </Typography>
              <FormControl fullWidth required>
                <Select
                  labelId="rol-label"
                  value={rol}
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
              type="submit"
              sx={{
                width: isSmallMobile ? "100%" : "215px",
                mt: isSmallMobile ? 3 : 4,
                mb: isSmallMobile ? 4 : 8,
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

          <Typography
            sx={{ 
              mb: "2px",
              fontSize: isSmallMobile ? "16px" : "18px",
              fontWeight: "bold",
              color: "#0AB544",
            }}
          >
            Busqueda rápida de puesto
          </Typography>

          <Typography sx={{ color: "#9C9C9C", fontSize: isSmallMobile ? "12px" : "auto" }}>
            Realiza una busqeda de reporte global de cada puesto
          </Typography>

          <Button
            variant="contained"
            type="submit"
            sx={{
              width: isSmallMobile ? "100%" : "215px",
              mt: isSmallMobile ? 2 : 4,
              p: "10px 50px",
              textTransform: "inherit",
              fontSize: "16px",
              fontWeight: "500",
              color: "#0AB544",
              bgcolor: "#FFF",
              border: "1px solid #0AB544",
              "&:hover": { bgcolor: "#0AB544", color: "#FFF" }
            }}
            // onClick={}
          >
            Buscar puesto
          </Button>

        </Box>

      </Box>

    </Container>  
  )
}

export default Login;