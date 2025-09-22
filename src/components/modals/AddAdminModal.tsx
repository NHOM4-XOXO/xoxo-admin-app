import { useState } from "react";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useCreateAdminMutation } from "../../api/userApi";

interface AddAdminModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAdminModal({
  onClose,
  onSuccess,
}: AddAdminModalProps) {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Mật khẩu phải có chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Họ không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const translateError = (errorMessage: string): string => {
    const message = errorMessage.toLowerCase();

    const errorTranslations: { [key: string]: string } = {
      "email already exists": "Email đã tồn tại!",
      "invalid email": "Email không hợp lệ!",
      "password too weak": "Mật khẩu quá yếu.",
      unauthorized: "Bạn không có quyền thực hiện hành động này!",
      "user not found": "Không tìm thấy người dùng.",
      "invalid password": "Mật khẩu không hợp lệ!",
      "server error": "Lỗi máy chủ. Vui lòng thử lại sau!",
    };

    for (const [englishError, vietnameseError] of Object.entries(
      errorTranslations
    )) {
      if (message.includes(englishError)) {
        return vietnameseError;
      }
    }

    return errorMessage; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await createAdmin(formData).unwrap();
      setIsSuccess(true); 
      setTimeout(() => {
        onSuccess();
      }, 5000);
    } catch (error: any) {
      let errorMessage = "Tạo tài khoản admin thất bại";

      if (error?.data?.message) {
        errorMessage = translateError(error.data.message);
      }

      setErrors({ submit: errorMessage });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-6 border w-96 shadow-lg rounded-md bg-white">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tạo tài khoản thành công!
            </h3>
            <p className="text-gray-600 mb-4">
              Tài khoản ADMIN đã được tạo thành công cho{" "}
              <span className="font-medium">
                {formData.firstName} {formData.lastName}
              </span>
            </p>
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">Email:</span> {formData.email}
              </p>
              <p className="text-sm text-green-700">
                <span className="font-medium">Role:</span> ADMIN
              </p>
            </div>
            <button
              onClick={onSuccess}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Tạo tài khoản Admin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="admin@xoxo.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập tên"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập họ"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {isLoading ? "Đang tạo..." : "Tạo Admin"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
