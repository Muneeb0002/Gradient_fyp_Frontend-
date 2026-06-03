import { useCallback, useRef, useState } from "react";
import ThemedMessageModal from "../../components/shared/ThemedMessageModal";

export default function usePortalAlert() {
  const [alert, setAlert] = useState(null);
  const onDismissRef = useRef(null);

  const showAlert = useCallback(
    (title, message, confirmLabel = "OK", onDismiss) => {
      onDismissRef.current = onDismiss ?? null;
      setAlert({ title, message, confirmLabel });
    },
    [],
  );

  const hideAlert = useCallback(() => {
    setAlert(null);
    const fn = onDismissRef.current;
    onDismissRef.current = null;
    fn?.();
  }, []);

  const AlertModal = () => (
    <ThemedMessageModal
      visible={!!alert}
      title={alert?.title ?? ""}
      message={alert?.message ?? ""}
      confirmLabel={alert?.confirmLabel ?? "OK"}
      onClose={hideAlert}
    />
  );

  return { showAlert, hideAlert, AlertModal };
}
