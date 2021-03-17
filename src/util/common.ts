import { GenLoremSpec } from "../types";
const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const random_words = require("random-words");
const fs = require("fs");
const path = require("path");
const jsConvert = require("js-convert-case");

export const randomTitle = (wordCount: number) => {
  const words = random_words(wordCount);
  const rtrn = words.join(" ");
  return rtrn;
};

export const randomPhotoPath = (dir: string) => {
  const filePath = path.join(__dirname, `../../../unsplashed/${dir}`);
  console.log("ROOT", filePath);
  if (!fs.existsSync(filePath)) {
    throw `FILE PATH ${filePath} DOES NOT EXIST, you furnished ${dir} and the 'unplashed' location was assumed as a pre-req`;
  }
  const files = fs.readdirSync(filePath);
  const randomNumber = Math.floor(Math.random() * files.length);
  const fileName = files[randomNumber];
  const resultPath = path.join(filePath, fileName);
  return resultPath;
};

export const copyRandomFile = (dir: string) => {
  const sourcePath = randomPhotoPath(dir);
  const fileName = path.basename(sourcePath);
  const result = { fileName, sourcePath };
  console.log("COPIED ALL", result.sourcePath, result.fileName);
  return result;
};

export const seedPhotoStock = (genTeaserSpec) => {
  if (!fs.existsSync(path.normalize(genTeaserSpec.targetDir))) {
    throw `FILE PATH ${path.normalize(
      genTeaserSpec.targetDir
    )} DOES NOT EXIST, you furnished ${genTeaserSpec.targetDir}`;
  }
  const writePath = `${path.normalize(
    genTeaserSpec.targetDir
  )}/docs/_assets/_static/images`;
  fs.mkdir(writePath, { recursive: true }, (err) => {
    if (err) {
      throw `FAILED ${writePath}${err}`;
    }
  });
  const dir = "raw_landscape";
  const photoObject = copyRandomFile(dir);
  const fileWritePath = path.join(writePath, photoObject.fileName);
  fs.readFile(photoObject.sourcePath, function (err, data) {
    if (err) throw err;
    fs.writeFile(fileWritePath, data, function (err) {
        if (err) throw err;
    });
  });
  const img = `<img class="bordered" src="/_merged_assets/_static/images/${photoObject.fileName}" alt="${photoObject.fileName}" />`
  return img;
}

export const randomLoremTitle = (maxWordCount: number) => {
  const count = randomNumberFromMaxSkewedUp(maxWordCount);
  const lorem = new LoremIpsum();
  let title = lorem.generateWords(count);
  while (title.length < 5) {
    title = lorem.generateWords(count);
  }
  return title;
};

export const randomNumberFromMaxSkewedUp = (max: number) => {
  const min = max / 2 - 1;
  let result = randomFromRangeSkewedUp(max, min);
  if (result === 0) {
    result = 2;
  }
  return result;
};

export const randomParagraphs = (max: number, hasSections: boolean): string => {
  const count = randomFromRangeSkewedUp(1, max);
  let rtrn: string = "";
  for (let i = 0; i < count; i++) {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 10,
        min: 2,
      },
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });
    const sectionTitle = hasSections ? `## ${randomLoremTitle(2)}\n\n` : "";
    rtrn = `${rtrn}\n\n${sectionTitle}${lorem.generateParagraphs(1)}`;
  }
  return rtrn;
};

export const randomFromRangeSkewedUp = (min: number, max: number) => {
  const spread = max - min;
  const addedToMin = Math.floor(Math.random() * spread);
  return min + addedToMin + 1;
};

export const writeDirIndexMd = (
  title: string,
  dirPath: string,
  genLoremSpec: GenLoremSpec,
  hasSections: boolean
) => {
  fs.mkdir(dirPath, { recursive: true }, (err) => {
    if (err) {
      throw `FAILED ${dirPath}`;
    }
  });
  const fileContents = `# ${jsConvert.toSentenceCase(title)}${randomParagraphs(
    genLoremSpec.paragraphMax,
    hasSections
  )}`;
  fs.writeFile(`${dirPath}/index.md`, fileContents, (err) => {
    if (err) {
      throw `FAILED ${dirPath}/index.md`;
    }
  });
};

export const writeFileToPath = (
  title: string,
  path: string,
  genLoremSpec: GenLoremSpec,
  hasSections: boolean
) => {
  const fileContents = `# ${jsConvert.toSentenceCase(title)}${randomParagraphs(
    genLoremSpec.paragraphMax,
    hasSections
  )}`;
  fs.writeFile(`${path}`, fileContents, (err) => {
    if (err) {
      throw `FAILED ${path}`;
    }
  });
};
