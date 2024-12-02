export interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthHook {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// export interface AuthResponse {
//   success: boolean;
//   message: string;
// }

// Base user interface with common properties across all auth methods
export interface BaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: UserMetadata;
  providerData: ProviderData[];
}

// Metadata interface for tracking user activity
export interface UserMetadata {
  createdAt: string;
  lastLoginAt: string;
  lastUpdatedAt?: string;
}

// Provider-specific data
export interface ProviderData {
  providerId: string;
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

// Authentication state
export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

// Combined user interface with auth state
export interface UserData extends BaseUser {
  authState: AuthState;
}

// Provider-specific interfaces
export interface GoogleAuthData extends UserData {
  providerData: (ProviderData & {
    providerId: "google.com";
    // Add any Google-specific fields
    googleId?: string;
  })[];
}

export interface GithubAuthData extends UserData {
  providerData: (ProviderData & {
    providerId: "github.com";
    // Add any GitHub-specific fields
    username?: string;
  })[];
}

export interface EmailAuthData extends UserData {
  providerData: (ProviderData & {
    providerId: "password";
  })[];
}

export interface UserSettings {
  showSideBar: boolean;
  userFont: string | undefined;
  assistantFont: string | undefined;
  typewriterEffect: boolean;
  darkMode: boolean;
  compactView: boolean;
}

// Type guard functions to check auth type
export const isGoogleAuth = (user: UserData): user is GoogleAuthData => {
  return user.providerData.some(
    (provider) => provider.providerId === "google.com"
  );
};

export const isGithubAuth = (user: UserData): user is GithubAuthData => {
  return user.providerData.some(
    (provider) => provider.providerId === "github.com"
  );
};

export const isEmailAuth = (user: UserData): user is EmailAuthData => {
  return user.providerData.some(
    (provider) => provider.providerId === "password"
  );
};

// Utility function to transform Firebase user response to UserData
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformFirebaseUser = (firebaseUser: any): UserData => {
  const baseUser: UserData = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    phoneNumber: firebaseUser.phoneNumber,
    emailVerified: firebaseUser.emailVerified,
    isAnonymous: firebaseUser.isAnonymous,
    metadata: {
      createdAt: firebaseUser.createdAt,
      lastLoginAt: firebaseUser.lastLoginAt,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    providerData: firebaseUser.providerData.map((provider: any) => ({
      providerId: provider.providerId,
      uid: provider.uid,
      displayName: provider.displayName,
      email: provider.email,
      phoneNumber: provider.phoneNumber,
      photoURL: provider.photoURL,
    })),
    authState: {
      accessToken: firebaseUser.stsTokenManager?.accessToken ?? null,
      refreshToken: firebaseUser.stsTokenManager?.refreshToken ?? null,
      expiresAt: firebaseUser.stsTokenManager?.expirationTime ?? null,
    },
  };

  return baseUser;
};

// Example usage in your hooks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleAuthResponse = (response: any): UserData => {
  const userData = transformFirebaseUser(response.user);

  if (isGoogleAuth(userData)) {
    // Handle Google-specific data
    return {
      ...userData,
      providerData: userData.providerData.map((provider) => ({
        ...provider,
        googleId: response._tokenResponse?.federatedId,
      })),
    };
  }

  if (isGithubAuth(userData)) {
    // Handle GitHub-specific data
    return {
      ...userData,
      providerData: userData.providerData.map((provider) => ({
        ...provider,
        username: response._tokenResponse?.screenName,
      })),
    };
  }

  return userData;
};
