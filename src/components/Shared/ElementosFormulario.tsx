import { TextField, Typography } from "@mui/material";
import React from "react";

interface SeparadorBloqueProps {
  nombre: string;
}

interface TxtFormularioProps {
  type?: "text" | "date";
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  noMargin?: boolean;
  icono: React.ReactNode;
}

export const AvisoFormulario = () => {
  return (
    <Typography
      sx={{
        mb: 3,
        color: "#333",
        textAlign: "center",
        fontSize: "0.8rem",
      }}
    >
      Recuerde leer detenidamente los campos antes de registrar... (*)
    </Typography>
  );
};

export const SeparadorBloque: React.FC<SeparadorBloqueProps> = ({ nombre }) => {
  return (
    <Typography
      variant="h6"
      sx={{
        mb: 2,
        color: "black",
        fontWeight: "bold",
        fontSize: "0.8rem",
        textAlign: "center",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        "&::before": {
          content: '""',
          flexGrow: 1,
          borderBottom: "1px solid #333",
          marginRight: "8px",
        },
        "&::after": {
          content: '""',
          flexGrow: 1,
          borderBottom: "1px solid #333",
          marginLeft: "8px",
        },
      }}
    >
      {nombre}
    </Typography>
  );
};

export const TxtFormulario: React.FC<TxtFormularioProps> = ({ type, label, name, value, onChange, noMargin, icono }) => {
  return (
    <TextField
      fullWidth
      type={type}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      sx={{ mb: noMargin ? 0 : 2 }}
      InputProps={{
        startAdornment: icono,
      }}
    />
  );
};
