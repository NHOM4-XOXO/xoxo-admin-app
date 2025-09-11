import { useState, useEffect } from "react";
import {
  Eye,
  RefreshCw,
  CheckCircle,
  Ban,
  Users,
  Lock,
  Globe,
  User,
  Calendar,
  X,
} from "lucide-react";
import {
  useGetGroupsQuery,
  useUpdateGroupStatusMutation,
} from "../api/groupApi";
import type {
  GroupItemResponse,
  GroupStatus,
  GroupPrivacy,
} from "../types/Group.type";
import CustomPagination from "../components/CustomPagination";
import FilterDropdown from "../components/FilterDropdown";
import SearchComponent from "../components/SearchComponent";
import "../index.css";

const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "ACTIVE", label: "Đang hoạt động" },
  { value: "SUSPENDED", label: "Tạm ngưng" },
  { value: "BANNED", label: "Cấm vĩnh viễn" },
  { value: "UNDER_REVIEW", label: "Đang xem xét" },
  { value: "ARCHIVED", label: "Lưu trữ" },
];

const privacyOptions = [
  { value: "all", label: "Tất cả quyền riêng tư" },
  { value: "PUBLIC", label: "Công khai" },
  { value: "PRIVATE", label: "Riêng tư" },
];

function getStatusBadge(status: GroupStatus) {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
          Đang hoạt động
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Tạm ngưng
        </span>
      );
    case "BANNED":
      return (
        <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
          Cấm vĩnh viễn
        </span>
      );
    case "UNDER_REVIEW":
      return (
        <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
          Đang xem xét
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-800">
          Lưu trữ
        </span>
      );
    default:
      return (
        <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}

function getPrivacyBadge(privacy: GroupPrivacy) {
  return privacy === "PUBLIC" ? (
    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
      Công khai
    </span>
  ) : (
    <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-800">
      Riêng tư
    </span>
  );
}

