import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { AuthPayload, handleAuthResponse, UserData } from "./types";
import { format } from "pretty-format";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export function useAuth() {
  const { data: user } = useQuery<UserData | null>({
    queryKey: ["auth"],
    queryFn: () =>
      new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            return handleAuthResponse(user);
          } else {
            resolve(null);
          }
        });
      }),
  });

  return { user, isAuthenticated: !!user };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: AuthPayload) => {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return handleAuthResponse(result);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);

      //TODO: Update functionality
      /*
       * 1. Log will be display in a pop up
       * 2. Clear pop up and reload window state to update user status
       */
      // router.push("/chatview");
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: AuthPayload) => {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return handleAuthResponse(result);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);

      //TODO: Update functionality
      /*
       * 1. Log will be display in a pop up
       * 2. Clear pop up and reload window state to update user status
       */
      // router.push("/chatview");
    },
  });
}

export function useGoogleSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        const result = await signInWithPopup(auth, googleProvider);

        // Transform Firebase user into UserData structure
        // const userInfo: UserData = {
        //   uid: result.user.uid,
        //   email: result.user.email,
        //   displayName: result.user.displayName,
        //   photoURL: result.user.photoURL,
        //   phoneNumber: result.user.phoneNumber,
        // };

        // console.log(
        //   "🚀 ~ file: hooks.ts:115 ~ mutationFn: ~ userInfo:",
        //   format(result.user)
        // );

        const goog = handleAuthResponse(result);

        console.log(
          "🚀 ~ file: hooks.ts:118 ~ mutationFn: ~ auth:",
          format(goog)
        );

        return goog;
      } catch (error) {
        console.error("Google sign in error:", error);
        throw error;
      }
    },
    onSuccess: (userInfo) => {
      queryClient.setQueryData(["auth"], userInfo);
    },
  });
}

// TODO: Implement Facebook sign in
export function useFacebookSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await signInWithPopup(auth, facebookProvider);
      return handleAuthResponse(result);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);

      //TODO: Update functionality
      /*
       * 1. Log will be display in a pop up
       * 2. Clear pop up and reload window state to update user status
       */
      // router.push("/chatview");
    },
  });
}

// TODO: Implement Github sign in
export function useGithubSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await signInWithPopup(auth, githubProvider);
      return handleAuthResponse(result);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["auth"], user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await signOut(auth);
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);

      //TODO: Update functionality
      /*
       * 1. When user logs out, ensure all data is cleared from the database
       * 2. Clear pop up and reload window state to update user status
       */
      // router.push("/chatview");
    },
  });
}
