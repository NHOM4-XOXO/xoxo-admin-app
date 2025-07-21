import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; role: string } | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  resetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const savedAuth = localStorage.getItem("adminAuth");
        const sessionAuth = sessionStorage.getItem("adminAuth");

        const authData = savedAuth || sessionAuth;

        if (authData) {
          const { user: savedUser } = JSON.parse(authData);

          // TODO: Check if session is still valid (24 hours for localStorage, session for sessionStorage)
          // const isValid = savedAuth
          //   ? Date.now() - timestamp < 24 * 60 * 60 * 1000
          //   : // 24 hours for remember me
          //     true; // Session storage is valid until browser closes

          // In development , we'll always consider the session valid
          const isValid = true;

          if (isValid && savedUser) {
            setIsAuthenticated(true);
            setUser(savedUser);
          } else {
            // Clear expired session
            localStorage.removeItem("adminAuth");
            sessionStorage.removeItem("adminAuth");
          }
        }
      } catch (error) {
        console.error("Error checking auth state:", error);
        localStorage.removeItem("adminAuth");
        sessionStorage.removeItem("adminAuth");
      } finally {
        setLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    // Mock authentication - replace with real API call
    if (email === "admin@example.com" && password === "123") {
      const userData = {
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
      };

      setIsAuthenticated(true);
      setUser(userData);

      // Save auth state based on remember me preference
      const authData = {
        user: userData,
        timestamp: Date.now(),
      };

      if (rememberMe) {
        localStorage.setItem("adminAuth", JSON.stringify(authData));
      } else {
        sessionStorage.setItem("adminAuth", JSON.stringify(authData));
      }

      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("adminAuth");
    sessionStorage.removeItem("adminAuth");
  };

  // TODO: Reset password function
  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    console.log(
      `Mock Reset Password: Email: ${email}, Token: ${token}, New Password: ${newPassword}`
    );

    // Simulate API call success/failure
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "admin@example.com" && token) {
      console.log("Password reset successful for admin@example.com");
      return true;
    } else {
      console.log("Password reset failed: Invalid email or token.");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
