import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateUserMutation } from "../../api/userApi";
import type { UserType } from "../../types/User.type";
import { useEffect } from "react";
import { X } from "lucide-react";
import userSchema from "../../schema/UserSchema";

type EditUserFormType = {
  firstName: string;
  lastName: string;
  email: string;
  roles: "USER" | "ADMIN";
  enabled: "true" | "false";
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER" | "";
  avatarUrl: string;
  coverUrl: string;
  bio: string;
};

interface EditUserModalProps {
  user: UserType;
  onClose: () => void;
}

export default function EditUserModal({ user, onClose }: EditUserModalProps) {
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  // const { data: locations = [] } = useGetLocationsQuery(); // Not used
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EditUserFormType>({
    resolver: yupResolver(userSchema) as any,
    defaultValues: {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      roles: (user.roles as "USER" | "ADMIN") ?? "USER",
      enabled: user.enabled ? "true" : "false",
      dateOfBirth: user.dateOfBirth ?? "",
      gender: (user.gender as "" | "MALE" | "FEMALE" | "OTHER") ?? "",
      avatarUrl: user.avatarUrl ?? "",
      coverUrl: user.coverUrl ?? "",
      bio: user.bio ?? "",
    },
  });

  useEffect(() => {
    setValue("firstName", user.firstName ?? "");
    setValue("lastName", user.lastName ?? "");
    setValue("email", user.email ?? "");
    setValue("roles", (user.roles as "USER" | "ADMIN") ?? "USER");
    setValue("enabled", user.enabled ? "true" : "false");
    setValue("dateOfBirth", user.dateOfBirth ?? "");
    setValue("gender", (user.gender as "" | "MALE" | "FEMALE" | "OTHER") ?? "");
    setValue("avatarUrl", user.avatarUrl ?? "");
    setValue("coverUrl", user.coverUrl ?? "");
    setValue("bio", user.bio ?? "");
  }, [user, setValue]);

  const onSubmit = async (data: EditUserFormType) => {
    try {
      await updateUser({
        id: user.id,
        ...data,
        enabled: data.enabled === "true",
      }).unwrap();
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
            <label className="text-sm font-medium">Họ</label>
            <input
              {...register("firstName")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName?.message}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium">Tên</label>
            <input
              {...register("lastName")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
            <p className="text-red-500 text-sm mt-1">
              {errors.lastName?.message}
            </p>
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
            <label className="text-sm font-medium">Vai trò</label>
            <select
              {...register("roles")}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Admin</option>
            </select>
            <p className="text-red-500 text-sm mt-1">{errors.roles?.message}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Trạng thái</label>
            <select
              {...register("enabled")}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="true">Hoạt động</option>
              <option value="false">Đã khoá</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Ngày sinh</label>
            <input
              type="date"
              {...register("dateOfBirth")}
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
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Avatar URL</label>
            <input
              {...register("avatarUrl")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Cover URL</label>
            <input
              {...register("coverUrl")}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium">Giới thiệu</label>
            <textarea
              {...register("bio")}
              rows={2}
              className="w-full mt-1 border rounded px-3 py-2"
            />
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
