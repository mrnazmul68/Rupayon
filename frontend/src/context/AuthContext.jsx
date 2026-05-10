import { useEffect, useMemo, useState } from "react";
import {
  googleLogin,
  loginUser,
  logoutUser,
  onAuthChange,
  registerUser,
  resendVerificationEmail,
  resetPassword,
} from "../firebase/authService";
import { AuthContext } from "./authContext";
import { usersApi } from "../services/api.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const syncUserToDatabase = async (firebaseUser) => {
    if (!firebaseUser) return null;
    try {
      const response = await usersApi.sync({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        avatar: firebaseUser.photoURL,
      });
      return response.user;
    } catch (err) {
      console.error("Error syncing user:", err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        await firebaseUser.reload();
        const dbUserData = await syncUserToDatabase(firebaseUser);
        setDbUser(dbUserData);
      } else {
        setDbUser(null);
      }

      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo(
    () => ({
      user,
      dbUser,
      loading,
      registerUser,
      loginUser,
      googleLogin,
      logoutUser,
      resendVerificationEmail,
      resetPassword,
    }),
    [user, dbUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