export default function GroupManagement() {
  const { data: groups = [], isLoading, error } = useGetGroupsQuery();
  const [updateGroupStatus, { isLoading: isUpdating }] =
    useUpdateGroupStatusMutation();
  const [selectedGroup, setSelectedGroup] = useState<GroupItemResponse | null>(
    null
  );
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [privacyFilter, setPrivacyFilter] = useState("all");
  const [filteredGroups, setFilteredGroups] = useState<GroupItemResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [statusFilter, privacyFilter, searchTerm]);

  useEffect(() => {
    const keyword = searchTerm.toLowerCase();
    setFilteredGroups(
      groups.filter((group) => {
        const matchesSearch =
          group.title.toLowerCase().includes(keyword) ||
          (group.description || "").toLowerCase().includes(keyword) ||
          (group.tags || "").toLowerCase().includes(keyword);
        const matchesStatus =
          statusFilter === "all" || group.status === statusFilter;
        const matchesPrivacy =
          privacyFilter === "all" || group.privacy === privacyFilter;
        return matchesSearch && matchesStatus && matchesPrivacy;
      })
    );
  }, [groups, searchTerm, statusFilter, privacyFilter]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedGroups = filteredGroups.slice(startIndex, endIndex);

  const handleStatusChange = async (
    groupId: number,
    newStatus: GroupStatus
  ) => {
    try {
      await updateGroupStatus({ groupId, status: newStatus }).unwrap();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to update group status", err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  if (error) {
    return <div className="text-red-500 text-center mt-8">Lỗi tải nhóm</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhóm</h1>
          <p className="text-gray-600">Quản lý các group cộng đồng</p>
        </div>
      </div>

      {/* Stats Buttons - 2 rows, 3 columns, style like report */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        {[
          {
            icon: <Users className="w-7 h-7 text-blue-600 mb-1" />,
            label: "Tổng nhóm",
            count: groups.length,
            onClick: () => setStatusFilter("all"),
            color: "border-blue-200 hover:bg-blue-50 hover:border-blue-400",
          },
          {
            icon: <CheckCircle className="w-7 h-7 text-green-600 mb-1" />,
            label: "Đang hoạt động",
            count: groups.filter((g) => g.status === "ACTIVE").length,
            onClick: () => setStatusFilter("ACTIVE"),
            color: "border-green-200 hover:bg-green-50 hover:border-green-400",
          },
          {
            icon: <Ban className="w-7 h-7 text-yellow-600 mb-1" />,
            label: "Tạm ngưng",
            count: groups.filter((g) => g.status === "SUSPENDED").length,
            onClick: () => setStatusFilter("SUSPENDED"),
            color:
              "border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400",
          },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={`flex flex-col items-center w-full p-3 bg-white rounded-lg border ${item.color} transition duration-200 cursor-pointer shadow-sm`}
          >
            {item.icon}
            <span className="text-sm font-medium text-gray-600">
              {item.label}
            </span>
            <span className="text-lg font-bold text-gray-900 mt-1">
              {item.count}
            </span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {[
          {
            icon: <Ban className="w-7 h-7 text-red-600 mb-1" />,
            label: "Cấm vĩnh viễn",
            count: groups.filter((g) => g.status === "BANNED").length,
            onClick: () => setStatusFilter("BANNED"),
            color: "border-red-200 hover:bg-red-50 hover:border-red-400",
          },
          {
            icon: <Lock className="w-7 h-7 text-gray-600 mb-1" />,
            label: "Lưu trữ",
            count: groups.filter((g) => g.status === "ARCHIVED").length,
            onClick: () => setStatusFilter("ARCHIVED"),
            color: "border-gray-200 hover:bg-gray-50 hover:border-gray-400",
          },
          {
            icon: <RefreshCw className="w-7 h-7 text-blue-500 mb-1" />,
            label: "Đang xem xét",
            count: groups.filter((g) => g.status === "UNDER_REVIEW").length,
            onClick: () => setStatusFilter("UNDER_REVIEW"),
            color: "border-blue-200 hover:bg-blue-50 hover:border-blue-400",
          },
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className={`flex flex-col items-center w-full p-3 bg-white rounded-lg border ${item.color} transition duration-200 cursor-pointer shadow-sm`}
          >
            {item.icon}
            <span className="text-sm font-medium text-gray-600">
              {item.label}
            </span>
            <span className="text-lg font-bold text-gray-900 mt-1">
              {item.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchComponent
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <FilterDropdown
            filter={statusFilter}
            setFilter={setStatusFilter}
            optionList={statusOptions}
          />
          <FilterDropdown
            filter={privacyFilter}
            setFilter={setPrivacyFilter}
            optionList={privacyOptions}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Tên nhóm
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Quyền riêng tư
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Thành viên
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedGroups.map((group) => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                        src={group.coverUrl || "/placeholder.svg"}
                        alt={group.title}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 line-clamp-1">
                          {group.title}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {group.tags}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1">
                          {group.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(group.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPrivacyBadge(group.privacy)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-1">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    {group.memberCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {group.postCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(group.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedGroup(group);
                          setShowGroupModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {/* Action buttons for each status */}
                      {group.status === "ACTIVE" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "SUSPENDED")
                            }
                            disabled={isUpdating}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 cursor-pointer"
                            title="Tạm ngưng nhóm"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "BANNED")
                            }
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                            title="Cấm vĩnh viễn"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "ARCHIVED")
                            }
                            disabled={isUpdating}
                            className="text-gray-600 hover:text-gray-900 disabled:opacity-50 cursor-pointer"
                            title="Lưu trữ nhóm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {group.status === "SUSPENDED" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "ACTIVE")
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                            title="Kích hoạt lại nhóm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "BANNED")
                            }
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                            title="Cấm vĩnh viễn"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {group.status === "BANNED" && (
                        <button
                          onClick={() =>
                            handleStatusChange(group.id, "UNDER_REVIEW")
                          }
                          disabled={isUpdating}
                          className="text-blue-600 hover:text-blue-900 disabled:opacity-50 cursor-pointer"
                          title="Chuyển sang xem xét"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {group.status === "UNDER_REVIEW" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "ACTIVE")
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                            title="Kích hoạt lại nhóm"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(group.id, "BANNED")
                            }
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                            title="Cấm vĩnh viễn"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {group.status === "ARCHIVED" && (
                        <button
                          onClick={() => handleStatusChange(group.id, "ACTIVE")}
                          disabled={isUpdating}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                          title="Kích hoạt lại nhóm"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Group Details Modal */}
      {showGroupModal && selectedGroup && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết nhóm
                </h3>
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-12 w-12 rounded-full object-cover"
                    src={selectedGroup.coverUrl || "/placeholder.svg"}
                    alt={selectedGroup.title}
                  />
                  <div>
                    <h4 className="text-lg font-medium">
                      {selectedGroup.title}
                    </h4>
                    <div className="text-xs text-gray-500">
                      {getStatusBadge(selectedGroup.status)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {getPrivacyBadge(selectedGroup.privacy)}
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedGroup.description}
                  </p>
                  {selectedGroup.tags && (
                    <div className="mt-2 text-xs text-blue-600">
                      #{selectedGroup.tags}
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Vị trí: {selectedGroup.location}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Website: {selectedGroup.website}
                  </div>
                </div>
                <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> {selectedGroup.memberCount}{" "}
                    thành viên
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" /> Chủ sở hữu:{" "}
                    {selectedGroup.creator?.firstName}{" "}
                    {selectedGroup.creator?.lastName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Ngày tạo:{" "}
                    {formatDate(selectedGroup.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />{" "}
                    {selectedGroup.privacy === "PUBLIC"
                      ? "Công khai"
                      : "Riêng tư"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <CustomPagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={filteredGroups.length}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}
