import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function CreateStudentScreen() {
  const router = useRouter();
  const { addStudent } = usePortalStudents();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    isVerified: true,
  });
  const [errors, setErrors] = useState({});
  const { showAlert, AlertModal } = usePortalAlert();
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    const f = validatePortalAdminName(form.firstName, "First name");
    const l = validatePortalAdminName(form.lastName, "Last name");
    const e = validateStudentEmail(form.email);
    const p = validateStudentSignupPassword(form.password);
    if (f) next.firstName = f;
    if (l) next.lastName = l;
    if (e) next.email = e;
    if (p) next.password = p;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSubmitting(true);
    setTimeout(() => {
      addStudent(form);
      setSubmitting(false);
      const name = `${form.firstName} ${form.lastName}`;
      const { title, message } = PORTAL_ALERTS.studentAdded(name);
      showAlert(title, message, "Done", () => router.back());
    }, 400);
  };

  return (
    <AdminScreenShell>
      <PortalPageHeader
        title="Add student"
        subtitle="Register a new learner"
        icon="account-school"
        accent="#60A5FA"
        onBack={() => router.back()}
      />

      <SectionCard label="Student details" icon="account-plus-outline">
        <InputField
          label="First name"
          value={form.firstName}
          onChangeText={(t) => {
            setForm((f) => ({ ...f, firstName: t }));
            setErrors((e) => ({ ...e, firstName: "" }));
          }}
          error={errors.firstName}
        />
        <InputField
          label="Last name"
          value={form.lastName}
          onChangeText={(t) => {
            setForm((f) => ({ ...f, lastName: t }));
            setErrors((e) => ({ ...e, lastName: "" }));
          }}
          error={errors.lastName}
        />
        <InputField
          label="Email"
          placeholder="student@email.com"
          value={form.email}
          onChangeText={(t) => {
            setForm((f) => ({ ...f, email: t }));
            setErrors((e) => ({ ...e, email: "" }));
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <InputField
          label="Password"
          secureTextEntry
          passwordToggle
          value={form.password}
          onChangeText={(t) => {
            setForm((f) => ({ ...f, password: t }));
            setErrors((e) => ({ ...e, password: "" }));
          }}
          error={errors.password}
        />
        <Pressable
          onPress={() => setForm((f) => ({ ...f, isVerified: !f.isVerified }))}
          style={styles.verifyRow}
        >
          <Text style={styles.verifyLabel}>
            Mark as verified {form.isVerified ? "✓" : ""}
          </Text>
        </Pressable>
      </SectionCard>

      <PrimaryButton
        title={submitting ? "Saving..." : "Add student"}
        handlePress={handleSubmit}
        isLoading={submitting}
      />

      <AlertModal />
    </AdminScreenShell>
  );
}

const styles = StyleSheet.create({
  verifyRow: { marginTop: 8, paddingVertical: 8 },
  verifyLabel: { color: Colors.accent, fontWeight: "700", fontSize: 14 },
});
