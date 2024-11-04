import { UserData } from "../lib/auth/types";

export const getUserInitials = (user: UserData | null): string => {
  if (user?.displayName) {
    const names = user.displayName.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join("");
  }
  return "U"; // default initials if user or display name is not available
};
