const fs = require('fs'); // запрос на файловую систему
const path = require('path'); // запрос на пути

const filePath = path.join(__dirname, 'text.txt'); // создание файла в нашей папке

const readableStream = fs.createReadStream(filePath, 'utf-8'); // чтение файла
readableStream.on('data', (chunk) => console.log(chunk)); // вывод в консоль то что прочитали
