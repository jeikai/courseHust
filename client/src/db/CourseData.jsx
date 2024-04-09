import { faker } from '@faker-js/faker';
const CourseData = [
    {
        id: faker.string.uuid(),
        title: faker.person.jobTitle(),
        categoryId: faker.string.uuid(),
        level: faker.helpers.enumValue({basic, advanced, immediate, specialized}),
        shortDes: faker.commerce.productDescription(),
        description: faker.commerce.productDescription(),
        faq: [
            {
                question: faker.lorem.word(15),
                answer: faker.lorem.word(30)
            },
            {
                question: faker.lorem.word(15),
                answer: faker.lorem.word(30)
            },
            {
                question: faker.lorem.word(15),
                answer: faker.lorem.word(30)
            },
        ],
        requirements: [
            {
                requirement: faker.lorem.word(30),
            },
            {
                requirement: faker.lorem.word(30),
            },
            {
                requirement: faker.lorem.word(30),
            },
        ],
        outcomes: [
            {
                outcome: faker.lorem.word(30),
            },
            {
                outcome: faker.lorem.word(30),
            },
            {
                outcome: faker.lorem.word(30),
            },
        ],
        free: faker.datatype.boolean(),
        price: faker.commerce.price(),
        thumbnail: faker.image.avatar(),    
        courseVideo: faker.image.url(),
        sectionIds: ['section-1', 'section-2', 'section-3'],
        sections: [
            {
                id: 'section-1',
                title: faker.lorem.word(10),
                specIds: [
                    {
                        id: 'lesson-1',
                        type: 'lesson'
                    },
                    {
                        id: 'lesson-2',
                        type: 'lesson'
                    },
                    {
                        id: 'quiz-1',
                        type: 'quiz'
                    },
                    {
                        id: 'lesson-3',
                        type: 'lesson'
                    },
                    
                ],
                specs: [
                    {
                        id: 'lesson-1',
                        title: faker.lorem.word(10),
                        videoURL: faker.image.url(),
                        sectionId: 'section-1',
                        content: faker.lorem.word(30),
                    },
                    {
                        id: 'lesson-2',
                        title: faker.lorem.word(10),
                        file: faker.image.url(),
                        sectionId: 'section-1',
                        description: faker.lorem.word(30),
                    },
                    {
                        id: 'lesson-3',
                        title: faker.lorem.word(10),
                        file: faker.image.url(),
                        sectionId: 'section-1',
                        description: faker.lorem.word(30),
                    },
                    {
                        id: 'quiz-1',
                        title: faker.lorem.word(10),
                        duration: faker.number.int({ max: 60 }),
                        deadline: ['from date', 'to date'],
                        marks: faker.number.int({ max: 10 }),
                        passMarks: faker.number.int({ max: 10 }),
                        file: faker.image.url(), 
                        sectionId: 'section-1',
                        description: faker.lorem.word(30),
                    },
                ]
            }
        ]
    }
]

export default CourseData