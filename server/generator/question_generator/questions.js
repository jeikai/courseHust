const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

class Question {
    constructor(question, type, options) {
        this.question = question;
        this.type = type;
        this.options = options;
    }
}

const QuestionTypes = {
    MULTIPLE_CHOICE: 'Multiple-Choice',
    FILLING: 'Filling',
    WRITING: 'Writing'
}

const instructions = fs.readFileSync(path.join(__dirname, 'instructions.txt'), 'utf8');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro"});

async function generateRawQuestion(path) {
    const data = loadFile(path);
    let p = '';
    switch (data.type) {
        case 'txt':
            p = prompt(data.content);
            break;
        default:
            throw new Error('Invalid file type');
    }
    const result = await model.generateContent(p);
    const response = await result.response;
    return response.text();
}

function loadFile(path) {
    //check if file exists
    if (!fs.existsSync(path)) throw new Error('File does not exist');
    //check if file is a directory
    if (fs.lstatSync(path).isDirectory()) throw new Error('File is a directory');
    return {
        type: 'txt',
        content: fs.readFileSync(path, 'utf8')
    };
}

function prompt(prompt) {
    return instructions + '\n\n' + prompt;
}

function processQuestion(questions) {
    const linesLength = questions.length;
    const processedQuestions = [];
    let questionStarted = false;
    for (let i = 0; i < linesLength; i++) {
        questionStarted = !!questions[i].startsWith('-Q: ');
        if (questionStarted) {
            //remove the -Q: prefix
            const q = questions[i].substring(4);
            i++;
            if(!questions[i].startsWith('-T: ')) throw new Error('Invalid question format');
            //remove the -T: prefix
            const t = questions[i].substring(4);
            i++;
            if(!questions[i].startsWith('-O: ')) throw new Error('Invalid question format');
            //remove the -O: prefix
            const o = questions[i].substring(4);
            //convert options to array, the options are separated by commas and have [] around them
            const options = o.substring(1, o.length - 1).split(',').map((option) => option.trim());
            processedQuestions.push(new Question(q, t, options));
            questionStarted = false;
        }
    }
    return processedQuestions;
}

async function generateQuestion(path) {
    const rawQuestion = await generateRawQuestion(path);
    return processQuestion(rawQuestion.split('\n').filter((line) => line.length > 0));
}

async function generate(path) {
    return await generateQuestion(path);
}

module.exports = {
    Question,
    QuestionTypes,
    generate
}