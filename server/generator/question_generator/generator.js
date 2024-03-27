const {generate} = require('./questions');
const {generateDocument, ImageReadType} = require('./document');

const Generator = {
    pass: async (inputPath) => {
        return generate(await generateDocument(inputPath, ImageReadType.OCR));
    }
};

module.exports = Generator; 