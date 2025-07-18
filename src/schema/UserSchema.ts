import * as yup from "yup";
import type { User } from "../types/User.type";

const userSchema: yup.ObjectSchema<Omit<User, "id">> = yup.object({
  name: yup.string().required("Họ tên là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  avatar: yup.string(),
  coverPhoto: yup.string().nullable(),
  bio: yup.string().nullable(),
  location: yup.string().nullable(),
  birthday: yup.string().nullable(),
  gender: yup.mixed<"male" | "female" | "other">().nullable(),
  role: yup.mixed<"user" | "admin">().required("Vai trò là bắt buộc"),
  status: yup.mixed<"active" | "banned">().required("Trạng thái là bắt buộc"),
  createdAt: yup.string().required(),
  friends: yup.array().of(yup.number().required()).nullable(),
  followers: yup.array().of(yup.number().required()).nullable(),
  following: yup.array().of(yup.number().required()).nullable(),
});

export default userSchema;
