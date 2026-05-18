import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
} from "firebase/auth";

import { auth } from "./auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const registerUser = async ({ email, password }) => {
  const cleanEmail = email.trim().toLowerCase();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  return userCredential.user;
};

export const loginUser = async ({ email, password }) => {
  const cleanEmail = email.trim().toLowerCase();
  const userCredential = await signInWithEmailAndPassword(
    auth,
    cleanEmail,
    password
  );

  return userCredential.user;
};

export const resetPassword = ({ email }) =>
  sendPasswordResetEmail(auth, email.trim().toLowerCase());

export const logoutUser = () => signOut(auth);

export const googleLogin = async () => {
  await signInWithRedirect(auth, googleProvider);
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
