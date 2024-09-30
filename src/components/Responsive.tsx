import { useMediaQuery, useTheme } from "@mui/material";

// Hook para diseño responsivo
const useResponsive = () => {

  // Obtenemos el tema actual
  const theme = useTheme();

  // Verificamos si el ancho de la pantalla es mayor a 600px y menor a 1023px
  const isTablet = useMediaQuery("(min-width: 600px) and (max-width: 1023px)");
  // Verificamos si el ancho de la pantalla es menor a 600px y mayor a 700px
  const isSmallTablet = useMediaQuery("(min-width: 600px) and (max-width: 700px)");
  // Verificamos si el ancho de la pantalla es menor a 600px
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Verificamos si el ancho de la pantalla es menor a 375px
  const isSmallMobile = useMediaQuery("(max-width: 375px)");

  // Retornamos los valores
  return { isTablet, isSmallTablet, isMobile, isSmallMobile };

}

export default useResponsive;