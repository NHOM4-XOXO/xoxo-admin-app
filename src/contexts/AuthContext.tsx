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
  refreshAccessToken: () => Promise<string | null>;
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

  useEffect(() => {
    const checkAuthState = () => {
      try {
        const savedAuth = localStorage.getItem("adminAuth");
        const sessionAuth = sessionStorage.getItem("adminAuth");

        const authData = savedAuth || sessionAuth;

        if (authData) {
          const { user: savedUser, token } = JSON.parse(authData);

          if (savedUser && token) {
            setIsAuthenticated(true);
            setUser(savedUser);
          } else {
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

  // LOGIN
const login = async (
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<boolean> => {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL + "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // để BE set cookie refreshToken
    });

    if (!res.ok) return false;

    const result = await res.json();
    const { token, email: userEmail, role, tokenType } = result.data || {};

    if (!token || !userEmail) return false;

    // Kiểm tra role có phải admin không
    const cleanRole = role ? role.replace(/\[|\]/g, "") : "USER";
    const allowedRoles = ["ADMIN", "OWNER"];

    if (!allowedRoles.includes(cleanRole)) {
      throw new Error("ROLE_NOT_ALLOWED");
    }

    const userData = {
      name: userEmail.split("@")[0] || "unknown",
      email: userEmail,
      role: cleanRole,
    };

    setIsAuthenticated(true);
    setUser(userData);

    const authData = {
      user: userData,
      token,
      tokenType,
      timestamp: Date.now(),
    };

    if (rememberMe) {
      localStorage.setItem("adminAuth", JSON.stringify(authData));
    } else {
      sessionStorage.setItem("adminAuth", JSON.stringify(authData));
    }

    return true;
  } catch (error) {
    console.error("Login error:", error);
    // Ném lỗi lên để LoginPage có thể bắt và xử lý
    if (error instanceof Error && error.message === "ROLE_NOT_ALLOWED") {
      throw error;
    }
    return false;
  }
};

  // LOGOUT
  const logout = async () => {
    try {
      await fetch(import.meta.env.VITE_API_URL + "/api/auth/logout", {
        method: "POST",
        credentials: "include", // BẮT BUỘC để gửi cookie refreshToken
      });
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("adminAuth");
      sessionStorage.removeItem("adminAuth");
    }
  };

  // REFRESH TOKEN
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include", 
        }
      );

      if (!res.ok) return null;

      const result = await res.json();
      const newToken = result?.data?.accessToken; 

      if (!newToken) return null;

      // Cập nhật token mới vào storage
      const authData =
        JSON.parse(localStorage.getItem("adminAuth")!) ||
        JSON.parse(sessionStorage.getItem("adminAuth")!);

      if (authData) {
        authData.token = newToken;

        if (localStorage.getItem("adminAuth")) {
          localStorage.setItem("adminAuth", JSON.stringify(authData));
        } else {
          sessionStorage.setItem("adminAuth", JSON.stringify(authData));
        }
      }

      return newToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  // MOCK RESET PASSWORD
  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    console.log(
      `Mock Reset Password: Email: ${email}, Token: ${token}, New Password: ${newPassword}`
    );

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
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        resetPassword,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
