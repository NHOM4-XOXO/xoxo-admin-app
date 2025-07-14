import { useEffect, useState } from "react";
import { Search, Eye, Ban, Trash2, User } from "lucide-react";
import UserDetailModal from "../components/modals/UserDetailModal";
import EditUserModal from "../components/modals/EditUserModal";
import AddUserModal from "../components/modals/AddUserModal";
import NotificationModal from "../components/modals/NotificationModal";
import type { UserType } from "../types/User.type";

const mockUsers: UserType[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    avatar: "/placeholder.svg",
    coverPhoto: "/cover.jpg",
    bio: "Yêu công nghệ, đam mê du lịch.",
    location: "Hà Nội",
    birthday: "2000-01-01",
    gender: "male",
    role: "user",
    status: "active",
    createdAt: "2023-05-01T12:00:00Z",
    friends: [2],
    followers: [2],
    following: [],
  },
  {
    id: 2,
    name: "Admin C",
    email: "admin@example.com",
    avatar: "/placeholder.svg",
    coverPhoto: "/cover.jpg",
    bio: "Quản trị viên hệ thống.",
    location: "TP.HCM",
    birthday: "1995-03-15",
    gender: "female",
    role: "admin",
    status: "banned",
    createdAt: "2023-04-20T08:30:00Z",
    friends: [1],
    followers: [],
    following: [1],
  },
  {
    id: 3,
    name: "Lê Thị D",
    email: "d@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    createdAt: "2024-01-12T09:00:00Z",
    location: "Đà Nẵng",
    gender: "female",
    bio: "Yêu đời, thích ca hát.",
    birthday: "2002-10-05",
    friends: [1],
    followers: [],
    following: [1, 2],
  },
  {
    id: 4,
    name: "Phạm Văn E",
    email: "e@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "banned",
    createdAt: "2023-11-02T15:45:00Z",
    location: "Cần Thơ",
    gender: "male",
    bio: "Sinh viên đại học.",
    birthday: "2001-08-10",
    friends: [],
    followers: [3],
    following: [],
  },
  {
    id: 5,
    name: "Trần Thị F",
    email: "f@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    createdAt: "2024-03-01T17:20:00Z",
    gender: "female",
    bio: "Thích chụp ảnh và du lịch.",
    birthday: "1998-07-22",
    location: "Huế",
    friends: [3, 4],
    followers: [],
    following: [],
  },
  {
    id: 6,
    name: "Ngô Quang G",
    email: "g@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    createdAt: "2023-09-11T10:10:00Z",
    gender: "male",
    bio: "Backend developer.",
    birthday: "1996-12-12",
    location: "Nha Trang",
    friends: [],
    followers: [],
    following: [],
  },
  {
    id: 7,
    name: "Lương Văn H",
    email: "h@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "banned",
    createdAt: "2024-01-25T14:30:00Z",
    gender: "male",
    location: "Hải Phòng",
    bio: "Thích bóng đá và phim ảnh.",
    birthday: "1999-05-30",
    friends: [],
    followers: [],
    following: [],
  },
  {
    id: 8,
    name: "Đặng Thị I",
    email: "i@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    createdAt: "2024-02-18T08:00:00Z",
    gender: "female",
    location: "Biên Hòa",
    bio: "Marketing freelancer.",
    birthday: "1997-09-14",
    friends: [5, 6],
    followers: [],
    following: [3],
  },
  {
    id: 9,
    name: "Phùng Quốc K",
    email: "k@example.com",
    avatar: "/placeholder.svg",
    role: "admin",
    status: "active",
    createdAt: "2023-10-01T13:50:00Z",
    gender: "other",
    location: "Quảng Ninh",
    bio: "Định hướng AI & Data.",
    birthday: "1988-01-01",
    friends: [],
    followers: [],
    following: [],
  },
  {
    id: 10,
    name: "Võ Thị L",
    email: "l@example.com",
    avatar: "/placeholder.svg",
    role: "user",
    status: "active",
    createdAt: "2024-04-05T11:00:00Z",
    gender: "female",
    location: "Tây Ninh",
    bio: "Yêu thích học hỏi.",
    birthday: "2003-04-20",
    friends: [3, 5],
    followers: [],
    following: [],
  },
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => {
        const matchesSearch =
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus =
          statusFilter === "all" || user.status === statusFilter;
        console.log("re render");

        return matchesSearch && matchesRole && matchesStatus;
      })
    );
  }, [users, searchTerm, roleFilter, statusFilter]);

  const toggleStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "banned" : "active",
            }
          : user
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>

      {/* Bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Đã khoá</option>
        </select>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Thêm người dùng
        </button>
      </div>

      {/* Danh sách */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-gray-500 text-sm">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Hoạt động" : "Đã khoá"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    title="Xem chi tiết"
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="text-yellow-600 hover:text-yellow-900"
                    title={user.status === "active" ? "Khoá" : "Mở khoá"}
                  >
                    <Ban className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setUserToDelete(user)}
                    className="text-red-600 hover:text-red-900"
                    title="Xoá người dùng"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết người dùng */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={(user) => {
            setSelectedUser(null); // Ẩn modal xem chi tiết
            setEditingUser(user); // Hiện modal chỉnh sửa
          }}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            // Cập nhật danh sách user trong state
            setUsers((prev) =>
              prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
            );
            setEditingUser(null);
          }}
        />
      )}
      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newUser) => {
            setUsers((prev) => [...prev, newUser]);
            setShowAddModal(false);
          }}
        />
      )}

      {userToDelete && (
        <NotificationModal
          message={`Bạn có chắc chắn muốn xoá người dùng "${userToDelete.name}" không?`}
          onCancel={() => setUserToDelete(null)}
          onConfirm={() => {
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
}
