import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default API;
export const analyzeResume = async (formData) => {
  return await API.post("/ai/analyze", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};