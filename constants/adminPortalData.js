export const ADMIN_PROFILE = {
  firstName: "Portal",
  lastName: "Admin",
  email: "admin1@gmail.com",
  role: "admin",
  joinedAt: "1 Jun 2025",
};

export const SUPER_ADMIN_PROFILE = {
  displayName: "Super Administrator",
  email: "Gradiant@gmail.com",
  role: "super-admin",
};

export const ADMIN_OVERVIEW_STATS = [
  { id: "access", label: "Portal access", value: "Active", icon: "shield-check" },
  { id: "team", label: "Team admins", value: "4", icon: "account-group" },
  { id: "students", label: "Registered students", value: "128", icon: "school" },
];

export const SUPER_ADMIN_OVERVIEW_STATS = [
  { id: "admins", label: "Admins", value: "4", icon: "account-tie" },
  { id: "users", label: "Students", value: "128", icon: "account-multiple" },
  { id: "sessions", label: "Chat sessions", value: "1.2k", icon: "message-text" },
  { id: "active", label: "Active today", value: "36", icon: "pulse" },
];

export const MOCK_ADMINS = [
  {
    id: "1",
    firstName: "Portal",
    lastName: "Admin",
    email: "admin1@gmail.com",
    createdAt: "1 Jun 2025",
  },
  {
    id: "1b",
    firstName: "Second",
    lastName: "Admin",
    email: "Sadmin@gmail.com",
    createdAt: "12 Jan 2025",
  },
  {
    id: "2",
    firstName: "Ayesha",
    lastName: "Khan",
    email: "ayesha.admin@gradiant.app",
    createdAt: "3 Feb 2025",
  },
  {
    id: "3",
    firstName: "Hassan",
    lastName: "Malik",
    email: "hassan.admin@gradiant.app",
    createdAt: "18 Mar 2025",
  },
  {
    id: "4",
    firstName: "Fatima",
    lastName: "Noor",
    email: "fatima.admin@gradiant.app",
    createdAt: "2 Apr 2025",
  },
];

export const MOCK_USERS = [
  {
    id: "u1",
    firstName: "Abdullah",
    lastName: "Rana",
    email: "abdullah@student.com",
    isVerified: true,
    joinedAt: "5 Jan 2025",
  },
  {
    id: "u2",
    firstName: "Sara",
    lastName: "Ahmed",
    email: "sara.ahmed@student.com",
    isVerified: true,
    joinedAt: "14 Jan 2025",
  },
  {
    id: "u3",
    firstName: "Usman",
    lastName: "Ali",
    email: "usman.ali@student.com",
    isVerified: false,
    joinedAt: "22 Feb 2025",
  },
  {
    id: "u4",
    firstName: "Mariam",
    lastName: "Shah",
    email: "mariam.shah@student.com",
    isVerified: true,
    joinedAt: "8 Mar 2025",
  },
  {
    id: "u5",
    firstName: "Bilal",
    lastName: "Hussain",
    email: "bilal.h@student.com",
    isVerified: true,
    joinedAt: "19 Mar 2025",
  },
  {
    id: "u6",
    firstName: "Zainab",
    lastName: "Qureshi",
    email: "zainab.q@student.com",
    isVerified: false,
    joinedAt: "1 Apr 2025",
  },
];

export const MOCK_HISTORY = [
  {
    id: "h1",
    username: "abdullah@student.com",
    subject: "Mathematics",
    title: "Quadratic equations help",
    preview: "How do I factorize x² + 5x + 6?",
    createdAt: "3 Jun 2025, 10:24 AM",
    messageCount: 8,
  },
  {
    id: "h2",
    username: "sara.ahmed@student.com",
    subject: "Geography",
    title: "River erosion diagram",
    preview: "Explain the stages of a waterfall formation.",
    createdAt: "3 Jun 2025, 09:11 AM",
    messageCount: 5,
  },
  {
    id: "h3",
    username: "mariam.shah@student.com",
    subject: "History",
    title: "Pakistan Movement notes",
    preview: "Summarize the Lahore Resolution in bullet points.",
    createdAt: "2 Jun 2025, 06:40 PM",
    messageCount: 12,
  },
  {
    id: "h4",
    username: "bilal.h@student.com",
    subject: "Economics",
    title: "Supply and demand curve",
    preview: "What shifts the demand curve to the right?",
    createdAt: "2 Jun 2025, 02:15 PM",
    messageCount: 6,
  },
  {
    id: "h5",
    username: "usman.ali@student.com",
    subject: "Mathematics",
    title: "Integration by parts",
    preview: "Step-by-step for ∫ x e^x dx",
    createdAt: "1 Jun 2025, 11:02 AM",
    messageCount: 9,
  },
];

export const HISTORY_DETAIL_BY_ID = {
  h1: {
    ...MOCK_HISTORY[0],
    messages: [
      { role: "user", text: "How do I factorize x² + 5x + 6?" },
      {
        role: "assistant",
        text: "Look for two numbers that multiply to 6 and add to 5: 2 and 3. So (x + 2)(x + 3) = 0.",
      },
      { role: "user", text: "Can you show the steps?" },
      {
        role: "assistant",
        text: "1) Find factors of 6: (1,6), (2,3). 2) Pick pair summing to 5: 2+3. 3) Write (x+2)(x+3).",
      },
    ],
  },
  h2: {
    ...MOCK_HISTORY[1],
    messages: [
      { role: "user", text: "Explain the stages of a waterfall formation." },
      {
        role: "assistant",
        text: "Waterfalls often form where soft rock erodes faster than hard cap rock, creating a steep drop.",
      },
    ],
  },
  h3: {
    ...MOCK_HISTORY[2],
    messages: [
      { role: "user", text: "Summarize the Lahore Resolution in bullet points." },
      {
        role: "assistant",
        text: "• 1940 session in Lahore\n• Separate Muslim state demand\n• Foundation for Pakistan movement",
      },
    ],
  },
  h4: {
    ...MOCK_HISTORY[3],
    messages: [
      { role: "user", text: "What shifts the demand curve to the right?" },
      {
        role: "assistant",
        text: "Higher income, population growth, preferences favoring the good, or price of substitutes rising.",
      },
    ],
  },
  h5: {
    ...MOCK_HISTORY[4],
    messages: [
      { role: "user", text: "Step-by-step for ∫ x e^x dx" },
      {
        role: "assistant",
        text: "Use integration by parts: u = x, dv = e^x dx → ∫ x e^x dx = x e^x − e^x + C",
      },
    ],
  },
};
