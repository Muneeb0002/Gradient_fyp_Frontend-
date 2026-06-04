import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import PrimaryButton from "../auth/PrimaryButton";
import SecondaryButton from "../auth/SecondaryButton";
import { backToSubjectHub, SUBJECT_LABEL } from "../../lib/subjectNavigation";

/**
 * Standard footer on subject result screens: ask again + return to subject hub.
 */
export default function SubjectResultActions({
  subject,
  inputHref,
  anotherTitle = "Ask Another Question",
}) {
  const router = useRouter();
  const hubLabel = SUBJECT_LABEL[subject] ?? "Subject";

  return (
    <View style={styles.wrap}>
      <PrimaryButton
        title={anotherTitle}
        handlePress={() => router.replace(inputHref)}
        noMargin
      />
      <SecondaryButton
        title={`Back to ${hubLabel}`}
        handlePress={() => backToSubjectHub(router, subject)}
        noMargin
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 20,
    gap: 12,
  },
});
