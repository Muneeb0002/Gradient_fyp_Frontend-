import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import InputField from "../../../components/auth/InputField";
import PrimaryButton from "../../../components/auth/PrimaryButton";
import AdminScreenShell from "../../../components/admin/AdminScreenShell";
import PortalPageHeader from "../../../components/admin/PortalPageHeader";
import SectionCard from "../../../components/shared/SectionCard";
import Colors from "../../../constants/Colors";
import { PORTAL_ALERTS } from "../../../constants/portalAlertMessages";
import {
  validatePortalAdminName,
  validateStudentEmail,
  validateStudentSignupPassword,
} from "../../../lib/formValidation";
import { usePortalStudents } from "../../../src/context/PortalStudentsContext";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

export default function EditStudentScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { students, updateStudent, updateStudentPassword } = usePortalStudents();
  const student = useMemo(
    () => students.find((s) => s.id === id),
    [students, id],
  );

  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [password, setPassword] = useState("");
  const [passError, setPassError] = useState("");
  const { showAlert, AlertModal } = usePortalAlert();

  useEffect(() => {
    if (!student) return;
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      isVerified: student.isVerified,
    });
  }, [student?.id]);

  if (!student) {
    return (
      <AdminScreenShell>
        <PortalPageHeader
          title="Student"
          subtitle="Not found"
          icon="alert-circle-outline"
          onBack={() => router.back()}
        />
        <Text style={styles.missing}>This student could not be found.</Text>
      </AdminScreenShell>
    );
  }

  if (!form) {
    return <AdminScreenShell />;
  }

  const saveProfile = () => {
    const next = {};
    const f = validatePortalAdminName(form.firstName, "First name");
    const l = validatePortalAdminName(form.lastName, "Last name");
    const e = validateStudentEmail(form.email);
    if (f) next.firstName = f;
    if (l) next.lastName = l;
    if (e) next.email = e;
    setErrors(next);
    if (Object.keys(next).length) return;

    updateStudent(id, form);
    const name = `${form.firstName} ${form.lastName}`;
    if (password.trim()) {
      const pErr = validateStudentSignupPassword(password);
      if (pErr) {
        setPassError(pErr);
        return;
      }
      updateStudentPassword(id, password);
      const { title, message } = PORTAL_ALERTS.passwordUpdated(name);
      showAlert(title, message, "Done", () => router.back());
      return;
    }
    const { title, message } = PORTAL_ALERTS.studentUpdated(name);
    showAlert(title, message, "Done", () => router.back());
  };

  return (
    <AdminScreenShell>
      <PortalPageHeader
        title={`${student.firstName} ${student.lastName}`}
        subtitle="Edit student record"
        icon="account-edit"
        accent="#60A5FA"
        onBack={() => router.back()}
      />

      <SectionCard label="Profile" icon="account-outline">
        <InputField
          label="First name"
          value={form.firstName}
          onChangeText={(t) => setForm((f) => ({ ...f, firstName: t }))}
          error={errors.firstName}
        />
        <InputField
          label="Last name"
          value={form.lastName}
          onChangeText={(t) => setForm((f) => ({ ...f, lastName: t }))}
          error={errors.lastName}
        />
        <InputField
          label="Email"
          value={form.email}
          onChangeText={(t) => setForm((f) => ({ ...f, email: t }))}
          autoCapitalize="none"
          error={errors.email}
        />
        <Pressable
          onPress={() => setForm((f) => ({ ...f, isVerified: !f.isVerified }))}
          style={styles.verifyRow}
        >
          <MaterialCommunityIcons
            name={form.isVerified ? "check-circle" : "clock-outline"}
            size={20}
            color={form.isVerified ? Colors.accent : Colors.textMuted}
          />
          <Text style={styles.verifyLabel}>
            {form.isVerified ? "Verified account" : "Pending verification"}
          </Text>
        </Pressable>
      </SectionCard>

      <SectionCard label="Password" icon="lock-outline" style={styles.gap}>
        <InputField
          label="New password (optional)"
          secureTextEntry
          passwordToggle
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setPassError("");
          }}
          error={passError}
        />
      </SectionCard>

      <PrimaryButton title="Save changes" handlePress={saveProfile} />

      <AlertModal />
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  missing: { color: Colors.textMuted, textAlign: "center", marginTop: 24 },
  verifyRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  verifyLabel: { color: Colors.textSecondary, fontWeight: "600" },
  gap: { marginTop: 14 },
});
