import React, { useEffect } from "react";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Eye,
  EyeOff,
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const { login, user } = useAuth();
  const location = useLocation();
  const successMessage = location.state?.message;

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  // Nếu đang loading hoặc đã có user, hiện loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="dist/xoxo-lg.png"
              alt="XOXO Logo"
              className="h-16 w-auto mx-auto"
            />
          </div>

          {/* Loading Animation */}
          <div className="relative mb-6">
            {/* Outer spinning ring */}
            <div className="w-16 h-16 mx-auto border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>

            {/* Inner pulsing dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Đang kiểm tra đăng nhập...
            </h2>
            <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
          </div>

          {/* Loading Dots Animation */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setError("");
    setErrorEmail("");

    // Validation
    if (!email.trim()) {
      setErrorEmail("Email không được để trống");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorEmail("Email không hợp lệ");
      return;
    }

    if (!password) {
      setError("Mật khẩu không được để trống");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email, password);

      // AuthContext always returns { success, error? }
      if (result.success) {
        // Keep loading for navigation - AuthContext will handle redirect
      } else {
        setLoading(false);
        setError(result.error || "Đăng nhập thất bại!");
      }
    } catch (error: any) {
      setLoading(false);

      if (error?.message) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("Đã xảy ra lỗi không mong muốn!");
      }
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Chào mừng trở lại
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Đăng nhập vào bảng điều khiển quản trị
            </p>
          </div>
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-600 text-sm">{successMessage}</span>
            </div>
          )}
          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Địa chỉ email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!isValidEmail(e.target.value)) {
                        setErrorEmail("Email không hợp lệ");
                      } else {
                        setErrorEmail("");
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                {errorEmail && (
                  <div className=" text-red-600 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                    <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                    <span>{errorEmail}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="off"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me */}
            {/* <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
            </div> */}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center space-x-2">
                <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Đăng nhập</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Bằng cách đăng nhập, bạn đồng ý với{" "}
              <a
                href="/terms-of-service"
                className="text-blue-600 hover:text-blue-500"
              >
                Điều khoản dịch vụ
              </a>{" "}
              và{" "}
              <a
                href="/privacy-policy"
                className="text-blue-600 hover:text-blue-500"
              >
                Chính sách bảo mật
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Floating elements */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/60 rounded-full animate-bounce delay-300"></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400/60 rounded-full animate-bounce delay-700"></div>
            <div className="absolute bottom-2/3 left-1/2 w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce delay-1000"></div>
            <div className="absolute top-2/3 right-1/6 w-5 h-5 bg-pink-400/40 rounded-full animate-bounce delay-500"></div>
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="text-center max-w-lg">
              {/* Main illustration */}
              <div className="mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Shield className="h-16 w-16 text-white" />
                </div>
              </div>

              <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Quản lý mạng xã hội
                <br />
                <span className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  một cách thông minh
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Bảng điều khiển quản trị mạnh mẽ giúp bạn quản lý người dùng,
                nội dung và báo cáo một cách hiệu quả.
              </p>

              {/* Feature cards */}
              <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Quản lý người dùng
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 delay-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Kiểm duyệt nội dung
                  </span>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 delay-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    Báo cáo chi tiết
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showForgotPasswordModal && (
        <ForgotPasswordModal
          onClose={() => setShowForgotPasswordModal(false)}
        />
      )}
    </div>
  );
}
