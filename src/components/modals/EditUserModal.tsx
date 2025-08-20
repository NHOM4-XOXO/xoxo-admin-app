import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateUserMutation } from "../../api/userApi";
import { useGetLocationsQuery } from "../../api/locationApi";
import type { User } from "../../types/User.type";
import { useEffect } from "react";
import { X } from "lucide-react";
import userSchema from "../../schema/UserSchema";

interface EditUserModalProps {
  user: User;
  onClose: () => void;
}

export default function EditUserModal({ user, onClose }: EditUserModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const { data: locations = [] } = useGetLocationsQuery();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Omit<User, "id">>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio,
      location: user.location,
      birthday: user.birthday,
      gender: user.gender,
      role: user.role,
      status: user.status,
    },
  });

  useEffect(() => {
    if (locations.length === 0) return;
    Object.entries(user).forEach(([key, value]) => {
      setValue(key as keyof Omit<User, "id">, value);
    });
  }, [user, locations, setValue]);

  const onSubmit = async (data: Omit<User, "id">) => {
    try {
      await updateUser({ id: user.id, ...data }).unwrap();
      onClose();
    } catch (error) {
      console.error("Cập nhật thất bại:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 mb-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Chỉnh sửa người dùng</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Họ tên</label>
            <input
              {...register("name")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
            <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register("email")}
              className="w-full mt-1 border rounded px-3 py-2"
              disabled
            />
            <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Giới thiệu</label>
            <textarea
              {...register("bio")}
              rows={2}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Vị trí</label>
            <select
              {...register("location")}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">-- Chọn vị trí --</option>
              {!locations.find((loc) => loc.name === user.location) &&
                user.location && (
                  <option value={String(user.location)}>{user.location}</option>
                )}
              {locations.map((loc) => (
                <option key={loc.code} value={loc.name ?? ""}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              {...register("birthday")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giới tính</label>
            <select
              {...register("gender")}
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
              {...register("role")}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="user">Người dùng</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.role?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Trạng thái</label>
            <select
              {...register("status")}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="active">Hoạt động</option>
              <option value="banned">Đã khoá</option>
            </select>
            <p className="text-red-500 text-sm mt-1">
              {errors.status?.message}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </form>
    </div>
  );
}
