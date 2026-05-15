import api from "../api/axios.api.js";

export const solveMathProblem = async (problemData) => {
  // problemData will be { query: "2x^2...", marks: "4" }
  const response = await api.post("/maths_numerical/solve", problemData);
  return response.data;
};