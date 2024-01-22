const fsPromises = require('fs/promises'); // модуль fsPromises
const path = require('path'); // модуль path

// асинхронная функция для копирования
async function copy() {
  // путь до новой папки
  const copyFolderPath = path.join(__dirname, 'files-copy');
  // создаём папку
  await fsPromises.mkdir(copyFolderPath, {
    recursive: true, // если папки нет — создаст, если уже есть — не тронет
  });

  // теперь по файлам
  const filesFolderPath = path.join(__dirname, 'files'); // путь к оригинальным файлам
  const getFiles = await fsPromises.readdir(filesFolderPath); // чтение этих файлов

  // перебор каждого файла
  for (const file of getFiles) {
    const source = path.join(filesFolderPath, file); // путь к файлам
    const destination = path.join(copyFolderPath, file); // путь куда этим файлам идти
    await fsPromises.copyFile(source, destination); // скопировать из источника в указанное место
  }
}
copy();
