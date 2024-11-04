export interface UserData {
  // Required fields that are always present
  uid: string;
  email: string | null;
  displayName: string | null;

  // Optional fields that may be present
  photoURL: string | null;
  phoneNumber: string | null;

  // Authentication specific fields
  emailVerified?: boolean;
  isAnonymous?: boolean;

  // Metadata fields
  createdAt?: string;
  lastLoginAt?: string;

  // Access token related fields (if needed)
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}

export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}
