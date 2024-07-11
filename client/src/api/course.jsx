import Axios from "axios";

const handleUpdateCourse = async (data) => {
  debugger;
  console.log("submitted data", data);
  const sections = data.sections;
  const courseId = data._id;
  const newSections = [];
  const prevQuizIds = [];
  const newQuizSpecs = [];
  // Create new sections and add to course

  await Promise.all(
    sections.map(async (section) => {
      // If section existed
      if (!section._id.includes("-")) {
        const newSpecs = [];
        const sectionId = section._id;
        const { specs } = section;

        await Promise.all(
          specs.map(async (spec) => {
            if (spec._id._id && spec.type == "lesson") {
              console.log("If lesson existed");
              const lessonId = spec._id._id;
              const lessonData = spec._id;

              const updateLesson = await Axios({
                method: "PUT",
                url: `/api/lesson/${lessonId}`,
                data: lessonData,
              });

              newSpecs.push({
                _id: updateLesson.data.data._id,
                type: "lesson",
              });
            } else if (spec.type == "lesson") {
              // If lesson not existed
              const lessonData = spec._id;

              const createLesson = await Axios({
                method: "POST",
                url: `/api/lesson`,
                data: {
                  title: lessonData.title,
                  content: lessonData.content,
                  videoURL: lessonData.videoURL || "",
                  docURL: lessonData.docURL || "",
                  duration: lessonData.duration,
                  sectionId: sectionId,
                },
              });

              newSpecs.push({
                _id: createLesson.data.data._id,
                type: "lesson",
              });
            } else if (spec.type == "quiz") {
              // If quiz existed
              if (spec._id._id) {
                newQuizSpecs.push({
                  _id: spec._id._id,
                  type: "quiz"
                });
              } 
            }
          })
        );
        // Update existed section
        try {
          const prevSectionLesson = await Axios({
            method: "POST",
            url: "/api/section",
            data: {
              sectionId: sectionId,
              specType: "lesson",
            },
          });
          const prevSection = await Axios({
            method: "GET",
            url: `/api/section/${sectionId}`,
          });

          prevSection.data.specs.forEach((spec) => {
            if (spec.type == "quiz") prevQuizIds.push(spec._id._id);
          });

          const prevLessonIds = [];
          const prevSpecs = prevSectionLesson.data.specs;
          console.log({ prevSpecs });
          if (prevSpecs && prevSpecs != []) {
            prevSpecs.forEach((spec) => {
              if (spec.type == "lesson") prevLessonIds.push(spec._id._id);
            });
          }
          const deleteLessonIds = [];
          console.log({ newSpecs });
          console.log({ prevLessonIds });
          prevLessonIds.forEach((prevId) => {
            const id = newSpecs.findIndex((spec) => spec._id == prevId);
            if (id == -1) deleteLessonIds.push(prevId);
          });
          console.log({ deleteLessonIds });
          await Promise.all(
            deleteLessonIds.map(async (id) => {
              await Axios({
                method: "DELETE",
                url: `/api/lesson/${id}`,
              });
            })
          );

          // Handle quizzes
          const deleteQuizIds = [];
          prevQuizIds.forEach((prevId) => {
            const id = newQuizSpecs.findIndex((quizSpec) => quizSpec._id == prevId);
            if (id == -1) deleteQuizIds.push(prevId);
          });
          console.log({ deleteQuizIds });
          await Promise.all(
            deleteQuizIds.map(async (id) => {
              await Axios({
                method: "DELETE",
                url: `/api/quiz/${id}`,
              });
            })
          );
        } catch (error) {
          console.log({
            sectionId: sectionId,
            specType: "lesson",
          });
        }
        console.log({ finalSpecs: [...newSpecs, ...newQuizSpecs] });
        const updateSection = await Axios({
          method: "PUT",
          url: `/api/section/${sectionId}`,
          data: {
            ...section,
            specs: [...newSpecs, ...newQuizSpecs],
          },
        });
        newSections.push(sectionId);
      } else {
        // If section not existed
        const newSection = await Axios({
          method: "POST",
          url: `/api/section/${courseId}`,
          data: {
            title: section.title,
          },
        });

        const sectionId = newSection.data.data._id;

        newSections.push(sectionId);
        const newSpecs = [];
        const specs = section.specs;

        await Promise.all(
          specs.map(async (spec) => {
            // lesson not existed
            const lessonData = spec._id;
            //! Bug duration
            const createLesson = await Axios({
              method: "POST",
              url: `/api/lesson`,
              data: {
                title: lessonData.title,
                content: lessonData.content,
                videoURL: lessonData.videoURL || "",
                docURL: lessonData.docURL || "",
                duration: 0,
                sectionId: sectionId,
              },
            });

            newSpecs.push({
              _id: createLesson.data.data._id,
              type: "lesson",
            });
          })
        );

        const updateSection = await Axios({
          method: "PUT",
          url: `/api/section/${sectionId}`,
          data: {
            specs: newSpecs,
          },
        });
      }
    })
  );

  const prevCourse = await Axios({
    method: "GET",
    url: `/api/course/${courseId}`,
  });
  if (prevCourse.data.sections.length != 0) {
    let prevSections = [];
    prevCourse.data.sections.forEach((section) => {
      prevSections.push(section._id);
    });

    prevSections = prevSections.filter(
      (id) => newSections.findIndex((secId) => secId == id) == -1
    );

    //! Delete unused section
    if (prevSections.length != 0) {
      try {
        await Promise.all(
          prevSections.map(async (section) => {
            await Axios({
              method: "DELETE",
              url: `/api/section/${section}`,
              params: {
                courseId,
              },
            });
          })
        );
      } catch (error) {
        console.log("error", error.message);
      }
    }
  }
  // fetch prev course to delete section
  const updatedCourse = await Axios({
    method: "PUT",
    url: `/api/course/${courseId}`,
    data: {
      ...data,
      sections: newSections,
    },
  });
  console.log("updatedCourse", updatedCourse.data);
};

