const fsPromises = require('fs/promises');
const path = require('path');
const fs = require('fs');

// постройка странички
async function buildPage() {
  // читаем файлы внутри папки компонентов
  const files = await fsPromises.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });

  // console.log(files);

  const compObject = {}; // пустой объект для записи

  // перебираем файлы из компонентов
  for (const file of files) {
    // прочитываем их
    const readFile = await fsPromises.readFile(
      path.join(__dirname, 'components', file.name),
      {
        encoding: 'utf-8',
      },
    );
    // console.log(readFile);
    // убираем расширение .html
    const components = path.basename(
      path.join(__dirname, 'components', file.name),
      '.html',
    );
    // закидываем в объект компонент как под ключ, а в значение закидываем собранную запись
    compObject[components] = readFile;
    // console.log(components);
  }
  // console.log(compObject);

  // читаем файл шаблона
  let readTemp = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    {
      encoding: 'utf-8',
    },
  );

  // console.log(readTemp);
  // закидываем в содержимое в переменную
  const tempVar = readTemp;
  // теперь преобразуем
  const tempTag = tempVar
    .match(/\{\{[a-zA-Z]{1,}\}\}/g) // отыскали фигурные скобки
    .map((el) => el.replaceAll('{', '').replaceAll('}', '')); // избавились от них
  // console.log(tempTag);

  // перебрали очищенный вариант и заменили его на содержимое компонентов
  for (const tag of tempTag) {
    readTemp = readTemp.replaceAll(`{{${tag}}}`, compObject[tag]);
  }
  // console.log(readTemp);

  // создали папку
  const createFolder = path.join(__dirname, 'project-dist');
  await fsPromises.mkdir(createFolder, {
    recursive: true, // если папки нет — создаст, если уже есть — не тронет
  });

  // создали файл
  const bundleIndexFilePath = path.join(
    __dirname,
    'project-dist',
    'index.html',
  );

  fs.writeFile(
    bundleIndexFilePath,
    readTemp,
    // эта строчка ниже оказалась обязательной (восславься stackoverflow)
    // иначе компилятор завершается ошибкой the 'cb' argument must be of type function. Received undefined
    (err) => err && console.error(err),
  );

  // *******************************************************************************************
  // для сборки записей каждого файла style.css
  let bundleData = '';

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
          'style.css',
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
  // **********************************************************************************************
  // путь до новой папки
  const copyAssetsPath = path.join(__dirname, 'project-dist', 'assets');
  // создаём папку
  await fsPromises.mkdir(copyAssetsPath, {
    recursive: true, // если папки нет — создаст, если уже есть — не тронет
  });

  // путь до новой папки
  const copyFontsPath = path.join(__dirname, 'project-dist', 'assets', 'fonts');
  // создаём папку
  await fsPromises.mkdir(copyFontsPath, {
    recursive: true, // если папки нет — создаст, если уже есть — не тронет
  });
  // теперь по файлам
  const filesFontsPath = path.join(__dirname, 'assets', 'fonts'); // путь к оригинальным файлам
  const getFontsFiles = await fsPromises.readdir(filesFontsPath); // чтение этих файлов

  // перебор каждого файла
  for (const file of getFontsFiles) {
    const source = path.join(filesFontsPath, file); // путь к файлам
    const destination = path.join(copyFontsPath, file); // путь куда этим файлам идти
    await fsPromises.copyFile(source, destination); // скопировать из источника в указанное место
  }

  // путь до новой папки
  const copyImgPath = path.join(__dirname, 'project-dist', 'assets', 'img');
  // создаём папку
  await fsPromises.mkdir(copyImgPath, {
    recursive: true, // если папки нет — создаст, если уже есть — не тронет
  });
  // теперь по файлам
  const filesImgPath = path.join(__dirname, 'assets', 'img'); // путь к оригинальным файлам
  const getImgFiles = await fsPromises.readdir(filesImgPath); // чтение этих файлов

  // перебор каждого файла
  for (const file of getImgFiles) {
    const source = path.join(filesImgPath, file); // путь к файлам
    const destination = path.join(copyImgPath, file); // путь куда этим файлам идти
    await fsPromises.copyFile(source, destination); // скопировать из источника в указанное место
  }

  // путь до новой папки
  const copySvgPath = path.join(__dirname, 'project-dist', 'assets', 'svg');
  // создаём папку
  await fsPromises.mkdir(copySvgPath, {
    recursive: true, // если папки нет — создаст, если уже есть — не тронет
  });
  // теперь по файлам
  const filesSvgPath = path.join(__dirname, 'assets', 'svg'); // путь к оригинальным файлам
  const getSvgFiles = await fsPromises.readdir(filesSvgPath); // чтение этих файлов

  // перебор каждого файла
  for (const file of getSvgFiles) {
    const source = path.join(filesSvgPath, file); // путь к файлам
    const destination = path.join(copySvgPath, file); // путь куда этим файлам идти
    await fsPromises.copyFile(source, destination); // скопировать из источника в указанное место
  }
}
buildPage();
