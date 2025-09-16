import { useState, useEffect } from "react";
import {
  Eye,
  Check,
  X,
  AlertTriangle,
  Clock,
  RefreshCw,
  ShieldAlert,
  Trash2,
  UserX,
} from "lucide-react";
import {
  useDeleteReportMutation,
  useGetReportsQuery,
  useUpdateReportMutation,
} from "../api/reportApi";
import CustomPagination from "../components/CustomPagination";
import type { ReportItemResponse, ReportStatus } from "../types/Report.type";
import { removeVietnameseTones } from "../components/removeVietnameseTones";
import SearchComponent from "../components/SearchComponent";
import FilterDropdown from "../components/FilterDropdown";
import "../index.css";
import ConfirmModal from "../components/modals/ConfirmModal";
import { useAuth } from "../contexts/AuthContext";

const optionListStatus: { value: "all" | ReportStatus; label: string }[] = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã xử lý" },
  { value: "REJECTED", label: "Vi phạm" },
  { value: "ESCALATED", label: "Chuyển cấp cao hơn" },
  { value: "CLOSED", label: "Đã đóng" },
];

export default function ReportManagement() {
  // Redux hooks for data fetching and mutations
  const { data: reports = [], isLoading, error } = useGetReportsQuery();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();
  

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");
  const [selectedReport, setSelectedReport] =
    useState<ReportItemResponse | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filteredReports, setFilteredReports] = useState<ReportItemResponse[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const { user } = useAuth();
  const role = user?.role;

  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    onConfirm: () => Promise<void> | void;
    colorClass?: string;
    titleClass?: string;
  } | null>(null);

  // Modal adminNotes for rejection
  const [rejectModal, setRejectModal] = useState<{
    report: ReportItemResponse;
    adminNotes: string;
  } | null>(null);

  // Filter reports based on search and filter criteria
  useEffect(() => {
    const keyword = removeVietnameseTones(searchTerm.toLowerCase());
    setFilteredReports(
      reports.filter((report: ReportItemResponse) => {
        const matchesSearch =
          removeVietnameseTones(
            (report.reporterName || "").toLowerCase()
          ).includes(keyword) ||
          removeVietnameseTones(
            (report.reportReason || "").toLowerCase()
          ).includes(keyword);

        const matchesStatus =
          statusFilter === "all" || report.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    );
  }, [reports, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    if (selectedReport) {
      const updated = reports.find((r) => r.id === selectedReport.id);
      if (updated) setSelectedReport(updated);
    }
  }, [reports]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Đã xử lý
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Chờ xử lý
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
            Vi phạm
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
            Đang xử lý
          </span>
        );
      case "ESCALATED":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
            Chuyển cấp cao hơn
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-800">
            Đã đóng
          </span>
        );
      default:
        return status;
    }
  };

  const handleStatusChange = async (
    reportId: number,
    newStatus: ReportStatus,
    adminNotes?: string
  ) => {
    try {
      await updateReport({
        id: reportId,
        status: newStatus,
        ...(adminNotes && { adminNotes }),
      }).unwrap();
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  };

  const handleFilterByStatus = (status: "all" | ReportStatus) => {
    setStatusFilter(status);
  };

  const viewReportDetails = (report: ReportItemResponse) => {
    setSelectedReport(report);
    setShowReportModal(true);
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
    return (
      <div className="text-center text-red-600 py-8">
        <p>Có lỗi xảy ra khi tải dữ liệu báo cáo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý báo cáo</h1>
          <p className="text-gray-600">
            Xử lý các báo cáo vi phạm từ người dùng
          </p>
        </div>
      </div>

      {/* Stats */}
      {/* Stats 2 hàng 3 nút, bỏ Đã đóng */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
        <button
          onClick={() => handleFilterByStatus("all")}
          className="flex flex-col items-center w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition duration-200 cursor-pointer shadow-sm"
        >
          <ShieldAlert className="w-7 h-7 text-blue-600 mb-1" />
          <span className="text-sm font-medium text-gray-600">
            Tổng báo cáo
          </span>
          <span className="text-lg font-bold text-gray-900 mt-1">
            {reports.length}
          </span>
        </button>
        <button
          onClick={() => handleFilterByStatus("PENDING")}
          className="flex flex-col items-center w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition duration-200 cursor-pointer shadow-sm"
        >
          <Clock className="w-7 h-7 text-yellow-600 mb-1" />
          <span className="text-sm font-medium text-gray-600">Chờ xử lý</span>
          <span className="text-lg font-bold text-gray-900 mt-1">
            {reports.filter((r) => r.status === "PENDING").length}
          </span>
        </button>
        <button
          onClick={() => handleFilterByStatus("IN_PROGRESS")}
          className="flex flex-col items-center w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition duration-200 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-7 h-7 text-blue-600 mb-1 animate-spin-slow" />
          <span className="text-sm font-medium text-gray-600">Đang xử lý</span>
          <span className="text-lg font-bold text-gray-900 mt-1">
            {reports.filter((r) => r.status === "IN_PROGRESS").length}
          </span>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => handleFilterByStatus("RESOLVED")}
          className="flex flex-col items-center w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition duration-200 cursor-pointer shadow-sm"
        >
          <Check className="w-7 h-7 text-green-600 mb-1" />
          <span className="text-sm font-medium text-gray-600">Đã xử lý</span>
          <span className="text-lg font-bold text-gray-900 mt-1">
            {reports.filter((r) => r.status === "RESOLVED").length}
          </span>
        </button>
        <button
          onClick={() => handleFilterByStatus("REJECTED")}
          className="flex flex-col items-center w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition duration-200 cursor-pointer shadow-sm"
        >
          <UserX className="w-7 h-7 text-red-600 mb-1" />
          <span className="text-sm font-medium text-gray-600">Vi phạm</span>
          <span className="text-lg font-bold text-gray-900 mt-1">
            {reports.filter((r) => r.status === "REJECTED").length}
          </span>
        </button>
        <button
          onClick={() => handleFilterByStatus("ESCALATED")}
          className="flex flex-col items-center w-full p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 hover:border-blue-400 transition duration-200 cursor-pointer shadow-sm"
        >
          <AlertTriangle className="w-7 h-7 text-purple-600 mb-1" />
          <span className="text-sm font-medium text-gray-600">
            Chuyển cấp cao hơn
          </span>
          <span className="text-lg font-bold text-gray-900 mt-1">
            {reports.filter((r) => r.status === "ESCALATED").length}
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <SearchComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>
          <div>
            <FilterDropdown
              optionList={optionListStatus}
              filter={statusFilter}
              setFilter={(value) =>
                setStatusFilter(value as ReportStatus | "all")
              }
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className=" overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Báo cáo
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 rounded-full flex-shrink-0 bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {report.reporterName?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {report.reporterName}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {report.reporterEmail}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Đối tượng: {report.reportTargetType} #
                          {report.reportTargetId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-3">
                      {report.reportReason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status as ReportStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewReportDetails(report)}
                        className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {report.status === "CLOSED" && (
                        <button
                          onClick={() =>
                            setConfirmModal({
                              message:
                                "Bạn có chắc chắn muốn xóa vĩnh viễn báo cáo này? Hành động này không thể hoàn tác.",
                              onConfirm: async () => {
                                await deleteReport(report.id);
                                setConfirmModal(null);
                              },
                              colorClass: getStatusBgClass("REJECTED"),
                              titleClass: getStatusColorClass("REJECTED"),
                            })
                          }
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <ShieldAlert className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có báo cáo
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy báo cáo nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600/50 bg-opacity-1/2 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết báo cáo
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      {selectedReport.reporterName?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium">
                        {selectedReport.reporterName}
                      </h4>
                      <p className="text-xs text-gray-500 mb-1">
                        {selectedReport.reporterEmail}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedReport.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      Nội dung được báo cáo:
                    </span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {selectedReport.reportReason}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      Ghi chú:
                    </span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {selectedReport.adminNotes}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        ID người báo cáo: {selectedReport.reporterId}
                      </span>
                      <span className="flex items-center">
                        Đối tượng: {selectedReport.reportTargetType} #
                        {selectedReport.reportTargetId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  {selectedReport.status === "PENDING" && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            message:
                              "Bạn có chắc chắn muốn chuyển báo cáo sang trạng thái Đang xử lý?",
                            onConfirm: async () => {
                              await handleStatusChange(
                                selectedReport.id,
                                "IN_PROGRESS"
                              );
                              setConfirmModal(null);
                            },
                            colorClass: getStatusBgClass("IN_PROGRESS"),
                            titleClass: "text-blue-600",
                          })
                        }
                        disabled={isUpdating}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50 cursor-pointer"
                        title="Chuyển sang Đang xử lý"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {selectedReport.status === "IN_PROGRESS" && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            message:
                              "Bạn có chắc chắn muốn đánh dấu báo cáo này là Đã xử lý?",
                            onConfirm: async () => {
                              await handleStatusChange(
                                selectedReport.id,
                                "RESOLVED"
                              );
                              setConfirmModal(null);
                            },
                            colorClass: getStatusBgClass("RESOLVED"),
                            titleClass: "text-green-600",
                          })
                        }
                        disabled={isUpdating}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                        title="Đánh dấu đã xử lý"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setRejectModal({
                            report: selectedReport,
                            adminNotes: "",
                          })
                        }
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                        title="Đánh dấu vi phạm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            message:
                              "Bạn có chắc chắn muốn chuyển báo cáo này lên Cấp cao hơn?",
                            onConfirm: async () => {
                              await handleStatusChange(
                                selectedReport.id,
                                "ESCALATED"
                              );
                              setConfirmModal(null);
                            },
                            colorClass: getStatusBgClass("ESCALATED"),
                            titleClass: "text-purple-600",
                          })
                        }
                        disabled={isUpdating}
                        className="text-purple-600 hover:text-purple-900 disabled:opacity-50 cursor-pointer"
                        title="Chuyển cấp cao hơn"
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {selectedReport.status === "ESCALATED" &&
                    (role === "LEADER" || role === "ADMIN_SUPER") && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() =>
                            setConfirmModal({
                              message:
                                "Bạn có chắc chắn muốn đánh dấu báo cáo này là Đã xử lý?",
                              onConfirm: async () => {
                                await handleStatusChange(
                                  selectedReport.id,
                                  "RESOLVED"
                                );
                                setConfirmModal(null);
                                setShowReportModal(false);
                              },
                              colorClass: getStatusBgClass("RESOLVED"),
                              titleClass: "text-green-600",
                            })
                          }
                          disabled={isUpdating}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                          title="Đánh dấu đã xử lý"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            setRejectModal({
                              report: selectedReport,
                              adminNotes: "",
                            })
                          }
                          disabled={isUpdating}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                          title="Đánh dấu vi phạm"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                  {(selectedReport.status === "RESOLVED" ||
                    selectedReport.status === "REJECTED") && (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            message: "Bạn có chắc chắn muốn đóng báo cáo này?",
                            onConfirm: async () => {
                              await handleStatusChange(
                                selectedReport.id,
                                "CLOSED"
                              );
                              setConfirmModal(null);
                              setShowReportModal(false);
                            },
                            colorClass: getStatusBgClass("CLOSED"),
                            titleClass: "text-gray-600",
                          })
                        }
                        disabled={isUpdating}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50 cursor-pointer"
                        title="Đóng báo cáo"
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            message:
                              "Bạn có chắc chắn muốn xóa vĩnh viễn báo cáo này? Hành động này không thể hoàn tác.",
                            onConfirm: async () => {
                              await deleteReport(selectedReport.id);
                              setConfirmModal(null);
                              setShowReportModal(false);
                            },
                            colorClass: getStatusBgClass("REJECTED"),
                            titleClass: "text-red-600",
                          })
                        }
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer flex items-center"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal adminNotes for rejection */}
      {rejectModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận vi phạm
            </h2>
            <p className="text-gray-700 mb-4">
              Nhập lý do vi phạm cho báo cáo này:
            </p>
            <textarea
              className="w-full border rounded-md p-2 mb-4"
              rows={3}
              value={rejectModal.adminNotes}
              onChange={(e) =>
                setRejectModal({ ...rejectModal, adminNotes: e.target.value })
              }
              placeholder="Nhập lý do vi phạm..."
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModal(null)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  await updateReport({
                    id: rejectModal.report.id,
                    adminNotes: rejectModal.adminNotes,
                    status: "REJECTED",
                  });
                  setRejectModal(null);
                  setShowReportModal(false);
                }}
                disabled={isUpdating || !rejectModal.adminNotes.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md cursor-pointer"
              >
                Xác nhận vi phạm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Components Pagination */}

      <CustomPagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={filteredReports.length}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />

      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onCancel={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          colorClass={confirmModal.colorClass}
          titleClass={confirmModal.titleClass}
        />
      )}
    </div>
  );
}

// Helper: màu và text trạng thái cho modal xác nhận
function getStatusColorClass(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "text-blue-600";
    case "RESOLVED":
      return "text-green-600";
    case "REJECTED":
      return "text-red-600";
    case "ESCALATED":
      return "text-purple-600";
    case "CLOSED":
      return "text-gray-600";
    default:
      return "text-blue-600";
  }
}

function getStatusBgClass(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-blue-600 hover:bg-blue-700";
    case "RESOLVED":
      return "bg-green-600 hover:bg-green-700";
    case "REJECTED":
      return "bg-red-600 hover:bg-red-700";
    case "ESCALATED":
      return "bg-purple-600 hover:bg-purple-700";
    case "CLOSED":
      return "bg-gray-600 hover:bg-gray-700";
    default:
      return "bg-blue-600 hover:bg-blue-700";
  }
}
// function getStatusText(status: string) {
//   switch (status) {
//     case "IN_PROGRESS":
//       return "Đang xử lý";
//     case "RESOLVED":
//       return "Đã xử lý";
//     case "REJECTED":
//       return "Vi phạm";
//     case "ESCALATED":
//       return "Chuyển cấp cao hơn";
//     case "CLOSED":
//       return "Đã đóng";
//     default:
//       return status;
//   }
// }
