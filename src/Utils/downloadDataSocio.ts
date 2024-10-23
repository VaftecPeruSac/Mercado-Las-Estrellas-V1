import { Socio } from "../interface/Socios/Socios";
import * as XLSX from 'xlsx';

export const handleAccionesSocio = async (accion: number, telefono: string, socio: Socio) => {

    // Transformar los datos del socio a formato vertical
    const data = [
      ["ID", socio.id_socio],
      ["Nombre", socio.nombre_socio],
      ["Apellido Paterno", socio.apellido_paterno],
      ["Apellido Materno", socio.apellido_materno],
      ["DNI", socio.dni],
      ["Sexo", socio.sexo],
      ["Dirección", socio.direccion],
      ["Teléfono", socio.telefono],
      ["Correo", socio.correo],
      ["Nombre Block", socio.block_nombre],
      ["Número Puesto", socio.numero_puesto],
      ["Giro Negocio", socio.gironegocio_nombre],
      ["Nombre Inquilino", socio.nombre_inquilino],
      ["Estado", socio.estado],
      ["Fecha Registro", socio.fecha_registro],
      ["Deuda", socio.deuda],
    ];

    // Generar el archivo Excel
    const ws = XLSX.utils.aoa_to_sheet(data); // Crea una hoja de trabajo
    const wb = XLSX.utils.book_new(); // Crea un libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, "Socio"); // Agrega la hoja de trabajo al libro

    // Aplicamos estilos a las columnas
    ws['A1'].s = { font: { bold: true } };
    ws['B2'].s = { alignment: { horizontal: 'left' } };
    ws['!cols'] = [{ wch: 18 }, { wch: 30 }];

    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Crear el archivo excel
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);

    // Crear el enlace de descarga
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Socio-${socio.nombre_completo.replaceAll(' ', '-')}.xlsx`);
    document.body.appendChild(link);

    if (accion === 1) {
      link.click();
      link.parentNode?.removeChild(link);
    } else {
      // Enviar mensaje de WhatsApp
      const mensaje = `¡Hola ${socio.nombre_completo}! \n Copia el siguiente enlace en tu navegador para visualizar en formato Excel. \n ${url}`;
      const urlWhatsApp = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
      window.open(urlWhatsApp, '_blank');
    }

  }