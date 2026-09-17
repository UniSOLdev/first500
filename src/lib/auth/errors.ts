/**
 * Maps Supabase Auth errors to customer-friendly messages.
 * Raw Supabase strings are logged server-side only.
 */
export function mapAuthError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Too many signup attempts right now. Wait a few minutes and try again, or log in if you already created an account.";
  }

  if (
    normalized.includes("already registered") ||
    normalized.includes("already been registered") ||
    normalized.includes("user already exists")
  ) {
    return "An account with this email already exists. Try logging in instead.";
  }

  if (normalized.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email before logging in. Check your inbox for the confirmation link.";
  }

  if (normalized.includes("password") && normalized.includes("least")) {
    return "Password must be at least 6 characters.";
  }

  if (normalized.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  if (normalized.includes("signup is disabled")) {
    return "New signups are temporarily unavailable. Please try again later.";
  }

  return "Something went wrong. Please try again in a moment.";
}
