import { useMediaQuery, useTheme } from "@mui/material";

// Hook para diseño responsivo
const useResponsive = () => {

  // Obtenemos el tema actual
  const theme = useTheme();
  // Verificamos si el ancho de la pantalla es menor a 600px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Verificamos si el ancho de la pantalla es menor a 375px
  const isSmallMobile = useMediaQuery("(max-width: 375px)");

  // Retornamos los valores
  return { isMobile, isSmallMobile };

}

export default useResponsive;