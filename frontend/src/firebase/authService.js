import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

import { auth } from "./auth";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const registerUser = async ({ name, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  const user = userCredential.user;

  await updateProfile(user, {
    displayName: name.trim(),
  });

  await sendEmailVerification(user);
  await signOut(auth);

  return user;
};

export const loginUser = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await userCredential.user.reload();

  if (!auth.currentUser?.emailVerified) {
    await sendEmailVerification(userCredential.user);
    await signOut(auth);
    throw new Error(
      "Please verify your email before logging in. We sent a new verification email."
    );
  }

  return auth.currentUser;
};

export const resendVerificationEmail = async ({ email, password }) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  await userCredential.user.reload();

  if (userCredential.user.emailVerified) {
    await signOut(auth);
    return { alreadyVerified: true };
  }

  await sendEmailVerification(userCredential.user);
  await signOut(auth);

  return { alreadyVerified: false };
};

export const resetPassword = ({ email }) => {
  return sendPasswordResetEmail(auth, email.trim());
};

export const logoutUser = () => signOut(auth);

export const googleLogin = async () => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
