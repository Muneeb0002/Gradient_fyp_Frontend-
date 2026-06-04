import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import InputField from "../../../components/auth/InputField";
import PrimaryButton from "../../../components/auth/PrimaryButton";
import AdminScreenShell from "../../../components/admin/AdminScreenShell";
import PortalPageHeader from "../../../components/admin/PortalPageHeader";
import SectionCard from "../../../components/shared/SectionCard";
import { PORTAL_ALERTS } from "../../../constants/portalAlertMessages";
import Colors from "../../../constants/Colors";
import Typography from "../../../constants/Typography";
import {
  validatePortalAdminEmail,
  validatePortalAdminName,
  validateStudentSignupPassword,
} from "../../../lib/formValidation";
import { usePortalAdmins } from "../../../src/context/PortalAdminsContext";
import usePortalAlert from "../../../src/hooks/usePortalAlert";

const STEPS = ["Identity", "Credentials", "Review"];

export default function CreateAdminScreen() {
  const router = useRouter();
  const { addAdmin } = usePortalAdmins();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { showAlert, AlertModal } = usePortalAlert();
  const [submitting, setSubmitting] = useState(false);

  const validateStep = (index = step) => {
    const next = {};
    if (index === 0) {
      const firstErr = validatePortalAdminName(form.firstName, "First name");
      const lastErr = validatePortalAdminName(form.lastName, "Last name");
      if (firstErr) next.firstName = firstErr;
      if (lastErr) next.lastName = lastErr;
    }
    if (index === 1) {
      const emailErr = validatePortalAdminEmail(form.email);
      const passErr = validateStudentSignupPassword(form.password);
      if (emailErr) next.email = emailErr;
      if (passErr) next.password = passErr;
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    if (!validateStep(0) || !validateStep(1)) return;
    setSubmitting(true);
    setTimeout(() => {
      addAdmin(form);
      setSubmitting(false);
      const name = `${form.firstName} ${form.lastName}`;
      const { title, message } = PORTAL_ALERTS.adminCreated(name);
      showAlert(title, message, "Done", () =>
        router.replace("/super-admin/admins"),
      );
    }, 500);
  };

  return (
    <AdminScreenShell>
      <PortalPageHeader
        title="Create administrator"
        subtitle="Step-by-step onboarding"
        icon="account-plus"
        accent={Colors.accent}
        onBack={() => router.back()}
      />

      <View style={styles.stepper}>
        {STEPS.map((label, index) => (
          <View key={label} style={styles.stepItem}>
            <View
              style={[
                styles.stepDot,
                index <= step && styles.stepDotActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNum,
                  index <= step && styles.stepNumActive,
                ]}
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepLabel,
                index === step && styles.stepLabelActive,
              ]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      {step === 0 ? (
        <SectionCard label="Personal details" icon="account-outline">
          <InputField
            label="First name"
            placeholder="First name"
            value={form.firstName}
            onChangeText={(t) => {
              setForm((f) => ({ ...f, firstName: t }));
              setErrors((e) => ({ ...e, firstName: "" }));
            }}
            error={errors.firstName}
          />
          <InputField
            label="Last name"
            placeholder="Last name"
            value={form.lastName}
            onChangeText={(t) => {
              setForm((f) => ({ ...f, lastName: t }));
              setErrors((e) => ({ ...e, lastName: "" }));
            }}
            error={errors.lastName}
          />
        </SectionCard>
      ) : null}

      {step === 1 ? (
        <SectionCard label="Login credentials" icon="lock-outline">
          <InputField
            label="Work email"
            placeholder="name@gradient.com"
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
            label="Temporary password"
            placeholder="Minimum 6 characters"
            secureTextEntry
            passwordToggle
            value={form.password}
            onChangeText={(t) => {
              setForm((f) => ({ ...f, password: t }));
              setErrors((e) => ({ ...e, password: "" }));
            }}
            error={errors.password}
          />
          <Text style={styles.hint}>
            Use a @gradient.com address. Password: minimum 8 characters and one special
            character (@$!%*?&), same as student sign up.
          </Text>
        </SectionCard>
      ) : null}

      {step === 2 ? (
        <SectionCard label="Review" icon="clipboard-check-outline">
          <ReviewRow icon="account" label="Name" value={`${form.firstName} ${form.lastName}`} />
          <ReviewRow icon="email-outline" label="Email" value={form.email} />
          <ReviewRow icon="key-outline" label="Password" value="••••••••" />
        </SectionCard>
      ) : null}

      <View style={styles.actions}>
        {step > 0 ? (
          <PrimaryButton
            title="Back"
            handlePress={() => setStep((s) => Math.max(0, s - 1))}
          />
        ) : null}
        <PrimaryButton
          title={
            submitting
              ? "Creating..."
              : step === STEPS.length - 1
                ? "Create administrator"
                : "Continue"
          }
          handlePress={goNext}
          isLoading={submitting}
        />
      </View>

      <AlertModal />
    </AdminScreenShell>
  );
}

function ReviewRow({ icon, label, value }) {
  return (
    <View style={reviewStyles.row}>
      <MaterialCommunityIcons name={icon} size={20} color={Colors.accent} />
      <View style={reviewStyles.text}>
        <Text style={reviewStyles.label}>{label}</Text>
        <Text style={reviewStyles.value}>{value}</Text>
      </View>
    </View>
  );
}

const reviewStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
  },
  text: { marginLeft: 12, flex: 1 },
  label: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  value: {
    color: Colors.white,
    marginTop: 2,
    fontSize: 15,
    fontWeight: "600",
  },
});

const styles = StyleSheet.create({
  stepper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  stepItem: { alignItems: "center", flex: 1 },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  stepNum: { color: Colors.textMuted, fontWeight: "800", fontSize: 13 },
  stepNumActive: { color: Colors.white },
  stepLabel: {
    color: Colors.textMuted,
    fontSize: 10,
    marginTop: 6,
    fontWeight: "600",
  },
  stepLabelActive: { color: Colors.accent },
  hint: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
    fontWeight: "500",
  },
  actions: { marginTop: 8, gap: 0 },
});
