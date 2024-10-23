export const getDiaNotificacion = () => {
  const fecha = new Date();
  const ultimoDiaMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate();
  const diaNotificacion = ultimoDiaMes - 10;
  return diaNotificacion;
}

export const notificacionesPredefinidas = [
  "Revise sus deudas pendientes, antes de que acabe el mes.",
  "Recuerde que el pago de la cuota mensual es hasta el día 30 de cada mes.",
  "No olvide que el pago de la cuota mensual es obligatorio.",
  "Pagar las cuotas a tiempo evitara la acumulación de deudas, para pagar las cuotas acerquese a administración.",
]

export const getNotificacionRandom = () => {
  const index = Math.floor(Math.random() * notificacionesPredefinidas.length);
  return notificacionesPredefinidas[index];
}