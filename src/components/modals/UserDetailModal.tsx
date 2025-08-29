import {
  FileText,
  User,
  Calendar,
  Shield,
  CheckCircle,
  Ban,
  Clock,
  Pencil,
  X,
} from "lucide-react";
import type { UserType } from "../../types/User.type";

interface UserDetailModalProps {
  user: UserType;
  onClose: () => void;
  onEdit?: (user: UserType) => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const getGenderLabel = (gender?: string) => {
  switch (gender?.toUpperCase()) {
    case "MALE":
      return "Nam";
    case "FEMALE":
      return "Nữ";
    case "OTHER":
      return "Khác";
    default:
      return "Không rõ";
  }
};

export default function UserDetailModal({
  user,
  onClose,
  onEdit,
}: UserDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          <X />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <img
            src={user.avatarUrl || "/default-avatar.png"}
            className="w-20 h-20 rounded-full object-cover"
            alt="Avatar"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-xs text-gray-400">@{user.username}</p>
          </div>
          {onEdit && (
            <button
              onClick={() => onEdit(user)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm border px-3 py-1 rounded-md cursor-pointer"
            >
              <Pencil className="w-4 h-4" /> Sửa
            </button>
          )}
        </div>

        {/* Nội dung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          {user.bio && (
            <div className="flex items-start space-x-2">
              <FileText className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">Giới thiệu:</p>
                <p>{user.bio}</p>
              </div>
            </div>
          )}
          {user.gender && (
            <div className="flex items-start space-x-2">
              <User className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">Giới tính:</p>
                <p>{getGenderLabel(user.gender)}</p>
              </div>
            </div>
          )}
          {user.dateOfBirth && (
            <div className="flex items-start space-x-2">
              <Calendar className="w-4 h-4 mt-1 text-gray-500" />
              <div>
                <p className="font-medium">Ngày sinh:</p>
                <p>{formatDate(user.dateOfBirth)}</p>
              </div>
            </div>
          )}
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 mt-1 text-gray-500" />
            <div>
              <p className="font-medium">Vai trò:</p>
              <p>{user.roles === "ADMIN" ? "Quản trị viên" : "Người dùng"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            {user.enabled ? (
              <CheckCircle className="w-4 h-4 mt-1 text-green-500" />
            ) : (
              <Ban className="w-4 h-4 mt-1 text-red-500" />
            )}
            <div>
              <p className="font-medium">Trạng thái:</p>
              <p>{user.enabled ? "Hoạt động" : "Bị cấm"}</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 mt-1 text-gray-500" />
            <div>
              <p className="font-medium">Ngày tạo:</p>
              <p>{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
