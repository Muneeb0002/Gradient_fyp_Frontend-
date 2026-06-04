/**
 * Local portal sign-in for UI testing (no API).
 * Remove or gate behind __DEV__ before production release.
 */
export const PORTAL_TEST_ADMIN = {
  email: "admin1@gradient.com",
  password: "ABC123.@",
  role: "admin",
  token: "portal-admin-session",
  user: {
    _id: "portal-admin-1",
    firstName: "Portal",
    lastName: "Admin",
    email: "admin1@gradient.com",
    role: "admin",
    joinedAt: "1 Jun 2025",
  },
};

export const PORTAL_TEST_SUPER_ADMIN = {
  email: "Gradiant@gradient.com",
  password: "ABC123.@",
  role: "super-admin",
  user: {
    displayName: "Super Administrator",
    email: "Gradiant@gradient.com",
    role: "super-admin",
  },
};

const ACCOUNTS = [PORTAL_TEST_ADMIN, PORTAL_TEST_SUPER_ADMIN];

export function matchPortalLogin(email, password) {
  const normalized = String(email ?? "").trim().toLowerCase();
  const pass = String(password ?? "");

  const account = ACCOUNTS.find(
    (a) => a.email.toLowerCase() === normalized && a.password === pass,
  );

  if (!account) return null;

  return {
    success: true,
    message: "Login successful",
    role: account.role,
    user: account.user,
    token: account.token ?? null,
  };
}
