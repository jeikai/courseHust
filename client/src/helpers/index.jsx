export const filterArray = (arr, e) => {
    const filteredObjects = arr.filter(obj => {
        // Lặp qua các khóa trong đối tượng
        for (const key in obj) {
          // Kiểm tra nếu giá trị khóa chứa từ khóa được tìm kiếm
          if (obj[key].toString().includes(e)) {
            return true; // Đối tượng phù hợp, giữ lại trong mảng
          }
        }
        return false; // Không tìm thấy từ khóa trong đối tượng
    });

    return filteredObjects
}