import { faker } from "@faker-js/faker";

const QuizData = [
  {
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    numberOfQuestions: faker.number.int({ max: 100 }),
    duration: faker.date.anytime(),
    deadline: faker.date.betweens({
      from: "2020-01-01T00:00:00.000Z",
      to: "2030-01-01T00:00:00.000Z",
      count: 2,
    }),
    totalMarks: faker.number.int({ max: 10 }),
    passMarks: faker.number.int({ max: 10 }),
    questions: [
      {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        // type: faker.helpers.enumValue({ mcq: "mcq", scq: "scq" }),
        type: faker.helpers.enumValue({ multiple: "multiple", single: "single", text: "text" }),
        options: [
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
        ],
      },
      {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        type: faker.helpers.enumValue({ multiple: "multiple", single: "single", text: "text" }),
        options: [
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
        ],
      },
      {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        type: faker.helpers.enumValue({ multiple: "multiple", single: "single", text: "text" }),
        options: [
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
        ],
      },
      {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        type: faker.helpers.enumValue({ multiple: "multiple", single: "single", text: "text" }),
        options: [
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
        ],
      },
      {
        id: faker.string.uuid(),
        title: faker.commerce.productName(),
        type: faker.helpers.enumValue({ multiple: "multiple", single: "single", text: "text" }),
        options: [
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
          {
            isSelected: faker.datatype.boolean(),
            label: faker.commerce.productName(),
          },
        ],
      },
    ],
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
];

export default QuizData;
