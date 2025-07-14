import { useState } from "react";
import { X } from "lucide-react";
import type { UserType } from "../../types/User.type";


interface AddUserModalProps {
  onClose: () => void;
  onAdd: (newUser: UserType) => void;
}

export default function AddUserModal({ onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState<Omit<UserType, "id" | "createdAt">>({
    name: "",
    email: "",
    avatar: "/placeholder.svg",
    coverPhoto: "",
    bio: "",
    location: "",
    birthday: "",
    gender: undefined,
    role: "user",
    status: "active",
    friends: [],
    followers: [],
    following: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      ...formData,
      id: Date.now(), // ID giả lập
      createdAt: new Date().toISOString(),
    };
    onAdd(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Thêm người dùng mới</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Họ tên</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
              type="email"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giới thiệu</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Vị trí</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giới tính</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Vai trò</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="active">Hoạt động</option>
              <option value="banned">Đã khoá</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Thêm mới
          </button>
        </div>
      </form>
    </div>
  );
}
