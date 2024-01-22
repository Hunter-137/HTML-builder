const fsPromises = require('fs/promises'); // модуль fsPromises
const path = require('path'); // модуль path

async function getStats() {
  try {
    // прочитываем всю папку
    const dirent = await fsPromises.readdir(
      path.join(__dirname, 'secret-folder'),
      { withFileTypes: true }, // переводим в Dirent
    );

    // Dirent — это своеобразная структура данных о папке
    // внутри неё содержится имена файлов и папок, расширения, размеры,
    // права доступа, дата и время изменения...

    // цикл на перебор всего внутри папки (внутри Dirent)
    for (const file of dirent) {
      // вытаскиваем только сами файлы (без внутренних папок)
      if (file.isFile()) {
        const fileName = file.name; // имя файла
        const fileExtname = path.extname(fileName); // расширение файла

        // вытаскиваем размер файла
        const stats = await fsPromises.stat(
          path.join(__dirname, 'secret-folder', fileName),
        );

        // структурируем как было сказано в таске
        console.log(`${fileName} - ${fileExtname} - ${stats.size}`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

getStats();
