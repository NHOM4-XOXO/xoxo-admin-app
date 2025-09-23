import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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

        // API trả về data trong result.data
        const data = result.data;

        if (!data || !data.token) {
          return {
            success: false,
            error: "Phản hồi từ server không hợp lệ",
          };
        }

        const userRoles = data.role || "";

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

        // Tạo name từ email (vì API không trả firstName, lastName)
        const emailName = data.email.split("@")[0];
        const displayName =
          emailName.charAt(0).toUpperCase() + emailName.slice(1);

        // Lưu thông tin user
        const userData = {
          name: displayName, // Dùng email làm name
          email: data.email,
          role: primaryRole,
          roles: cleanRoles, // Lưu clean roles
        };

        // Lưu vào localStorage/sessionStorage
        const authData = {
          user: userData,
          token: data.token,
          refreshToken: data.refreshToken || null,
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
        // Xử lý các lỗi HTTP khác nhau
        let errorMessage = "Đăng nhập thất bại!";

        try {
          const errorData = await response.json();

          // Xử lý error message từ API
          if (errorData.message) {
            const message = errorData.message.toLowerCase();
            if (
              message.includes("invalid credentials") ||
              message.includes("wrong password") ||
              message.includes("sai mật khẩu")
            ) {
              errorMessage = "Email hoặc mật khẩu không chính xác!";
            } else if (
              message.includes("user not found") ||
              message.includes("không tìm thấy")
            ) {
              errorMessage = "Tài khoản không tồn tại!";
            } else if (
              message.includes("account disabled") ||
              message.includes("tài khoản bị khóa")
            ) {
              errorMessage = "Tài khoản đã bị khóa!";
            } else {
              errorMessage = errorData.message;
            }
          }
        } catch (parseError) {
          // Nếu không parse được JSON, dùng status code
          if (response.status === 401) {
            errorMessage = "Email hoặc mật khẩu không chính xác!";
          } else if (response.status === 403) {
            errorMessage = "Tài khoản không có quyền truy cập!";
          } else if (response.status === 404) {
            errorMessage = "Tài khoản không tồn tại!";
          } else if (response.status >= 500) {
            errorMessage = "Lỗi máy chủ, vui lòng thử lại sau!";
          }
        }

        return { success: false, error: errorMessage };
      }
    } catch (error) {
      return {
        success: false,
        error: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!",
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
