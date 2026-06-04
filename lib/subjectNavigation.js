/** Subject hub routes — back from results should land here, not on prior questions. */
export const SUBJECT_HUB = {
  economics: "/economics",
  maths: "/maths",
  history: "/history",
  geography: "/geography",
};

export const SUBJECT_LABEL = {
  economics: "Economics",
  maths: "Mathematics",
  history: "History",
  geography: "Geography",
};

export function backToSubjectHub(router, subject) {
  const href = SUBJECT_HUB[subject];
  if (href) router.replace(href);
}

/**
 * Open a result screen without stacking prior results in history.
 */
export function openSubjectResult(router, target) {
  if (typeof target === "string") {
    router.replace(target);
    return;
  }
  router.replace(target);
}
