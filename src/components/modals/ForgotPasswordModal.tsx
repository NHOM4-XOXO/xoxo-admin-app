import React from "react";
import { useState } from "react";
import { X, Mail, Loader2, CheckCircle } from "lucide-react";
import { useForgotPasswordMutation } from "../../api/userApi";

interface ForgotPasswordModalProps {
  onClose: () => void;
}

export default function ForgotPasswordModal({
  onClose,
}: ForgotPasswordModalProps) {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    if (!email.trim()) {
      setMessage("Vui lòng nhập email");
      return;
    }

    try {
      const response = await forgotPassword({ email }).unwrap();

      if (response.statusCode === "200" && response.data) {
        setMessage(response.data); // "Email reset password đã được gửi"
        setIsSuccess(true);

        // Tự động đóng sau 3 giây
        setTimeout(() => {
          onClose();
        }, 3000);
      }
    } catch (error: any) {
      if (error?.data?.message) {
        setMessage(error.data.message);
      } else if (error?.status === 404) {
        setMessage("Email không tồn tại trong hệ thống");
      } else {
        setMessage("Có lỗi xảy ra, vui lòng thử lại");
      }
      setIsSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Quên mật khẩu
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Vui lòng nhập địa chỉ email của bạn. Chúng tôi sẽ gửi cho bạn một liên
          kết để đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập email của bạn"
                disabled={isLoading}
              />
            </div>
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
                <X className="h-4 w-4" />
              )}
              <span>{message}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? "Đang gửi..." : "Gửi liên kết"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
