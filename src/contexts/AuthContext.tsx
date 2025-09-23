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

  useEffect(() => {
    const checkAuth = () => {
      const localAuth = localStorage.getItem("adminAuth");
      const sessionAuth = sessionStorage.getItem("adminAuth");
      const authData = localAuth || sessionAuth;

      if (authData) {
        try {
          const { user: savedUser, token } = JSON.parse(authData);

          // Kiểm tra user có quyền admin không (từ string roles)
          const userRoles = savedUser.roles || "";

          // QUAN TRỌNG: Nếu roles từ storage chưa được clean, phải clean
          const cleanRoles = userRoles.includes("[")
            ? userRoles.replace(/[\[\]]/g, "")
            : userRoles;

          const hasAdminAccess =
            hasRole(cleanRoles, "ADMIN") || hasRole(cleanRoles, "OWNER");

          if (hasAdminAccess && token) {
            setUser(savedUser);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("adminAuth");
            sessionStorage.removeItem("adminAuth");
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
          localStorage.removeItem("adminAuth");
          sessionStorage.removeItem("adminAuth");
        }
      }
    };

    checkAuth();
  }, []);

  // LOGIN
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();

        // Handle flexible response format: result.data hoặc result trực tiếp
        const data = result.data || result;

        if (!data || !data.token) {
          return {
            success: false,
            error: "Phản hồi từ server không hợp lệ",
          };
        }

        // Lấy roles từ các field có thể: role, roles, hoặc userRoles
        const userRoles = data.role || data.roles || data.userRoles || "";

        // Clean up roles string - bỏ dấu [ ]
        const cleanRoles = userRoles.replace(/[\[\]]/g, "");

        // Check nếu user có role ADMIN hoặc OWNER
        const hasAdminAccess =
          hasRole(cleanRoles, "ADMIN") || hasRole(cleanRoles, "OWNER");

        if (!hasAdminAccess) {
          return {
            success: false,
            error: "Tài khoản của bạn không có quyền truy cập Admin Panel!",
          };
        }

        // Xác định primary role (ưu tiên OWNER)
        const primaryRole = getPrimaryRole(cleanRoles);

        // Tạo name từ nhiều nguồn có thể: name, username, firstName+lastName, hoặc email
        const userName = data.name || 
                        data.username || 
                        (data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : null) ||
                        data.email?.split("@")[0];
        
        const displayName = userName ? 
          (userName.charAt(0).toUpperCase() + userName.slice(1)) : 
          "Admin User";

        // Lưu thông tin user với flexible email field
        const userData = {
          name: displayName,
          email: data.email || data.userEmail || data.emailAddress,
          role: primaryRole,
          roles: cleanRoles, // Lưu clean roles
        };

        // Lưu vào localStorage/sessionStorage với flexible token fields
        const authData = {
          user: userData,
          token: data.token || data.accessToken || data.authToken,
          refreshToken: data.refreshToken || data.refresh_token || null,
        };

        if (rememberMe) {
          localStorage.setItem("adminAuth", JSON.stringify(authData));
        } else {
          sessionStorage.setItem("adminAuth", JSON.stringify(authData));
        }

      setUser(userData);
      setIsAuthenticated(true);
      return { success: true };
    } else {
      // Đối với login, tất cả lỗi đều coi như sai thông tin đăng nhập
      let errorMessage = "Email hoặc mật khẩu không chính xác!";
      
      // Chỉ phân biệt một số trường hợp đặc biệt
      if (response.status === 403) {
        errorMessage = "Tài khoản không có quyền truy cập Admin Panel!";
      } else if (response.status === 423) {
        errorMessage = "Tài khoản đã bị khóa tạm thời!";
      } else if (response.status === 429) {
        errorMessage = "Đăng nhập quá nhiều lần, vui lòng thử lại sau!";
      }

      return { success: false, error: errorMessage };
    }
  } catch (error) {
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
      const localAuth = localStorage.getItem("adminAuth");
      const sessionAuth = sessionStorage.getItem("adminAuth");
      const authData = localAuth || sessionAuth;

      if (authData) {
        const parsedAuthData = JSON.parse(authData);
        parsedAuthData.token = newToken;

        if (localAuth) {
          localStorage.setItem("adminAuth", JSON.stringify(parsedAuthData));
        } else {
          sessionStorage.setItem("adminAuth", JSON.stringify(parsedAuthData));
        }
      }

      return newToken;
    } catch (err) {
      console.error("Error refreshing token:", err);
      return null;
    }
  };

  // RESET PASSWORD (có thể thay bằng API thật)
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
