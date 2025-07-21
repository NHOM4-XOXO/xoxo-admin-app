import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

// Schema for password validation
const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .required("Mật khẩu mới là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .matches(/[a-z]/, "Mật khẩu phải chứa ít nhất một chữ cái thường")
    .matches(/[A-Z]/, "Mật khẩu phải chứa ít nhất một chữ cái hoa")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
    ),
  confirmPassword: yup
    .string()
    .required("Xác nhận mật khẩu là bắt buộc")
    .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp"),
});

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    const emailFromUrl = searchParams.get("email");
    if (tokenFromUrl && emailFromUrl) {
      setToken(tokenFromUrl);
      setEmail(emailFromUrl);
    } else {
      setMessage("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
      setIsSuccess(false);
    }
  }, [searchParams]);

  const onSubmit = async (data: yup.InferType<typeof passwordSchema>) => {
    if (!token || !email) {
      setMessage("Liên kết đặt lại mật khẩu không hợp lệ.");
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const success = await resetPassword(email, token, data.newPassword);

      if (success) {
        setMessage("Mật khẩu của bạn đã được đặt lại thành công!");
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(
          "Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu liên kết mới."
        );
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Đã xảy ra lỗi, vui lòng thử lại.");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900">Lỗi</h2>
          <p className="text-gray-600">
            {message ||
              "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."}
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center space-y-6">
        <Lock className="mx-auto h-16 w-16 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h2>
        <p className="text-gray-600">Vui lòng nhập mật khẩu mới của bạn.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {/* New Password Field */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-2 text-left"
            >
              Mật khẩu mới
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword")}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600 text-left">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-2 text-left"
            >
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Xác nhận mật khẩu mới"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 text-left">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-xl text-sm flex items-center space-x-2 ${
                isSuccess
                  ? "bg-green-50 border border-green-200 text-green-600"
                  : "bg-red-50 border border-red-200 text-red-600"
              }`}
            >
              {isSuccess ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Đang đặt lại...</span>
              </div>
            ) : (
              <span>Đặt lại mật khẩu</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
