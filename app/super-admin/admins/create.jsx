import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AdminScreenShell from "../../../components/admin/AdminScreenShell";
import PortalPageHeader from "../../../components/admin/PortalPageHeader";
import InputField from "../../../components/auth/InputField";
import PrimaryButton from "../../../components/auth/PrimaryButton";
import SectionCard from "../../../components/shared/SectionCard";
import Colors from "../../../constants/Colors";
import {
  validatePortalAdminEmail,
  validatePortalAdminName,
  validateStudentSignupPassword,
} from "../../../lib/formValidation";
import usePortalAlert from "../../../src/hooks/usePortalAlert";


import { useCreateAdmin } from "../../../src/hooks/useFetchAdminUsers";

const STEPS = ["Identity", "Credentials", "Review"];

export default function CreateAdminScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const { showAlert, AlertModal } = usePortalAlert();

  // 1. Mutation hook initialize kiya (isPending real loading state handle karega)
  const { mutate, isPending } = useCreateAdmin();

  useFocusEffect(
    useCallback(() => {
      setStep(0);
      setForm({ firstName: "", lastName: "", email: "", password: "" });
      setErrors({});
    }, []),
  );

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
  mutate(
    {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      createdBy: "Gradiant@gmail.com",
      createdByPass: "ABC123.@",
    },
    {
      onSuccess: (res) => {
        console.log("✅ ADMIN CREATED:", res);

        showAlert(
          "Success",
          res?.message || "Admin created successfully"
        );

        router.back();
      },

      onError: (err) => {
        console.log(
          "❌ ERROR:",
          err?.response?.data
        );

        showAlert(
          "Error",
          err?.response?.data?.message ||
            "Admin create failed"
        );
      },
    }
  );
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
        {step > 0 && !isPending ? (
          <PrimaryButton
            title="Back"
            handlePress={() => setStep((s) => Math.max(0, s - 1))}
          />
        ) : null}
        <PrimaryButton
          title={
            isPending
              ? "Creating..."
              : step === STEPS.length - 1
                ? "Create administrator"
                : "Continue"
          }
          handlePress={goNext}
          isLoading={isPending} // Tanstack query ki default loading pass kar di bhae
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