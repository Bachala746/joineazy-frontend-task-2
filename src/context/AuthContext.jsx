import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { INITIAL_USERS } from "../data/initialData";
import { initializeStorage } from "../utils/initStorage";

const AuthContext = createContext(null);

const TOKEN_KEY = "joineazy_token";
const USER_KEY = "joineazy_current_user";
const USERS_KEY = "joineazy_users";

const createToken = (user) =>
  `joineazy.${btoa(
    JSON.stringify({
      userId: user.id,
      role: user.role,
      issuedAt: Date.now(),
    })
  )}`;

const getSafeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      initializeStorage();

      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);

      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const users = JSON.parse(
          localStorage.getItem(USERS_KEY) || "[]"
        );

        const validUser = users.find(
          (item) => item.id === parsedUser.id
        );

        if (validUser) {
          setUser(getSafeUser(validUser));
        } else {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
        }
      }
    } catch (error) {
      console.error("Session restoration failed:", error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((email, password, role) => {
    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const matchedUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password &&
        item.role === role
    );

    if (!matchedUser) {
      return {
        success: false,
        message: "Invalid email, password, or role.",
      };
    }

    const safeUser = getSafeUser(matchedUser);

    localStorage.setItem(TOKEN_KEY, createToken(matchedUser));
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

    setUser(safeUser);

    return { success: true, user: safeUser };
  }, []);

  const register = useCallback(
    ({ name, email, password, role, department }) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!name?.trim() || !normalizedEmail || !password) {
        return {
          success: false,
          message: "Please complete all required fields.",
        };
      }

      if (password.length < 6) {
        return {
          success: false,
          message: "Password must contain at least 6 characters.",
        };
      }

      if (!["student", "professor"].includes(role)) {
        return {
          success: false,
          message: "Please select a valid role.",
        };
      }

      const users = JSON.parse(
        localStorage.getItem(USERS_KEY) || "[]"
      );

      if (
        users.some(
          (item) => item.email.toLowerCase() === normalizedEmail
        )
      ) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }

      const newUser = {
        id: `user_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        department: department?.trim() || "General",
      };

      const updatedUsers = [...users, newUser];

      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      const safeUser = getSafeUser(newUser);

      localStorage.setItem(TOKEN_KEY, createToken(newUser));
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

      setUser(safeUser);

      return { success: true, user: safeUser };
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const switchDemoRole = useCallback((role) => {
    if (!["student", "professor"].includes(role)) return;

    const users = JSON.parse(
      localStorage.getItem(USERS_KEY) || "[]"
    );

    const demoUser = users.find(
      (item) =>
        item.role === role &&
        item.email.includes("joineazy.com")
    );

    if (!demoUser) return;

    const safeUser = getSafeUser(demoUser);

    localStorage.setItem(TOKEN_KEY, createToken(demoUser));
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));

    setUser(safeUser);
  }, []);

  const value = {
    user,
    currentUser: user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    switchDemoRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
