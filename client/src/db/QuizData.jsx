import { faker } from '@faker-js/faker';

const QuizData = [
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
    {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        numberOfQuestions: faker.number.int({ max: 100 }),
        duration: faker.number.int({ max: 60 }),
    },
]

export default QuizData