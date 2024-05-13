import Axios from "axios";
import QuizData from "../db/QuizData";
import { da } from "@faker-js/faker";
import { useAPI } from "../hooks/api";
const getQuizs = async () => {
  const data = QuizData;
  return data;
};

const deleteQuiZ = async (id) => {
  // const res = await Axios.post('url', id)
  // const data = await res.json();

  // trả về status true or false
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
        const dataQues = [];
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

const getQuizById = async (id) => {
    // const res = await Axios.post('../config/users.json', id)
    // const data = await res.json();
    const responseAPI = await Axios({url: `/api/quiz/${id}`, method: "GET"})
    const data = responseAPI.data.data
    return data;
}

export { getQuizs, deleteQuiZ, createQuiz, getQuizById };