const formatTime = (time) => {
  const { hours, minutes, seconds } = {
    hours: time["$H"],
    minutes: time["$m"],
    seconds: time["$s"],
  };

  const hoursNumber = parseInt(hours);
  const minutesNumber = parseInt(minutes);
  const secondsNumber = parseInt(seconds);

  const formattedTime = `${hoursNumber
    .toString()
    .padStart(2, "0")}:${minutesNumber
    .toString()
    .padStart(2, "0")}:${secondsNumber.toString().padStart(2, "0")}`;

  return formattedTime;
};

const handleCreateSchedule = async (scheduleForm) => {
  const dataReq = {};
  const { deadline, startTime, endTime } = scheduleForm;
  dataReq.time_start = formatTime(startTime);
  dataReq.time_end = formatTime(endTime);

  dataReq.day_start = deadline?.[0]?.["$d"]?.toString() || "";
  dataReq.day_end = deadline?.[1]?.["$d"]?.toString() || "";

  dataReq.title = scheduleForm.title;
  dataReq.description = scheduleForm.description;
  dataReq.urlMeet = scheduleForm.urlMeet;

  switch (scheduleForm.dayOfWeek) {
    case "Sunday":
      dataReq.dayOfWeek = 0;
      break;
    case "Monday":
      dataReq.dayOfWeek = 1;
      break;
    case "Tuesday":
      dataReq.dayOfWeek = 2;
      break;
    case "Wednesday":
      dataReq.dayOfWeek = 3;
      break;
    case "Thursday":
      dataReq.dayOfWeek = 4;
      break;
    case "Friday":
      dataReq.dayOfWeek = 5;
      break;
    case "Saturday":
      dataReq.dayOfWeek = 6;
      break;
    default:
      dataReq.dayOfWeek = null;
  }
  dataReq.userId = scheduleForm.userId;
  dataReq.courseId = scheduleForm.courseId;
  console.log({ dataReq });
  try {
    await Axios({
      method: "POST",
      url: "/api/calendar",
      data: { ...dataReq },
    });
  } catch (error) {
    return {
      message: error.message,
      error: true,
    };
  }
  return {
    message: "Create schedule successfully",
    error: false,
  };
};

const handleUpdateSchedule = async (data) => {
  const dataReq = {
    title: data.title,
    description: data.description,
    urlMeet: data.urlMeet,
  };
  dataReq.day_start = data.deadline?.[0]?.["$d"]?.toString() || "";
  dataReq.day_end = data.deadline?.[1]?.["$d"]?.toString() || "";

  dataReq.time_start = formatTime(data.startTime);
  dataReq.time_end = formatTime(data.endTime);
  switch (data.dayOfWeek) {
    case "Sunday":
      dataReq.dayOfWeek = 0;
      break;
    case "Monday":
      dataReq.dayOfWeek = 1;
      break;
    case "Tuesday":
      dataReq.dayOfWeek = 2;
      break;
    case "Wednesday":
      dataReq.dayOfWeek = 3;
      break;
    case "Thursday":
      dataReq.dayOfWeek = 4;
      break;
    case "Friday":
      dataReq.dayOfWeek = 5;
      break;
    case "Saturday":
      dataReq.dayOfWeek = 6;
      break;
    default:
      dataReq.dayOfWeek = null;
  }
  dataReq.userId = data.userId;
  dataReq.courseId = data.courseId;
  try {
    await Axios({
      method: "PUT",
      url: `/api/calendar/${data._id}`,
      data: {
        ...dataReq,
      },
    });
  } catch (error) {
    return {
      message: error.message,
      error: true,
    };
  }
  return {
    message: "Update schedule successfully",
    error: false,
  };
};

export { handleUpdateCourse, handleCreateSchedule, handleUpdateSchedule };
