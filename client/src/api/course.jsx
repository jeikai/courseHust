/*
 // Basic info
 instructorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
 title: { type: String, required: true, unique: true },
 shortDes: { type: String },
 description: { type: String, required: true },
 isStream: {type: Boolean, required: true},
 categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
 level: { type: String, enum: ['basic', 'intermediate', 'advanced', 'specialized'], default: 'basic' },

 // thumbnail 
 thumbnail: { type: String, required: true },

 // Bài học
 sections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Section' }],

 date_created: Date, 
 date_updated: Date 
 **/

import Axios from 'axios';

/* {
    _id:..
    "title": "test",
    "category": "Software Engineer",
    "level": "intermediate",
    "shortDes": "hehe",
    "description": "<p>hehe</p>",
    "faq": [],
    "outcomes": [],
    "requirements": [],
    "free": false,
    "thumbnail": "https://res.cloudinary.com/dvezv6uvw/image/upload/v1715409873/course_HUST/images/thhiqlqfoka7pbcj0rns.jpg",
    "video": null,
    "sections": [
        {
            "_id": "663f13db5cd1708e4e35d93f",
            "title": "section 1",
            "date_created": "2024-05-11T06:44:43.200Z",
            "date_updated": "2024-05-11T06:44:44.625Z",
            "specs": [
                {
                    "_id": {
                        "_id": "663f13dc5cd1708e4e35d943",
                        "title": "lesson 1",
                        "content": "hehe",
                        "videoURL": "https://res.cloudinary.com/dvezv6uvw/video/upload/v1715409877/course_HUST/videos/s04vot3nrte36tnpvisy.mp4",
                        "docURL": "",
                        "duration": 3.8498,
                        "date_created": "2024-05-11T06:44:44.110Z",
                        "date_updated": "2024-05-11T06:44:44.110Z",
                        "__v": 0
                    },
                    "type": "lesson"
                },
                {
                    "_id": {
                        "title": "fdas",
                        "content": "fdas",
                        "sectionId": "663f13db5cd1708e4e35d93f",
                        "id": "67dd9a7f-2003-444e-abbe-504fa9623824"
                    },
                    "type": "lesson"
                }
            ],
            "__v": 1
        },
        {
            "_id": "6d4df7e3-491f-47cc-a31e-8e4550bd57e2",
            "title": "Test",
            "specs": [
                {
                    "_id": {
                        "title": "tew",
                        "content": "fdasf",
                        "sectionId": "6d4df7e3-491f-47cc-a31e-8e4550bd57e2",
                        "id": "eb731454-db98-45a2-a7f3-b7eca56a57bc"
                    },
                    "type": "lesson"
                }
            ]
        }
    ],
    "sectionIds": [
        "ddcdab0e-d264-4d48-aa4f-3a3b0a1ef24d",
        "59daa483-6fec-4eb3-99a4-6210149a1d72"
    ]
}
**/
const handleUpdateCourse = async (data) => {
	console.log('submitted data', data);

	const sections = data.sections;
	const courseId = data._id;
	const newSections = [];
	//Create new sections and add to course

	await Promise.all(
		sections.map(async (section) => {
			console.log('each section', section);
			//If section existed
			if (!section._id.includes('-')) {
				const newSpecs = [];
				const sectionId = section._id;
				const { specs } = section;
				console.log('specs', specs);
				await Promise.all(
					specs.map(async (spec) => {
						if (spec._id._id) {
							//If lesson existed
							const lessonId = spec._id._id;
							const lessonData = spec._id;

							const updateLesson = await Axios({
								method: 'PUT',
								url: `/api/lesson/${lessonId}`,
								data: lessonData,
							});
							console.log('updateLesson-1', updateLesson.data);
							newSpecs.push({
								_id: updateLesson.data.data._id,
								type: 'lesson',
							});
						} else {
							//If lesson not existed
							const lessonData = spec._id;
							//! Bug duration

							const createLesson = await Axios({
								method: 'POST',
								url: `/api/lesson`,
								data: {
									title: lessonData.title,
									content: lessonData.title,
									videoURL: lessonData.videoURL || '',
									duration: 0,
									sectionId: sectionId,
								},
							});
							console.log('createLesson-1', createLesson.data);
							newSpecs.push({
								_id: createLesson.data.data._id,
								type: 'lesson',
							});
						}
					})
				);
				//Update existed section
				console.log('specs-1', newSpecs);
				const prevSection = await Axios({
					method: 'GET',
					url: `/api/section`,
					data: {
						sectionId: sectionId,
						specType: 'lesson',
					},
				});
				const prevLessonIds = [];
				const prevSpecs = prevSection.data.specs;
				if (prevSpecs && prevSpecs != []) {
					prevSpecs.forEach((spec) => {
						prevLessonIds.push(spec._id._id);
					});
				}
				const deleteId = [];
				prevLessonIds.forEach((prevId) => {
					const id = newSpecs.findIndex((spec) => spec._id == id);
					if (id == -1) deleteId.push(prevId);
				});
				await Promise.all(
					deleteId.forEach(async (id) => {
						await Axios({
							method: 'DELETE',
							url: `/api/lesson/${id}`,
						});
					})
				);
				const updateSection = await Axios({
					method: 'PUT',
					url: `/api/section/${sectionId}`,
					data: {
						...section,
						specs: newSpecs,
					},
				});
				newSections.push(updateSection.data.data._id);
				console.log('updateSection-1', updateSection.data);
				console.log('new section array-1', newSections);
			} else {
				//If section not existed
				const newSection = await Axios({
					method: 'POST',
					url: `/api/section/${courseId}`,
					data: {
						title: section.title,
					},
				});
				console.log('createSection-2', newSection.data);
				const sectionId = newSection.data.data._id;
				console.log('create section id', sectionId);
				newSections.push(sectionId);
				const newSpecs = [];
				const specs = section.specs;
				console.log('specs', specs);
				await Promise.all(
					specs.map(async (spec) => {
						// lesson not existed
						const lessonData = spec._id;
						//! Bug duration
						const createLesson = await Axios({
							method: 'POST',
							url: `/api/lesson`,
							data: {
								title: lessonData.title,
								content: lessonData.title,
								videoURL: lessonData.videoURL || '',
								duration: 0,
								sectionId: sectionId,
							},
						});
						console.log('createLesson-2', createLesson.data);

						newSpecs.push({
							_id: createLesson.data.data._id,
							type: 'lesson',
						});
					})
				);
				console.log('specs-2', newSpecs);
				const updateSection = await Axios({
					method: 'PUT',
					url: `/api/section/${sectionId}`,
					data: {
						specs: newSpecs,
					},
				});
				console.log('updateSection-2', updateSection.data);
				console.log('new section array-2', newSections);
			}
		})
	);
	//fetch prev course to delete section
	const prevCourse = await Axios({
		method: 'GET',
		url: `/api/course/${courseId}`,
	});
	let prevSections = [];
	prevCourse.sections.forEach((section) => {
		prevSections.push(section._id);
	});
    prevSections = prevSections.filter((id) => newSections.findIndex(secId => secId == id) == -1)
    //! Delete unused section
    // await Promise.all( prevSections.forEach(async (section) => {
    //     await Axios({
    //         method: 'DELETE',
    //         url
    //     })
    // }))
	const updatedCourse = await Axios({
		method: 'PUT',
		url: `/api/course/${courseId}`,
		data: {
			...data,
			sections: newSections,
		},
	});
	console.log('updatedCourse', updatedCourse.data);
};

export { handleUpdateCourse };
