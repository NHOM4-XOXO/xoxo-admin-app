// UserManagement.tsx

import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Ban,
  RefreshCw,
  Plus,
  Users,
  UserCheck,
  UserX,
  ShieldCheck,
  Pencil,
  CheckCircle,
} from "lucide-react";
import AddUserModal from "../components/modals/AddUserModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import UserDetailModal from "../components/modals/UserDetailModal";
import EditUserModal from "../components/modals/EditUserModal";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../api/userApi";
import type { UserType } from "../types/User.type";
import CustomPagination from "../components/CustomPagination";
import { removeVietnameseTones } from "../components/removeVietnameseTones";
import SearchComponent from "../components/SearchComponent";
import FilterDropdown from "../components/FilterDropdown";
import "../index.css";

const optionListRole = [
  { value: "all", label: "Tất cả vai trò" },
  { value: "user", label: "Người dùng" },
  { value: "admin", label: "Quản trị viên" },
];

const optionListStatus = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "banned", label: "Bị khóa" },
];

export default function UserManagement() {
  const [updateUser] = useUpdateUserMutation();


  const { data, isLoading, error, refetch } = useGetUsersQuery();
  let users: UserType[] = [];
  if (Array.isArray(data)) {
    users = data;
  } else if (data && Array.isArray((data as any).data)) {
    users = (data as any).data;
  }
  console.log("users", users);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const filteredUsers = useMemo(() => {
    const keyword = removeVietnameseTones(searchTerm.toLowerCase());
    return users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const matchesSearch =
        removeVietnameseTones(fullName.toLowerCase()).includes(keyword) ||
        removeVietnameseTones(user.email.toLowerCase()).includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.enabled) ||
        (statusFilter === "banned" && !user.enabled);

      const matchesRole =
        roleFilter === "all" ||
        (roleFilter === "admin" && user.roles === "ADMIN") ||
        (roleFilter === "user" && user.roles === "USER");

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, searchTerm, statusFilter, roleFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, roleFilter, searchTerm]);

  // phân trang
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handleBanUser = async (userId: number) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      try {
        await updateUser({
          id: userId,
          enabled: !user.enabled, // toggle trạng thái
        }).unwrap();
        setConfirmModal(null);
        refetch();
      } catch (err) {
        console.error("Toggle status failed", err);
        if (err && typeof err === "object") {
          alert("API error: " + JSON.stringify(err));
        }
      }
    }
  };

const [confirmModal, setConfirmModal] = useState<{
  open: boolean;
  message: string;
  onConfirm: () => Promise<void> | void;
} | null>(null);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin w-8 h-8 text-blue-600" />
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Theo dõi và chỉnh sửa thông tin người dùng
          </p>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {[
          {
            icon: <Users className="w-10 h-10 text-blue-600" />,
            label: "Tổng người dùng",
            count: users.length,
            onClick: () => setRoleFilter("all"),
          },
          {
            icon: <UserCheck className="w-10 h-10 text-green-600" />,
            label: "Đang hoạt động",
            count: users.filter((u) => u.enabled).length,
            onClick: () => setStatusFilter("active"),
          },
          {
            icon: <UserX className="w-10 h-10 text-gray-600" />,
            label: "Đã khoá",
            count: users.filter((u) => !u.enabled).length,
            onClick: () => setStatusFilter("banned"),
          },
          {
            icon: <ShieldCheck className="w-10 h-10 text-purple-600" />,
            label: "Quản trị viên",
            count: users.filter((u) => u.roles === "ADMIN").length,
            onClick: () => setRoleFilter("admin"),
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

      {/* filter */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
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

      {/* Table */}
      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase ">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="text-center align-middle">
                <td className="px-6 py-3 font-medium text-gray-900 text-left">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-left">
                  <span
                    className={
                      user.roles === "ADMIN"
                        ? "inline-flex px-2 py-1 text-sm font-semibold rounded-full text-purple-600 bg-purple-50"
                        : "inline-flex px-2 py-1 text-sm font-semibold rounded-full text-blue-600 bg-blue-50"
                    }
                  >
                    {user.roles}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-left">
                  <span
                    className={
                      user.enabled
                        ? "inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800 text-left"
                        : "inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800 text-left"
                    }
                  >
                    {user.enabled ? "Hoạt động" : "Khoá"}
                  </span>
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-left">
                  <span className="text-gray-700 bg-gray-50 py-1 rounded-full">
                    {formatDate(user.createdAt)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      className="text-yellow-600 hover:text-yellow-900 cursor-pointer"
                      onClick={() =>
                        setConfirmModal({
                          open: true,
                          message: `Bạn có chắc chắn muốn ${user.enabled ? "khóa" : "mở khóa"
                          } người dùng "${user.firstName} ${user.lastName}" không?`,
                          onConfirm: async () => {
                            await handleBanUser(user.id);
                            setConfirmModal(null);
                          },
                        })
                      }
                      title={user.enabled ? "Khóa" : "Mở khóa"}
                    >
                      {user.enabled ? (
                        <Ban className="w-4 h-4 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-yellow-600" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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

      {showAddModal && <AddUserModal onClose={() => setShowAddModal(false)} />}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}

      {/* Pagination */}
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

      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onCancel={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
        />
      )}
    </div>
  );
}
