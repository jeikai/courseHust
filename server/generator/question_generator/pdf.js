const PdfExtractor = require('pdf-extractor').PdfExtractor;

const outputDir = '/path/to/output';

async function extractPdf(pdfPath) {
    let od = outputDir + '/' + pdfPath.split('/').pop().split('.').shift();
    let pdfExtractor = new PdfExtractor(outputDir);

    await pdfExtractor.parse('/path/to/dummy.pdf').catch(function (err) {
        console.error('Error: ' + err);
    });

    console.log('# End of Document');

    return od;
}