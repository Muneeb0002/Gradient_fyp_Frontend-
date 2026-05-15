import { useMutation } from "@tanstack/react-query";
import { solveMathProblem } from "../maths.api.js/mathsNumerical.api.js";

export const useMathSolver = () => {
  return useMutation({
    mutationFn: solveMathProblem,
    onSuccess: (data) => {
      console.log("Solution generated successfully!");
      // Yahan aap chaho toh solution ko local state ya context mein save kar sakte ho
    },
    onError: (error) => {
      console.error(
        "Math Solver Error:",
        error.response?.data?.message || error.message
      );
    },
  });
};