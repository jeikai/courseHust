const { createWorker } = require('tesseract.js');
const uuid = require('uuid');
const fs = require('fs');
const path = require('path');
const imgToPDF = require('image-to-pdf');
const mammoth = require('mammoth');

async function processWordFile(path, fileType) {
    // check if file is a Word file
    // if it is, read all the text in it
    // return the text
    // return null if it is not a Word file
    const {value: text} = await mammoth.extractRawText({path});
    const outputPath = path.join(__dirname, 'output.txt');
    fs.writeFileSync(outputPath, text, 'utf8');
    console.log(`The text has been exported to ${outputPath}`);
    return outputPath;
}

async function convertImageToTextOCR(imagePath, outputPath) {
    const worker = createWorker([
        "eng",
        "vie",
    ]);

    let output;

    await (async () => {
        const w = await worker;
        const { data: { text } } = await w.recognize(imagePath, );
        fs.writeFileSync(outputPath, text, 'utf8');
        console.log(text);
        console.log(`The text has been exported to ${outputPath}`);
        await w.terminate();
        output = outputPath;
    })();

    return output;
}

async function convertImageToPDF(imagePath, outputPath) {
    const pdfPath = path.join(__dirname, 'output.pdf');
    imgToPDF([imagePath], 'A4').pipe(fs.createWriteStream(pdfPath));
    console.log(`The PDF has been exported to ${pdfPath}`);
    return pdfPath;
}

async function processImage(imagePath, readType, outputPath) {
    return readType === ImageReadType.OCR ? await convertImageToTextOCR(imagePath, outputPath) :
        readType === ImageReadType.PDF ? await convertImageToPDF(imagePath, outputPath) :
            (() => { throw new Error('Invalid read type'); })();
}

async function generateDocument(inputPath, type = ImageReadType.OCR) {
    //check if temp directory exists
    if (!fs.existsSync(path.join(__dirname, 'temp'))) fs.mkdirSync(path.join(__dirname, 'temp'));

    if (!fs.existsSync(inputPath)) throw new Error('File does not exist');
    if (fs.lstatSync(inputPath).isDirectory()) throw new Error('File is a directory');
    const fileType = inputPath.split('.').pop();

    //generate random output name using UUID
    const outputName = uuid.v4();
    const outputPath = path.join(__dirname, 'temp', outputName);

    console.log(fileType)
    switch (fileType) {
        case 'png':
        case 'jpg':
            await processImage(inputPath, type, outputPath);
            break;
        case 'pdf':
            break;
        case 'doc':
        case 'docx':
            await processWordFile(inputPath, fileType, outputPath);
            break;
        default:
            throw new Error('Invalid file type');
    }
    return outputPath;
}

const ImageReadType = {
    OCR: 'OCR',
    PDF: 'PDF',
}

module.exports = {
    generateDocument,
    ImageReadType
};

