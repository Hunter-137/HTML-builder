const fs = require('fs'); // файловая система
const path = require('path'); // пути
const { stdin } = process; // процесс на входной поток

let text = ''; // "ящик" для скопления всего из консоли

// всё что входит в консоль попадает в "ящик"
stdin.on('data', (data) => {
  text += data.toString();
});

// событие SIGINT реагирует на Ctrl+C
process.on('SIGINT', () => {
  // создаем файл в нашей директории, вписываем в него всё что попало в "ящик"
  fs.writeFile(path.join(__dirname, '02-write-file.txt'), text, (err) => {
    if (err) throw err;
    console.log('Текст сохранён в новом файле 02-write-file.txt');

    // завершаем программу
    process.exit();
  });
});

console.log('Введите текст:');
