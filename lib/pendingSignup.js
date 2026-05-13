/** In-memory payload between signup form and signup OTP (avoid password in URL). */
let pendingSignup = null;

export function setPendingSignup(payload) {
  pendingSignup = payload;
}

export function getPendingSignup() {
  return pendingSignup;
}

export function clearPendingSignup() {
  pendingSignup = null;
}
