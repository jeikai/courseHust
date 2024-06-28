import { message } from "antd";
import Axios from "axios";

const sanitizeQuestion = (data) => {
  const dataReq = {};
};
const deleteQuestion = async (questionId) => {
  const responseDeleteQuestion = await Axios({
    method: "DELETE",
    url: `/api/question/${questionId}`,
  });
  if (!responseDeleteQuestion) {
    return { status: false, message: responseDeleteQuestion.message };
  }
  return { status: true, message: "Success" };
};

const updateQuestion = async (data) => {
  const sanitizeData = (data) => {
    const formatData = { ...data };
    if (data.type == "text") {
      formatData.options = [data.options[0].label];
      formatData.answer = [data.options[0].label];
    } else {
      let answer = [];
      const options = [];
      data.options.forEach((option) => {
        options.push(option.label);
        if (option.isSelected == true) {
          answer.push(option.label);
        }
      });
      formatData.options = options;
      formatData.answer = answer;
    }
    return formatData;
  };
  const sanitizedData = sanitizeData(data);
  console.log({ sanitizedData });
  const responseUpdateQuestion = await Axios({
    method: "PUT",
    url: `/api/question/${data.questionId}`,
    data: {
      questionData: sanitizedData,
    },
  });
  if (!responseUpdateQuestion) return false;
  return true;
};

const getQuestionById = async (id) => {
  try {
    const responseGetQuestion = await Axios({
      method: "GET",
      url: `/api/question/${id}`,
    });

    const question = responseGetQuestion.data.data;
    const formatQues = {
      id: question._id,
      userId: question.userId,
      question: question.question,
      level: question.level,
      answer: question.answer[0],
      type: question.type,
      category:
        question.categoryId != null
          ? { title: question.categoryId.title, _id: question.categoryId._id }
          : "",
      subcategory:
        question.subcategoryId != null
          ? {
              title: question.subcategoryId.title,
              _id: question.subcategoryId._id,
            }
          : "",
      options: [],
    };
    for (const option of question.options) {
      formatQues.options.push({
        isSelected: option === formatQues.answer,
        label: option,
      });
    }
    return {
      data: formatQues,
      message: "success",
    };
  } catch (error) {
    return {
      data: null,
      message: error.message,
    };
  }
};
export { deleteQuestion, getQuestionById, updateQuestion };
