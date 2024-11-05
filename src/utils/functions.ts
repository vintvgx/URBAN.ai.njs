export function getUserInitials(
  displayName: string | null | undefined
): string {
  if (displayName) {
    const names = displayName.split(" ");
    const initials = names.map((name) => name.charAt(0).toUpperCase());
    return initials.join("");
  }
  return "U"; // default initials if user or display name is not available
}
