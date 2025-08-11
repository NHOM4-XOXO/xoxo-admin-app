import { X, Loader2 } from "lucide-react";
import { useCreateUserMutation } from "../../api/userApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { User } from "../../types/User.type";
import { useGetLocationsQuery } from "../../api/locationApi";
import userSchema from "../../schema/UserSchema"; 

interface AddUserModalProps {
  onClose: () => void;
}



export default function AddUserModal({ onClose }: AddUserModalProps) {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const { data: locations = [] } = useGetLocationsQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<User, "id">>({
    resolver: yupResolver(userSchema),
    defaultValues: {
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
      createdAt: new Date().toISOString(),
      friends: [],
      followers: [],
      following: [],
    },
  });

  const onSubmit = async (data: Omit<User, "id">) => {
    try {
      await createUser({
        ...data,
        createdAt: Date.now().toString(),
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
        >
          <X />
        </button>
        <h2 className="text-xl font-semibold mb-4">Thêm người dùng mới</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Họ tên</label>
            <input
              {...register("name")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full mt-1 border rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Giới thiệu</label>
            <textarea
              {...register("bio")}
              rows={2}
              className="w-full mt-1 border rounded px-3 py-2"
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium">Vị trí</label>
            <select
              {...register("location")}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">-- Chọn vị trí --</option>
              {locations?.map((loc) => (
                <option key={loc.code} value={loc.name}>
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
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center cursor-pointer"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Thêm mới
          </button>
        </div>
      </form>
    </div>
  );
}
