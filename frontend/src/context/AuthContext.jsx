import { useEffect, useMemo, useState } from "react";
import {
  googleLogin,
  loginUser,
  logoutUser,
  onAuthChange,
  registerUser,
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
      const cleanEmail = firebaseUser.email?.trim().toLowerCase();
      const pendingSignupNames = JSON.parse(
        localStorage.getItem("rupayonSignupNames") || "{}"
      );
      const pendingName = cleanEmail ? pendingSignupNames[cleanEmail] : "";
      const response = await usersApi.sync({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: pendingName || firebaseUser.displayName || firebaseUser.email.split("@")[0],
        avatar: firebaseUser.photoURL,
      });

      if (pendingName && cleanEmail) {
        delete pendingSignupNames[cleanEmail];
        localStorage.setItem("rupayonSignupNames", JSON.stringify(pendingSignupNames));
      }

      return response.user;
    } catch (err) {
      console.error("Error syncing user:", err);
      return null;
    }
  };

  const refreshDbUser = async () => {
    if (!user?.uid) return null;

    const response = await usersApi.getById(user.uid);
    setDbUser(response.user);
    return response.user;
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
      resetPassword,
      refreshDbUser,
      setDbUser,
    }),
    [user, dbUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
