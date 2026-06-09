import Axios from "axios";

export const filterArray = (arr, e) => {
  console.log(new URLSearchParams({
    action: "mycred_tbr_reward",
    time_based_reward_id: "25697",
  }));
    const filteredObjects = arr.filter(obj => {
        // Lặp qua các khóa trong đối tượng
        for (const key in obj) {
          // Kiểm tra nếu giá trị khóa chứa từ khóa được tìm kiếm
          if (obj[key].toString().toLowerCase().includes(e.toLowerCase())) {
            return true; // Đối tượng phù hợp, giữ lại trong mảng
          }
        }
        return false; // Không tìm thấy từ khóa trong đối tượng
    });

    return filteredObjects
}

export const uploadFile = async (file) => {
  // debugger
  const res = await Axios.post('/api/upload', {file},
  {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
  // debugger
  const data =  {
    file_url: res.data.file_url
  }
  if(res.data.duration){
    data.duration = res.data.duration
  }
  return data
}