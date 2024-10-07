const fs = require('fs');

const filePath = 'C:\\Users\\Iann\\Downloads\\Logo.jpg'; // Reemplaza con el nombre de tu imagen
const image = fs.readFileSync(filePath);
const base64Image = Buffer.from(image).toString('base64');
console.log(`data:image/jpeg;base64,${base64Image}`);