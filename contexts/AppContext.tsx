import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import apiService, { AuthResponse, TokenStorage } from "../services/apiService";

interface AppContextType {
  user: AuthResponse["user"] | null;
  token: string | null;
  setUser: (user: AuthResponse["user"] | null) => void;
  setToken: (token: string | null) => void;
  attemptId: string | null;
  paperId: string | null;
  setAttemptId: (id: string | null) => void;
  setPaperId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [paperId, setPaperId] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await TokenStorage.getToken();
        if (storedToken) {
          setToken(storedToken);
          const userData = await apiService.getMe();
          setUser(userData);
        }
      } catch (err) {
        Alert.alert("Error", "Failed to load user data");
      }
    };
    loadAuth();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken,
        attemptId,
        setAttemptId,
        paperId,
        setPaperId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
