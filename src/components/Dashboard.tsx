import React from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SchoolIcon from "@mui/icons-material/School";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { CardGiftcard, NextWeek, Person, Wysiwyg } from "@mui/icons-material";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const data = [
  { name: 'Enero', uv: 40, pv: 24, amt: 24 },
  { name: 'Febrero', uv: 30, pv: 14, amt: 22 },
  { name: 'Marzo', uv: 20, pv: 48, amt: 22 },
  { name: 'Abril', uv: 28, pv: 39, amt: 20 },
  { name: 'Mayo', uv: 18, pv: 48, amt: 21 },
  { name: 'Junio', uv: 23, pv: 38, amt: 25 },
  { name: 'Julio', uv: 34, pv: 43, amt: 21 },
];

const chartData = [
  { name: 'Deudores', value: 80 },
  { name: 'Pago', value: 20 }
];

const COLORS = ['#82ca9d', '#8884d8'];

interface PieData {
  name: string;
  value: number;
}
const Dashboard: React.FC = () => {
  const [itemData, setItemData] = React.useState<PieData | null>(null);
  const formatTooltipValue = (value: number) => `${value}%`;
  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 5,
        pt: 15, // Espacio adicional en la parte superior para crear un margen con el Header
        backgroundColor: "#f0f0f0",
        minHeight: "100vh",
        display: "-ms-flexbox",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          mb: 3,
          gap: "1rem  ",
          marginLeft: "1rem", // Ajusta el margen izquierdo
          marginRight: "1rem",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#ffffff", // Fondo blanco
            color: "black", // Letra negra
            "&:hover": {
              backgroundColor: "#008001", // Fondo verde al pasar el cursor
              color: "white", // Letra blanca al pasar el cursor
            },
            padding: "1rem",
            borderRadius: "30px",
            width: "400px",
            textAlign: "left",
            position: "relative",
            transition: "all 0.3s ease", // Suaviza la transición de colores
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra para un diseño más elegante
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NextWeek className="icon"
                sx={{
                  fontSize: "35px",
                  marginRight: "20px",
                  borderRadius: "25%", // Borde redondeado
                  padding: "10px", // Espacio alrededor del ícono
                  backgroundColor: "#f0f0f0", // Fondo claro para el ícono
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra para un diseño más elegante
                  color: "green", // Color del ícono
                  transition: "all 0.3s ease", // Suaviza la transición de colores
                }} />
              <Box>
                <Typography variant="h6">Reporte de Pago</Typography>
                <Typography variant="subtitle2" sx={{ fontSize: '12px', color: 'gray' }}>
                  Últimos pagos
                </Typography>
              </Box>
            </Box>
            <ExpandMoreIcon sx={{ fontSize: "24px" }} />
          </Box>

          <Typography variant="h4" sx={{ marginTop: '20px', fontWeight: 'bold' }}>
            S/500
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <TrendingUpIcon sx={{
              fontSize: "20px", color: "bold",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              }
            }} />
            <Typography variant="subtitle2" sx={{
              marginLeft: "5px", color: "bold",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              }
            }}>
              +15.6%
            </Typography>
            <Typography variant="subtitle2" sx={{ marginLeft: "50px", color: 'gray' }}>
              Consolidado por semana
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            color: "black",
            "&:hover": {
              backgroundColor: "#008001",
              color: "white",
            },
            padding: "1rem",
            borderRadius: "30px",
            width: "400px",
            textAlign: "left",
            position: "relative",
            transition: "all 0.3s ease",
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{
                fontSize: "35px",
                marginRight: "20px",
                borderRadius: "25%",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                color: "green",
                transition: "all 0.3s ease",
              }} />
              <Box>
                <Typography variant="h6">Reporte de Deuda</Typography>
                <Typography variant="subtitle2" sx={{ fontSize: '12px', color: 'gray' }}>
                  Ciclo 2012-2024
                </Typography>
              </Box>
            </Box>
            <ExpandMoreIcon sx={{ fontSize: "24px" }} />
          </Box>
          <Typography variant="h4" sx={{ marginTop: '20px', fontWeight: 'bold' }}>
            S/12,302
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <TrendingUpIcon sx={{
              fontSize: "20px", color: "bold",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              }
            }} />
            <Typography variant="subtitle2" sx={{
              marginLeft: "5px", color: "bold",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              }
            }}>
              +15.6%
            </Typography>
            <Typography variant="subtitle2" sx={{ marginLeft: "135px", color: 'gray' }}>
              +1.4k por año
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#ffffff",
            color: "black",
            "&:hover": {
              backgroundColor: "#008001",
              color: "white",
            },
            padding: "1rem",
            borderRadius: "30px",
            width: "400px",
            textAlign: "left",
            position: "relative",
            transition: "all 0.3s ease",
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Wysiwyg sx={{
                fontSize: "35px",
                marginRight: "20px",
                borderRadius: "25%",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                color: "green",
                transition: "all 0.3s ease",
              }} />
              <Box>
                <Typography variant="h6">Lista de Socios</Typography>
                <Typography variant="subtitle2" sx={{ fontSize: '12px', color: 'gray' }}>
                  110 Activos
                </Typography>
              </Box>
            </Box>
            <ExpandMoreIcon sx={{ fontSize: "24px" }} />
          </Box>
          <Typography variant="h4" sx={{ marginTop: '20px', fontWeight: 'bold' }}>
            S/110
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <TrendingUpIcon sx={{
              fontSize: "20px", color: "bold",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              }
            }} />
            <Typography variant="subtitle2" sx={{
              marginLeft: "5px", color: "bold",
              "&:hover": {
                backgroundColor: "green",
                color: "white",
              }
            }}>
              +15.6%
            </Typography>
            <Typography variant="subtitle2" sx={{ marginLeft: "170px", color: 'gray' }}>
              Ver más
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start", // Alinea ambos cards en la parte superior
          flexWrap: "wrap",
          mb: 3,
          gap: "1rem",


        }}
      >
        <Card sx={{
          width: "70%",
          borderRadius: '30px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          position: "relative",
          textAlign: "left",
        }}>
          <CardContent>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', marginLeft: "30px" }}>
                Rendimiento de los pagos
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ width: "350px", borderRadius: '30px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', display: "-ms-inline-flexbox" }}>
          <CardContent>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Reporte pagos
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ value }) => `${value}%`}
                  onClick={(clickedData) => setItemData(clickedData.payload as PieData)}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2 }}>
              <Stack direction="column" sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: COLORS[0],
                      mr: 1,
                    }}
                  />
                  <Typography variant="subtitle2">Deudores</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: COLORS[1],
                      mr: 1,
                    }}
                  />
                  <Typography variant="subtitle2">Pago</Typography>
                </Box>
              </Stack>
            </Box>
            {itemData && (
              <Box sx={{ mt: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                <Typography variant="body2">
                  {`${itemData.value}%`}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Dashboard;
