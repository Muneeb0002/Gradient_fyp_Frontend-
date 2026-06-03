import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { MOCK_ADMINS } from "../../constants/adminPortalData";

const PortalAdminsContext = createContext(null);

let nextId = 100;

export function PortalAdminsProvider({ children }) {
  const [admins, setAdmins] = useState(MOCK_ADMINS);

  const addAdmin = useCallback((payload) => {
    const entry = {
      id: String(++nextId),
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: payload.email.trim().toLowerCase(),
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    setAdmins((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const removeAdmin = useCallback((id) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const resetAdmins = useCallback(() => {
    setAdmins(MOCK_ADMINS);
  }, []);

  const value = useMemo(
    () => ({ admins, addAdmin, removeAdmin, resetAdmins }),
    [admins, addAdmin, removeAdmin, resetAdmins],
  );

  return (
    <PortalAdminsContext.Provider value={value}>
      {children}
    </PortalAdminsContext.Provider>
  );
}

export function usePortalAdmins() {
  const ctx = useContext(PortalAdminsContext);
  if (!ctx) {
    throw new Error("usePortalAdmins must be used within PortalAdminsProvider");
  }
  return ctx;
}
