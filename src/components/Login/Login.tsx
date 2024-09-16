import { Box, Button, Container, FormControl, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {

  // Para el login
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("1");

  const navigate = useNavigate();

  // Iniciar sesion
  const IniciarSesion = (event: React.FormEvent) => {
    event.preventDefault();
    if(usuario === "Admin" && password === "12345" && rol === "1"){
      alert(`Bienvenido ${usuario} \nSesión iniciada con exito`);
      navigate("/home");
    } else {
      alert("Credenciales no validas. Por favor intentelo nuevamente.");
    }
  }

  return (
    <Container 
      component="main"
      sx={{ maxWidth: "100vh" }}
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
          width: "440px",
          height: "680px" ,
          border: "1px solid",
          borderRadius: "15px",
          p: "50px 35px"
        }}>

          <Typography
            component="h1"
            sx={{
              textAlign: "center",
              fontSize: "28px",
              fontWeight: "bold",
              mb: 4
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
                  color: "#0AB544",
                }}
              >
                Nombres y apellidos
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
                width: "215px",
                mt: 4,
                mb: 8,
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
              fontSize: "18px",
              fontWeight: "bold",
              color: "#0AB544",
            }}
          >
            Busqueda rápida de puesto
          </Typography>

          <Typography sx={{ color: "#9C9C9C" }}>
            Realiza una busqeda de reporte global de cada puesto
          </Typography>

          <Button
            variant="contained"
            type="submit"
            sx={{
              width: "215px",
              mt: 4,
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