import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { getNetworkErrorMessage } from "../utils/errorUtils";

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    role: string;
    roles: string;
  } | null;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  resetPassword: (
    email: string,
    token: string,
    newPassword: string
  ) => Promise<boolean>;
  refreshAccessToken: () => Promise<string | null>;
  loading: boolean;
}

// Helper function để check role từ string
const hasRole = (userRoles: string, targetRole: string): boolean => {
  if (!userRoles) return false;
  return userRoles.includes(targetRole);
};

// Helper function để lấy primary role
const getPrimaryRole = (userRoles: string): string => {
  if (!userRoles) return "USER";
  if (hasRole(userRoles, "OWNER")) return "OWNER";
  if (hasRole(userRoles, "ADMIN")) return "ADMIN";
  return "USER";
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    name: string;
    email: string;
    role: string;
    roles: string;
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

  // LOGIN - Thay thế function login hiện tại
  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_URL + "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        // Sử dụng error handling đơn giản
        let errorMessage = "Email hoặc mật khẩu không chính xác!";

        if (res.status === 403) {
          errorMessage = "Tài khoản không có quyền truy cập Admin Panel!";
        } else if (res.status === 423) {
          errorMessage = "Tài khoản đã bị khóa tạm thời!";
        } else if (res.status === 429) {
          errorMessage = "Đăng nhập quá nhiều lần, vui lòng thử lại sau!";
        }

        return { success: false, error: errorMessage };
      }

      const result = await res.json();
      const { token, email: userEmail, role, tokenType } = result.data || {};

      if (!token || !userEmail) {
        return { success: false, error: "Phản hồi từ server không hợp lệ" };
      }

      // Check admin access
      const cleanRole = role ? role.replace(/\[|\]/g, "") : "";
      const hasAdminAccess =
        cleanRole.includes("ADMIN") || cleanRole.includes("OWNER");

      if (!hasAdminAccess) {
        return {
          success: false,
          error: "Tài khoản không có quyền truy cập Admin Panel!",
        };
      }

      const userData = {
        name: userEmail.split("@")[0] || "Admin User",
        email: userEmail,
        role: cleanRole,
        roles: cleanRole, 
      };

      setIsAuthenticated(true);
      setUser(userData);

      const authData = {
        user: userData,
        token,
        tokenType,
        refreshToken: null,
        timestamp: Date.now(),
      };

      if (rememberMe) {
        localStorage.setItem("adminAuth", JSON.stringify(authData));
        sessionStorage.removeItem("adminAuth");
      } else {
        sessionStorage.setItem("adminAuth", JSON.stringify(authData));
        localStorage.removeItem("adminAuth");
      }

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: getNetworkErrorMessage() || "Đã xảy ra lỗi mạng!",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await fetch(import.meta.env.VITE_API_URL + "/api/auth/logout", {
        method: "POST",
        credentials: "include",
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
       const localAuth = localStorage.getItem("adminAuth");
       const sessionAuth = sessionStorage.getItem("adminAuth");
       const authData = localAuth || sessionAuth;

       if (!authData) return null;

       const { token: currentToken } = JSON.parse(authData);
       if (!currentToken) return null;

       // ✅ Gửi current token để refresh (một số BE dùng access token để refresh)
       const res = await fetch(
         import.meta.env.VITE_API_URL + "/api/auth/refresh-token",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
             Authorization: `Bearer ${currentToken}`, // ← Thêm current token
           },
           credentials: "include",
           body: JSON.stringify({
             token: currentToken, // ← Hoặc trong body
           }),
         }
       );

       if (!res.ok) {
         console.log("Refresh failed with status:", res.status);
         return null;
       }

       const result = await res.json();
       console.log("Refresh response:", result);

       const newToken = result?.data?.accessToken || result?.data?.token;

       if (!newToken) return null;

       // Update token
       const parsedAuthData = JSON.parse(authData);
       parsedAuthData.token = newToken;

       if (localAuth) {
         localStorage.setItem("adminAuth", JSON.stringify(parsedAuthData));
       } else {
         sessionStorage.setItem("adminAuth", JSON.stringify(parsedAuthData));
       }

       return newToken;
     } catch (err) {
       console.error("Error refreshing token:", err);
       return null;
     }
  };
  
  // RESET PASSWORD
  const resetPassword = async (
    email: string,
    token: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error("Reset password error:", error);
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
        resetPassword,
        refreshAccessToken,
        loading,
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

// Export helper functions để sử dụng trong components
export { hasRole, getPrimaryRole };
