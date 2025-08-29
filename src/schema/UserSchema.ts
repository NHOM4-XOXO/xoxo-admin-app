import * as yup from "yup";
import type { UserType } from "../types/User.type";

const userSchema: yup.ObjectSchema<Omit<UserType, "id">> = yup.object({
  enabled: yup.boolean().required(),
  username: yup.string().nullable(),
  roles: yup.string().required(),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  firstName: yup.string().nullable(),
  lastName: yup.string().nullable(),
  dateOfBirth: yup.string().nullable(),
  gender: yup.string().nullable(),
  avatarUrl: yup.string().nullable(),
  coverUrl: yup.string().nullable(),
  bio: yup.string().nullable(),
  location: yup.string().nullable(),
  createdAt: yup.string().required(),
  updatedAt: yup.string().required(),
});

export default userSchema;
