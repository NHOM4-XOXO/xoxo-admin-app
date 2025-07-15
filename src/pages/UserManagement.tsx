import { useState } from "react";
import { Eye, Ban, Trash2, Loader2, Plus } from "lucide-react";
import AddUserModal from "../components/modals/AddUserModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import UserDetailModal from "../components/modals/UserDetailModal";
import EditUserModal from "../components/modals/EditUserModal";
import { useDeleteUserMutation, useGetUsersQuery, useUpdateUserMutation } from "../api/userApi";
import type { User as UserType } from "../types/User.type";

export default function UserManagement() {
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleStatus = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      try {
        await updateUser({
          id: userId,
          status: user.status === "active" ? "banned" : "active",
        }).unwrap();
      } catch (err) {
        console.error("Toggle status failed", err);
      }
    }
  };

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id).unwrap();
        setUserToDelete(null);
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600">
        Không thể tải dữ liệu người dùng.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Theo dõi và chỉnh sửa thông tin người dùng
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm người dùng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
          placeholder="Tìm kiếm tên hoặc email..."
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">Tất cả vai trò</option>
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="banned">Bị cấm</option>
        </select>
      </div>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Người dùng
              </th>
              <th className="px-6 py-3">Vai trò</th>
              <th className="px-6 py-3">Trạng thái</th>
              <th className="px-6 py-3">Ngày tạo</th>
              <th className="px-6 py-3">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 flex items-center space-x-3">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                </td>
                <td className="px-6 py-4 text-sm text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === "active" ? "Hoạt động" : "Bị cấm"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 text-center">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 text-sm space-x-2 text-center">
                  <button
                  type="button"
                    onClick={() => setSelectedUser(user)}
                    className="text-blue-600 hover:text-blue-900"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                  type="button"
                    onClick={() => toggleStatus(user.id)}
                    disabled={isUpdating}
                    className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                  <button
                  type="button"
                    onClick={() => setUserToDelete(user)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center p-6 text-gray-500">
            Không có người dùng nào.
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onEdit={(user) => {
            setSelectedUser(null); 
            setEditingUser(user);
          }}
        />
      )}

      {userToDelete && (
        <ConfirmModal
          message={`Bạn có chắc chắn muốn xoá người dùng "${userToDelete.name}" không?`}
          onCancel={() => setUserToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}
