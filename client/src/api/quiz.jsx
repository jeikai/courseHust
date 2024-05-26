import Axios from "axios";
import QuizData from "../db/QuizData";
import { da } from "@faker-js/faker";
import { useAPI } from "../hooks/api";
const getQuizs = async (userId) => {
  const data = QuizData;
  const responseAPI = (await useAPI(`/api/quiz/instructor/${userId}`, null))
    .data;
  return data;
};

const deleteQuiZ = async (id) => {
  return true;
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
      console.log(dataReq);
      const createQuizAPI = await Axios({
        url: `/api/quiz/${data.section}`,
        method: "POST",
        data: dataReq,
      });
      console.log(createQuizAPI);
      if (createQuizAPI.data.data) {
        let dataQues = [];
        if (data.preProcessQues) {
          dataQues = data.ques;
        } else {
          data.questions.forEach((question) => {
            let processData = {
              question: question.title,
              level: question.type,
            };
            let optionArray = [];
            let answer;
            question.options.forEach((option) => {
              optionArray.push(option.label);
              if (option.isSelected == true) {
                answer = option.label;
              }
            });
            processData.options = optionArray;
            processData.answer = answer;
            dataQues.push(processData);
          });
        }
        const createQuestion = await Axios({
          url: `/api/question/${createQuizAPI.data.data._id}`,
          method: "POST",
          data: dataQues,
        });
        console.log(createQuestion);
        return true;
      } else {
        return false;
      }
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
const getQuizById = async (id) => {
  const responseAPI = (await Axios({ url: `/api/quiz/${id}`, method: "GET" }))
    .data.data;
  const formatData = {
    id: responseAPI._id,
    passMarks: 5,
    numberOfQuestions: responseAPI.ques.length,
    title: responseAPI.title,
    duration: responseAPI.duration,
    totalMarks: 10,
    deadline: responseAPI.endTime,
    startTime: responseAPI.startTime,
    questions: [],
  };
  formatData.questions = shuffleArray(
    responseAPI.ques.map((question) => {
      const formatQues = {
        id: question._id,
        title: question.question,
        level: question.level,
        answer: question.answer,
        type: "scq",
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
  console.log(formatData.questions);
  return formatData;
};

export { getQuizs, deleteQuiZ, createQuiz, getQuizById };
