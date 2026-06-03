export const PORTAL_ALERTS = {
  adminCreated: (name) => ({
    title: "Administrator created",
    message: `${name} has been added to the team and can sign in with the credentials you set.`,
  }),
  adminRemoved: (name) => ({
    title: "Administrator removed",
    message: `${name} has been removed from the administrator team.`,
  }),
  studentAdded: (name) => ({
    title: "Student registered",
    message: `${name} has been added to the platform successfully.`,
  }),
  studentUpdated: (name) => ({
    title: "Student updated",
    message: `Details for ${name} have been saved.`,
  }),
  studentRemoved: (name) => ({
    title: "Student removed",
    message: `${name} has been removed from the student list.`,
  }),
  passwordUpdated: (name) => ({
    title: "Password updated",
    message: `A new password has been set for ${name}. They can use it on their next login.`,
  }),
};
