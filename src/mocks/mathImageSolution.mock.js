export const MOCK_MATH_IMAGE_SOLUTION = {
  question_number: 1,
  marks: 4,
  steps: [
    {
      step_number: 1,
      description: "(a) [2 marks] Write the given equation",
      expression: "sin(3x - 15°) = √3/2",
      concept_key: "trigonometry",
    },
    {
      step_number: 2,
      description: "(a) [2 marks] Identify the reference angle",
      expression: "sin(θ) = √3/2 => θ = 60°",
      concept_key: "trigonometry",
    },
    {
      step_number: 3,
      description: "(a) [2 marks] Solve for 3x - 15°",
      expression: "3x - 15° = 60° + 360°n or 3x - 15° = 120° + 360°n",
      concept_key: "trigonometry",
    },
    {
      step_number: 4,
      description: "(a) [2 marks] Solve for x",
      expression: "3x = 75° + 360°n or 3x = 135° + 360°n",
      concept_key: "trigonometry",
    },
    {
      step_number: 5,
      description: "(a) [2 marks] Solve for x in the given interval",
      expression: "x = 25° + 120°n or x = 45° + 120°n, for 0° < x < 180°",
      concept_key: "trigonometry",
    },
    {
      step_number: 6,
      description: "(a) [2 marks] Find solutions in the interval",
      expression: "x = 25°, 45°, 145°, 165°",
      concept_key: "trigonometry",
    },
    {
      step_number: 7,
      description: "(b) [2 marks] Understand the curve equation and x-intercepts",
      expression: "y = a sin(bx) + c, P(x_P, 0), R(x_R, 0)",
      concept_key: "trigonometry",
    },
    {
      step_number: 8,
      description: "(b) [2 marks] Use the x-intercepts and ratio to find x_P and x_R",
      expression: "x_R / x_P = 4/1",
      concept_key: "ratio",
    },
  ],
  final_answer: "x_P = 30°, x_R = 120°",
  mark_commentary:
    "For (a), 2 marks for correct solutions in the interval. For (b), 2 marks for using the ratio and finding x_P and x_R.",
  raw_question:
    "Find the solutions of the equation $\\sin(3 x-15^\\circ)=\\frac{\\sqrt{3}}{2}$, for $0^\\circ < x < 180^\\circ$. Figure 4 Figure 4 shows part of the curve with equation $y = a \\sin(bx) + c$, where $a$, $b$, $c$ are constants. The curve cuts the $x$-axis at the points $P$, $Q$ and $R$ as shown. Given that the coordinates of $P$ and $R$ are $(x_P, 0)$ and $(x_R, 0)$ respectively, and $\\frac{x_R}{x_P} = \\frac{4}{1}$ find the values of $x_P$ and $x_R$.",
  visual_data: null,
};

export const MOCK_MATH_CONCEPTS = {
  trigonometry: {
    key: "trigonometry",
    title: "Trigonometry",
    explanation:
      "Use reference angles and the general solution for sin θ = k. Check every value lies in the required interval before giving final answers.",
    example: "sin(3x - 15°) = √3/2 gives x = 25°, 45°, 145°, 165° for 0° < x < 180°.",
  },
  ratio: {
    key: "ratio",
    title: "Ratio",
    explanation:
      "When two quantities are linked by a ratio, write one in terms of the other and substitute into the equation or diagram.",
    example: "If x_R / x_P = 4/1, then x_R = 4x_P.",
  },
};
