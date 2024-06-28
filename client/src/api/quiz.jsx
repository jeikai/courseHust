import Axios from "axios";
import QuizData from "../db/QuizData";

import { useAPI } from "../hooks/api";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const getQuizs = async (userId) => {
  const data = QuizData;
  const responseAPI = useAPI(`/api/quiz/instructor/${userId}`, null).data;
  return data;
};

const deleteQuiZ = async (id) => {
  const request = await Axios({
    method: "DELETE",
    url: `/api/section/quiz/${id}`,
  });
  if (request.data.error != null) return false;
  return true;
};
const createQuizWithSuggestedQues = async (data) => {
  try {
    console.log(data);
    if (data.section == null) {
      return { error: "You need to select section first" };
    } else if (data.questions == []) {
      return { error: "You need to create at least one question" };
    } else if (data.title == "" || data.title == null) {
      return { error: "You need to fill in quiz title first" };
    } else {
      const dataReq = {};
      dataReq.title = data.title;
      dataReq.isReview = data.isReview;
      const duration = data.duration;
      console.log(duration["$H"]);
      const { hours, minutes, seconds } = {
        hours: duration["$H"],
        minutes: duration["$m"],
        seconds: duration["$s"],
      };

      const hoursNumber = parseInt(hours);
      const minutesNumber = parseInt(minutes);
      const secondsNumber = parseInt(seconds);

      const formattedTime = `${hoursNumber
        .toString()
        .padStart(2, "0")}:${minutesNumber
        .toString()
        .padStart(2, "0")}:${secondsNumber.toString().padStart(2, "0")}`;

      const formattedDuration = formattedTime;
      dataReq.duration = formattedDuration;
      dataReq.ques = [];
      dataReq.startTime = data.deadline?.[0]?.["$d"]?.toString() || "";
      dataReq.endTime = data.deadline?.[1]?.["$d"]?.toString() || "";
      dataReq.totalMarks = data.totalMarks;
      dataReq.passMarks = data.passMarks;
      data.questions.map((question) => {
        dataReq.ques.push(question.id);
      });
      console.log(dataReq);
      const createQuizAPI = await Axios({
        url: `/api/quiz/${data.section}`,
        method: "POST",
        data: dataReq,
      });
      console.log("createQuiz", createQuizAPI.data);
      if (createQuizAPI.data.error) return false;

      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
const createQuiz = async (data) => {
  // const res = await Axios.post('url', data)
  // const data = await res.json();
  try {
    console.log(data);
    if (data.section == null) {
      return { error: "You need to select section first" };
    } else if (data.questions == []) {
      return { error: "You need to create at least one question" };
    } else if (data.title == "" || data.title == null) {
      return { error: "You need to fill in quiz title first" };
    } else {
      const dataReq = {};
      dataReq.title = data.title;
      dataReq.isReview = data.isReview;
      const duration = data.duration;
      const { hours, minutes, seconds } = {
        hours: duration["$H"],
        minutes: duration["$m"],
        seconds: duration["$s"],
      };

      const hoursNumber = parseInt(hours);
      const minutesNumber = parseInt(minutes);
      const secondsNumber = parseInt(seconds);

      const formattedTime = `${hoursNumber
        .toString()
        .padStart(2, "0")}:${minutesNumber
        .toString()
        .padStart(2, "0")}:${secondsNumber.toString().padStart(2, "0")}`;

      const formattedDuration = formattedTime;
      dataReq.duration = formattedDuration;
      dataReq.ques = [];
      dataReq.startTime = data.deadline?.[0]?.["$d"]?.toString() || "";
      dataReq.endTime = data.deadline?.[1]?.["$d"]?.toString() || "";
      dataReq.totalMarks = data.totalMarks;
      dataReq.passMarks = data.passMarks;
      console.log({ ques: data.ques });
      data.ques.map((question) => {
        dataReq.ques.push(question._id);
      });
      console.log(dataReq);
      const createQuizAPI = await Axios({
        url: `/api/quiz/${data.section}`,
        method: "POST",
        data: dataReq,
      });
      console.log(createQuizAPI);

      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};
const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    [array[currentIndex - 1], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex - 1],
    ];
    currentIndex--;
  }

  return array;
};
const updateQuiz = async (data) => {
  // const res = await Axios.post('url', data)
  // const data = await res.json();
  try {
    console.log("update data", data);
    const dataReq = {};
    dataReq.title = data.title;
    const duration = data.duration;
    console.log(duration["$H"]);
    const { hours, minutes, seconds } = {
      hours: duration["$H"],
      minutes: duration["$m"],
      seconds: duration["$s"],
    };

    const hoursNumber = parseInt(hours);
    const minutesNumber = parseInt(minutes);
    const secondsNumber = parseInt(seconds);

    const formattedTime = `${hoursNumber
      .toString()
      .padStart(2, "0")}:${minutesNumber
      .toString()
      .padStart(2, "0")}:${secondsNumber.toString().padStart(2, "0")}`;

    const formattedDuration = formattedTime;
    dataReq.duration = formattedDuration;
    dataReq.ques = [];
    dataReq.startTime = data.deadline?.[0]?.["$d"]?.toString() || "";
    dataReq.endTime = data.deadline?.[1]?.["$d"]?.toString() || "";
    dataReq.totalMarks = data.totalMarks;
    dataReq.passMarks = data.passMarks;
    const quesIds = [];
    console.log("dataReq-0", dataReq);
    await Promise.all(
      data.questions.map(async (question) => {
        if (question.id != null) {
          let answer = [];
          const options = [];
          question.options.forEach((option) => {
            options.push(option.label);
            if (option.isSelected == true) {
              answer.push(option.label);
            }
          });

          const updatedQuestion = await Axios({
            method: "PUT",
            url: `/api/question/${question.id}`,
            data: {
              questionData: {
                question: question.title,
                level: question.level,
                options: options,
                answer: answer,
              },
            },
          });

          quesIds.push(updatedQuestion.data.data._id);
          console.log("Updated Quiz", {
            question: question.title,
            level: question.level,
            options: options,
            answer: answer,
          });
        } else {
          let answer = "";
          const options = [];
          question.options.forEach((option) => {
            if (option.isSelected == true) {
              answer = option.label;
            }
            options.push(option.label);
          });

          const newQuestion = await Axios({
            method: "POST",
            url: `/api/question`,
            data: {
              questionData: {
                question: question.title,
                level: question.level,
                options: options,
                answer: answer,
              },
            },
          });
          quesIds.push(newQuestion.data.data._id);
          console.log("New Quiz", {
            question: question.title,
            level: question.level,
            options: options,
            answer: answer,
          });
        }
      })
    );

    dataReq.ques = quesIds;
    console.log("dataReq", dataReq);
    const updatedQuiz = await Axios({
      method: "PUT",
      url: `/api/quiz/${data.id}`,
      data: {
        quizData: {
          title: dataReq.title,
          duration: dataReq.duration,
          ques: dataReq.ques,
          startTime: dataReq.startTime || "",
          endTime: dataReq.endTime || "",
          totalMarks: dataReq.totalMarks,
          passMarks: dataReq.passMarks,
        },
      },
    });
    console.log("updatedQuiz", updatedQuiz);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getQuizById = async (id) => {
  const responseAPI = (await Axios({ url: `/api/quiz/${id}`, method: "GET" }))
    .data.data;
  console.log(responseAPI);
  const formatData = {
    id: responseAPI._id,
    passMarks: responseAPI.passMarks,
    numberOfQuestions: responseAPI.ques.length,
    title: responseAPI.title,
    duration: dayjs(responseAPI.duration, "HH:mm:ss"),
    totalMarks: responseAPI.totalMarks,
    deadline: [
      dayjs(responseAPI?.startTime, "YYYY-MM-DD HH:mm"),
      dayjs(responseAPI?.endTime, "YYYY-MM-DD HH:mm"),
    ],
    questions: [],
  };
  formatData.questions = shuffleArray(
    responseAPI.ques.map((question) => {
      const formatQues = {
        id: question._id,
        userId: question.userId,
        title: question.question,
        level: question.level,
        answer: question.answer[0],
        type: question.type,
        options: [],
      };
      for (const option of question.options) {
        formatQues.options.push({
          isSelected: option === formatQues.answer,
          label: option,
        });
      }
      return formatQues;
    })
  );

  return formatData;
};

const getQuizByIdWithoutFormatTime = async (id) => {
  const responseAPI = (await Axios({ url: `/api/quiz/${id}`, method: "GET" }))
    .data.data;
  console.log(responseAPI);
  const formatData = {
    id: responseAPI._id,
    passMarks: responseAPI.passMarks,
    numberOfQuestions: responseAPI.ques.length,
    title: responseAPI.title,
    duration: responseAPI.duration,
    totalMarks: responseAPI.totalMarks,
    deadline: [responseAPI.startTime, responseAPI.endTime],
    questions: [],
  };
  formatData.questions = shuffleArray(
    responseAPI.ques.map((question) => {
      const formatQues = {
        id: question._id,
        title: question.question,
        level: question.level,
        answer: question.answer[0],
        type: question.type,
        options: [],
      };
      for (const option of question.options) {
        formatQues.options.push({
          isSelected: option === formatQues.answer,
          label: option,
        });
      }
      return formatQues;
    })
  );

  return formatData;
};

const createQuestions = async (data, userId) => {
  const dataQues = [];
  data.questions.forEach((question) => {
    let processData = {
      userId: userId,
      question: question.title,
      level: question.type,
      categoryId: question.category,
      subcategoryId: question.subcategory,
      type: question.kind,
      // type: "single",
    };
    let optionArray = [];
    let answer = [];
    question.options.forEach((option) => {
      optionArray.push(option.label);
      if (option.isSelected == true) {
        answer.push(option.label);
      }
    });
    processData.options = optionArray;
    processData.answer = answer;
    dataQues.push(processData);
  });
  await Promise.all(
    dataQues.map(async (question) => {
      const newQuestion = await Axios({
        method: "POST",
        data: { questionData: question },
        url: "/api/question",
      });
      console.log("newQuestion", newQuestion.data.data);
    })
  );
  console.log("dataQues", dataQues);
  return true;
};
export {
  getQuizs,
  deleteQuiZ,
  createQuiz,
  getQuizById,
  updateQuiz,
  createQuestions,
  createQuizWithSuggestedQues,
  getQuizByIdWithoutFormatTime,
};
