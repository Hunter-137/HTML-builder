const fsPromises = require('fs/promises'); // модуль fs/promises
const path = require('path'); // модуль path
const fs = require('fs'); // модуль fs

let bundleData = ''; // ящик для записи стилей

// ручной компилятор (:D)
async function compiler() {
  const stylesFolderPath = path.join(__dirname, 'styles'); // путь до папки со стилями
  // читаем файлы из папки со стилями, переводим всё найденное в Dirent
  const stylesDirent = await fsPromises.readdir(stylesFolderPath, {
    withFileTypes: true,
  });

  // перебор каждого файла из Dirent
  for (const stylesFile of stylesDirent) {
    const stylesFileName = stylesFile.name; // имя файла
    const stylesFileExtname = path.extname(stylesFileName); // расширение файла

    // если расширение равно .css, то...
    if (stylesFileExtname === '.css') {
      const stylesFilePath = path.join(stylesFolderPath, stylesFileName); // путь до файла
      const readableStream = fs.createReadStream(stylesFilePath, 'utf-8'); // его чтение
      // собираем записи в ящик
      readableStream.on('data', (data) => {
        bundleData += data;
      });

      // когда сбор записей закончится
      readableStream.on('end', () => {
        // находим путь до bundle.css (если его нет, значит создастся)
        const bundleFilePath = path.join(
          __dirname,
          'project-dist',
          'bundle.css',
        );
        // и вписываем в него всё что собрали в ящик
        fs.writeFile(
          bundleFilePath,
          bundleData,
          // эта строчка ниже оказалась обязательной (восславься stackoverflow)
          // иначе компилятор завершается ошибкой the 'cb' argument must be of type function. Received undefined
          (err) => err && console.error(err),
        );
      });
    }
  }
}
compiler(); // запуск асинхронной функции
