import Axios from "axios";

const sanitizeQuestion = (data) => {
    const dataReq = {};
    
}
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
    
    const responseUpdateQuestion = await Axios({
    method: "PUT",
    url: `/api/question/:${data.questionId}`,
    data: null,
  });

};
export { deleteQuestion };
