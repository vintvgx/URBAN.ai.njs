import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { AuthPayload } from "./types";
import { format } from "pretty-format";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export function useAuth() {
  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: () =>
      new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          unsubscribe();
          if (user) {
            // Transform Firebase user into UserInfo structure
            // const userInfo: UserData = {
            //   uid: user.uid,
            //   email: user.email,
            //   displayName: user.displayName,
            //   photoURL: user.photoURL,
            //   phoneNumber: user.phoneNumber,
            // };

            // resolve(userInfo);
            return user;
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
      return result.user;
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
      return result.user;
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

        console.log(
          "🚀 ~ file: hooks.ts:104 ~ mutationFn: ~ result:",
          format(result)
        );

        // Transform Firebase user into UserData structure
        // const userInfo: UserData = {
        //   uid: result.user.uid,
        //   email: result.user.email,
        //   displayName: result.user.displayName,
        //   photoURL: result.user.photoURL,
        //   phoneNumber: result.user.phoneNumber,
        // };

        console.log(
          "🚀 ~ file: hooks.ts:115 ~ mutationFn: ~ userInfo:",
          format(result.user)
        );

        return result.user;
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

export function useFacebookSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await signInWithPopup(auth, facebookProvider);
      return result.user;
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
       * 1. Log will be display in a pop up
       * 2. Clear pop up and reload window state to update user status
       */
      // router.push("/chatview");
    },
  });
}
