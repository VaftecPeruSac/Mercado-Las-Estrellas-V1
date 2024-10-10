export const formatDate = (fecha: string): string => {
  const fechaObj = new Date(fecha);
  const dia = fechaObj.getDate();
  const mes = fechaObj.getMonth() + 1;
  const año = fechaObj.getFullYear();

  const diaFormateado = dia.toString().padStart(2, "0");
  const mesFormateado = mes.toString().padStart(2, "0");

  return `${diaFormateado}/${mesFormateado}/${año}`;
};

export const reFormatDate = (fecha: string) => {
  const [dia, mes, anio] = fecha.split("/");
  return `${anio}-${mes}-${dia}`;
};