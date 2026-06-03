import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { getAuthRole } from "../../lib/authSession";

export default function useAuthRole() {
  const [role, setRole] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getAuthRole().then(setRole);
    }, []),
  );

  return role;
}
