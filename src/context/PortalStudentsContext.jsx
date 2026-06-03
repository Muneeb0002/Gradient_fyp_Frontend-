import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MOCK_USERS } from "../../constants/adminPortalData";

const PortalStudentsContext = createContext(null);

let nextStudentId = 200;

export function PortalStudentsProvider({ children }) {
  const [students, setStudents] = useState(MOCK_USERS);

  const addStudent = useCallback((payload) => {
    const entry = {
      id: String(++nextStudentId),
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      isVerified: Boolean(payload.isVerified),
      joinedAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      password: payload.password,
    };
    setStudents((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const updateStudent = useCallback((id, updates) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              ...updates,
              firstName: updates.firstName?.trim() ?? s.firstName,
              lastName: updates.lastName?.trim() ?? s.lastName,
              email: updates.email?.trim().toLowerCase() ?? s.email,
            }
          : s,
      ),
    );
  }, []);

  const updateStudentPassword = useCallback((id, password) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, password } : s)),
    );
  }, []);

  const removeStudent = useCallback((id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const resetStudents = useCallback(() => {
    setStudents(MOCK_USERS);
  }, []);

  const value = useMemo(
    () => ({
      students,
      addStudent,
      updateStudent,
      updateStudentPassword,
      removeStudent,
      resetStudents,
    }),
    [
      students,
      addStudent,
      updateStudent,
      updateStudentPassword,
      removeStudent,
      resetStudents,
    ],
  );

  return (
    <PortalStudentsContext.Provider value={value}>
      {children}
    </PortalStudentsContext.Provider>
  );
}

export function usePortalStudents() {
  const ctx = useContext(PortalStudentsContext);
  if (!ctx) {
    throw new Error("usePortalStudents must be used within PortalStudentsProvider");
  }
  return ctx;
}
