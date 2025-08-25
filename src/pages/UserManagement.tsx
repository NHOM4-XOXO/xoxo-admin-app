import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Ban,
  Trash2,
  Loader2,
  Plus,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
} from "lucide-react";
import AddUserModal from "../components/modals/AddUserModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import UserDetailModal from "../components/modals/UserDetailModal";
import EditUserModal from "../components/modals/EditUserModal";
import {
  useDeleteUserMutation,
  // useGetUsersPaginatedQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../api/userApi";
import type { User as UserType } from "../types/User.type";
import CustomPagination from "../components/CustomPagination";
import { removeVietnameseTones } from "../components/removeVietnameseTones";
import Tippy from "@tippyjs/react";
import SearchComponent from "../components/SearchComponent";
import FilterDropdown from "../components/FilterDropdown";
import "../index.css";

const optionListRole = [
  {
    value: "all",
    label: "Tất cả vai trò",
  },
  {
    value: "user",
    label: "Người dùng",
  },
  {
    value: "admin",
    label: "Quản trị viên",
  },
];

const optionListStatus = [
  {
    value: "all",
    label: "Tất cả trạng thái",
  },
  {
    value: "active",
    label: "Hoạt động",
  },
  {
    value: "banned",
    label: "Bị cấm",
  },
];

export default function UserManagement() {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const { data: users = [], isLoading, error } = useGetUsersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [userToBan, setUserToBan] = useState<UserType | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const filteredUsers = useMemo(() => {
    const keyword = removeVietnameseTones(searchTerm.toLowerCase());
    return users.filter((user) => {
      const matchesSearch =
        removeVietnameseTones(user.name.toLowerCase()).includes(keyword) ||
        removeVietnameseTones(user.email.toLowerCase()).includes(keyword);
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, roleFilter, searchTerm]);

  {
    /* config pagination */
  }
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleBanUser = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      try {
        await updateUser({
          id: userId,
          status: user.status === "active" ? "banned" : "active",
        }).unwrap();
        setUserToBan(null);
      } catch (err) {
        console.error("Toggle status failed", err);
      }
    }
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

  const handleFilterByRole = (role: string) => {
    setRoleFilter(role);
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
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Thêm người dùng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {[
          {
            icon: <Users className="w-10 h-10 text-blue-600" />,
            label: "Tổng người dùng",
            count: users.length,
            onClick: () => handleFilterByRole("all"),
          },
          {
            icon: <UserCheck className="w-10 h-10 text-green-600" />,
            label: "Đang hoạt động",
            count: users.filter((u) => u.status === "active").length,
            onClick: () => handleFilterByStatus("active"),
          },
          {
            icon: <UserX className="w-10 h-10 text-gray-600" />,
            label: "Đã khoá",
            count: users.filter((u) => u.status === "banned").length,
            onClick: () => handleFilterByStatus("banned"),
          },
          {
            icon: <ShieldCheck className="w-10 h-10 text-purple-600" />,
            label: "Quản trị viên",
            count: users.filter((u) => u.role === "admin").length,
            onClick: () => handleFilterByRole("admin"),
          },
        ].map((item, index) => (
          <div key={index}>
            <button
              onClick={item.onClick}
              className="flex items-center w-full p-8 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition duration-200 cursor-pointer"
            >
              {item.icon}
              <div className="ml-4 text-left">
                <p className="text-base font-medium text-gray-600">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            </button>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SearchComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <FilterDropdown
            optionList={optionListRole}
            filter={roleFilter}
            setFilter={setRoleFilter}
          />
          <FilterDropdown
            optionList={optionListStatus}
            filter={statusFilter}
            setFilter={setStatusFilter}
          />
        </div>
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
            {paginatedUsers.map((user) => (
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
                  <Tippy
                    content="Xem chi tiết"
                    placement="bottom"
                    theme="small-text"
                    delay={[0, 0]}
                    hideOnClick={false}
                    interactive={false}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedUser(user)}
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </Tippy>

                  <Tippy
                    content={
                      user.status === "active"
                        ? "Khoá người dùng"
                        : "Mở khóa người dùng"
                    }
                    placement="bottom"
                    theme="small-text"
                    // animation="shift-away"
                    delay={[0, 0]}
                    hideOnClick={false}
                    interactive={false}
                  >
                    <button
                      type="button"
                      onClick={() => setUserToBan(user)}
                      disabled={isUpdating}
                      className="text-yellow-600 hover:text-yellow-800 disabled:opacity-50 cursor-pointer"
                      title={
                        user.status === "active"
                          ? "Khoá người dùng"
                          : "Mở khóa người dùng"
                      }
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </Tippy>

                  <Tippy
                    placement="bottom"
                    theme="small-text"
                    content="Xoá người dùng"
                    delay={[0, 0]}
                    hideOnClick={false}
                    interactive={false}
                  >
                    <button
                      type="button"
                      onClick={() => setUserToDelete(user)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                      title="Xóa người dùng"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Tippy>
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

      {userToBan && (
        <ConfirmModal
          message={`Bạn có chắc chắn muốn khóa người dùng "${userToBan.name}" không?`}
          onCancel={() => setUserToBan(null)}
          onConfirm={handleBanUser.bind(null, userToBan.id)}
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

      {filteredUsers.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          pageSize={pageSize}
          total={filteredUsers.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      )}
    </div>
  );
}
