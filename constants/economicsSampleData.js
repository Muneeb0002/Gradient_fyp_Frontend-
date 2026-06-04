export const SAMPLE_MCQ_QUESTION =
  "Which term describes the loss of potential benefit to a consumer when making a choice between alternatives?\n\nA) Opportunity cost\nB) Scarcity\nC) Shortage\nD) The economic problem";

export const SAMPLE_MCQ_RESULT = {
  correct_option: "A",
  rationale:
    "The term that describes the loss of potential benefit to a consumer when making a choice between alternatives is opportunity cost. It refers to the value of the next best alternative that is given up as a result of making a decision.",
  why_others_wrong: [
    "B is wrong because scarcity refers to unlimited wants versus limited resources.",
    "C is wrong because shortage means quantity demanded exceeds quantity supplied at a given price.",
    "D is wrong because the economic problem is the broad issue of allocating scarce resources, not the specific cost of one choice.",
  ],
  concept: "Opportunity Cost",
  examiner_tip:
    "Be precise with definitions. Opportunity cost is the value of the next best alternative foregone when a decision is made.",
  difficulty: "Easy",
};

export function normalizeWhyOthersWrong(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

const SAMPLE_DEMAND_SUPPLY_SVG = `<svg viewBox="0 0 720 420" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#334155"/>
    </marker>
  </defs>
  <line x1="80" y1="360" x2="660" y2="360" stroke="#334155" stroke-width="2"/>
  <line x1="80" y1="360" x2="80" y2="40" stroke="#334155" stroke-width="2"/>
  <text x="670" y="375" font-size="16" fill="#334155">Quantity</text>
  <text x="40" y="50" font-size="16" fill="#334155">Price</text>
  <line x1="120" y1="320" x2="580" y2="120" stroke="#0f766e" stroke-width="3"/>
  <text x="590" y="115" font-size="14" fill="#0f766e">D1</text>
  <line x1="120" y1="120" x2="580" y2="320" stroke="#0369a1" stroke-width="3"/>
  <text x="590" y="330" font-size="14" fill="#0369a1">S1</text>
  <line x1="120" y1="340" x2="560" y2="140" stroke="#0f766e" stroke-width="3" stroke-dasharray="8 6"/>
  <text x="565" y="135" font-size="14" fill="#0f766e">D2</text>
  <circle cx="350" cy="220" r="5" fill="#111827"/>
  <text x="360" y="215" font-size="13" fill="#111827">E1</text>
  <circle cx="290" cy="260" r="5" fill="#111827"/>
  <text x="300" y="255" font-size="13" fill="#111827">E2</text>
  <line x1="290" y1="260" x2="80" y2="260" stroke="#64748b" stroke-dasharray="5 5"/>
  <line x1="290" y1="260" x2="290" y2="360" stroke="#64748b" stroke-dasharray="5 5"/>
  <text x="55" y="265" font-size="12" fill="#64748b">P2</text>
  <text x="275" y="378" font-size="12" fill="#64748b">Q2</text>
  <path d="M480,180 L520,160" stroke="#334155" stroke-width="2" marker-end="url(#arrow)"/>
  <text x="525" y="155" font-size="12" fill="#334155">Demand falls</text>
  <text x="180" y="395" font-size="13" fill="#475569">Lower price · Lower quantity</text>
</svg>`;

export const SAMPLE_PAPER2_SECTION_A = {
  section: "A",
  input_mode: "image",
  marks_source: "image marks",
  detected_parts: [
    {
      part: "(a)",
      marks: 1,
      question: "Define the term labour force.",
      answer:
        "The labour force is the total number of people who are employed plus those who are unemployed but actively seeking work.",
      diagram_svg: null,
    },
    {
      part: "(b)",
      marks: 2,
      question: "State two reasons why Japan's labour force participation rate may fall.",
      answer:
        "1. An ageing population means more people reach retirement age and leave the labour force.\n2. Younger people may stay in education longer, delaying entry into employment.",
      diagram_svg: null,
    },
    {
      part: "(c)",
      marks: 4,
      question: "Explain how a fall in consumer confidence could affect unemployment in Japan.",
      answer:
        "Lower consumer confidence reduces household spending on goods and services. Firms face falling sales and may cut output, so they reduce labour demand and may make workers redundant. This raises cyclical unemployment until confidence and spending recover.",
      diagram_svg: null,
    },
    {
      part: "(d)",
      marks: 2,
      question: "Identify one supply-side policy the Japanese government could use to raise employment.",
      answer:
        "Subsidies or tax incentives for firms that hire and train workers, which lowers firms' labour costs and encourages greater employment.",
      diagram_svg: null,
    },
    {
      part: "(e)",
      marks: 4,
      question:
        "Using a demand and supply diagram, show the effect of a fall in consumer spending on the market for cars in Japan.",
      answer:
        "A fall in consumer spending reduces demand for cars. The demand curve shifts left from D1 to D2. Equilibrium moves from E1 to E2, causing a lower equilibrium price (P2) and lower equilibrium quantity (Q2).",
      diagram_svg: SAMPLE_DEMAND_SUPPLY_SVG,
    },
  ],
  examiner_tip:
    "In Section A, quote data from the source when it is provided and match the number of points to the marks shown beside each part.",
  syllabus_links: [
    "Labour market · employment and unemployment",
    "Demand and supply · shifts and equilibrium",
    "Macroeconomic policies",
  ],
};

export const SAMPLE_PAPER2_SECTION_B_QUERY =
  "Define inflation. [2 marks]\n\nExplain two consequences of inflation for households. [4 marks]";

export const SAMPLE_PAPER2_SECTION_B = {
  section: "B",
  input_mode: "text",
  marks_source: "command word inference",
  detected_parts: [
    {
      part: "Define",
      marks: 2,
      question: "Define inflation.",
      answer:
        "Inflation is a sustained rise in the general price level of goods and services in an economy over time.",
      diagram_svg: null,
    },
    {
      part: "Explain",
      marks: 4,
      question: "Explain two consequences of inflation for households.",
      answer:
        "1. If money wages rise more slowly than prices, real income falls and households can buy fewer goods and services.\n2. Savers lose purchasing power because the real value of money held in bank accounts or cash declines when prices rise faster than interest earned.",
      diagram_svg: null,
    },
  ],
  examiner_tip:
    "For a 2-mark define question, give a precise syllabus definition. For 4-mark explain questions, give two separate points, each with a clear because/so chain.",
  syllabus_links: ["Inflation and deflation", "Money and banking"],
};

export function getPaper2ResultForSection(section) {
  return section === "B" ? SAMPLE_PAPER2_SECTION_B : SAMPLE_PAPER2_SECTION_A;
}
