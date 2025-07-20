import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Check,
  X,
  AlertTriangle,
  Clock,
  Loader2,
  ShieldAlert,
  UserX,
} from "lucide-react";
import {
  useGetReportsQuery,
  useUpdateReportMutation,
} from "../api/reportApi.ts";
import CustomPagination from "../components/CustomPagination.tsx";
import type { Report } from "../types/Report.type.ts";
import { removeVietnameseTones } from "../components/removeVietnameseTones.tsx";

export default function ReportManagement() {
  // Redux hooks for data fetching and mutations
  const { data: reports = [], isLoading, error } = useGetReportsQuery();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [confirmModal, setConfirmModal] = useState<{
    report: Report | null;
    newStatus: Report["status"] | null;
    reason: Report["reason"] | null;
    
  } | null>(null);
  const [reason, setReason] = useState("");


  // Filter reports based on search and filter criteria
  useEffect(() => {
    const keyword = removeVietnameseTones(searchTerm.toLowerCase());
    setFilteredReports(
      reports.filter((report) => {
        const matchesSearch =
          removeVietnameseTones(report.author.toLowerCase()).includes(keyword) ||
          removeVietnameseTones(report.content.toLowerCase()).includes(keyword);

        const matchesStatus =
          statusFilter === "all" || report.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    );
  }, [reports, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Đã xử lý
          </span>
        );
      case "hidden":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Chờ xử lý
          </span>
        );
      case "reported":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Vi phạm
          </span>
        );
    }
  };
  
  const handleStatusChange = async (
    reportId: number,
    newStatus: Report["status"],
    reason?: string // 🆕 thêm lý do nếu có
  ) => {
    try {
      await updateReport({
        id: reportId,
        status: newStatus,
        ...(reason && { reason }), // 🆕 chỉ gửi nếu có reason
      }).unwrap();
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
  };


  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            icon: <ShieldAlert className="w-10 h-10 text-blue-600" />,
            label: "Tổng báo cáo",
            count: reports.length,
            onClick: () => handleFilterByStatus("all"),
          },
          {
            icon: <Clock className="w-10 h-10 text-yellow-600" />,
            label: "Chờ xử lý",
            count: reports.filter((r) => r.status === "hidden").length,
            onClick: () => handleFilterByStatus("hidden"),
          },
          {
            icon: <Check className="w-10 h-10 text-green-600" />,
            label: "Đã xử lý",
            count: reports.filter((r) => r.status === "published").length,
            onClick: () => handleFilterByStatus("published"),
          },
          {
            icon: <UserX className="w-10 h-10 text-red-600" />,
            label: "Vi phạm",
            count: reports.filter((r) => r.status === "reported").length,
            onClick: () => handleFilterByStatus("reported"),
          },
        ].map((item, index) => (
          <div key={index}>
            <button
              onClick={item.onClick}
              className="flex items-center w-full p-8 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition duration-200"
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

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Tìm kiếm theo người báo cáo hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="hidden">Chờ xử lý</option>
            <option value="published">Đã xử lý</option>
            <option value="reported">Vi phạm</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className=" overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Báo cáo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tương tác
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <img
                        className="h-10 w-10 rounded-full flex-shrink-0"
                        src={report.authorAvatar || "/placeholder.svg"}
                        alt={report.author}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {report.author}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                          Báo cáo từ người dùng
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-3">
                      {report.content}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {report.reports} báo cáo
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewReportDetails(report)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {report.status === "hidden" && (
                        <>
                          <button
                            onClick={() =>
                              setConfirmModal({
                                report,
                                newStatus: "published",
                                reason: null,
                              })
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Đánh dấu đã xử lý"
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              setConfirmModal({
                                report,
                                newStatus: "reported",
                                reason: null,
                              })
                            }
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Đánh dấu vi phạm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết báo cáo
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={selectedReport.authorAvatar || "/placeholder.svg"}
                      alt={selectedReport.author}
                    />
                    <div>
                      <h4 className="text-lg font-medium">
                        {selectedReport.author}
                      </h4>
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
                        {selectedReport.content}
                      </p>
                      {selectedReport.image && (
                        <img
                          className="mt-2 max-w-xs h-auto rounded"
                          src={selectedReport.image}
                          alt="Reported content"
                        />
                      )}
                    </div>
                  </div>

                  <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {selectedReport.likes} lượt thích
                      </span>
                      <span className="flex items-center">
                        {selectedReport.comments} bình luận
                      </span>
                      <span className="flex items-center">
                        {selectedReport.shares} chia sẻ
                      </span>
                    </div>
                    {selectedReport.reports > 0 && (
                      <span className="text-red-600 font-medium">
                        {selectedReport.reports} báo cáo
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  {selectedReport.status === "hidden" ? (
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          setConfirmModal({
                            report: selectedReport,
                            newStatus: "published",
                            reason: null,
                          })
                        }
                        disabled={isUpdating}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50"
                        title="Đánh dấu đã xử lý"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            report: selectedReport,
                            newStatus: "reported",
                            reason: null,
                          })
                        }
                        disabled={isUpdating}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Đánh dấu vi phạm"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-700 text-right">
                      Trạng thái hiện tại:{" "}
                      <span
                        className={`font-semibold ${
                          selectedReport.status === "published"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedReport.status === "published"
                          ? "Đã xử lý"
                          : "Đã đánh dấu vi phạm"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmModal && confirmModal.report && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận hành động
            </h2>
            <p className="text-gray-700 mb-2">
              Bạn có chắc muốn{" "}
              <span className="font-semibold text-red-600">
                {confirmModal.newStatus === "reported"
                  ? "đánh dấu vi phạm"
                  : "đánh dấu đã xử lý"}
              </span>{" "}
              báo cáo này không?
            </p>

            {confirmModal.newStatus === "reported" && (
              <>
                <label className="block text-sm text-gray-700 mb-1 mt-3">
                  Lý do <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Nhập lý do gửi đến người dùng..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </>
            )}

            {/* Buttons */}
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={() => {
                  setConfirmModal(null);
                  setReason("");
                }}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Huỷ
              </button>
              <button
                onClick={async () => {
                  if (confirmModal.newStatus === "reported" && !reason.trim()) {
                    alert("Vui lòng nhập lý do khi đánh dấu vi phạm.");
                    return;
                  }

                  if (confirmModal.report && confirmModal.newStatus !== null) {
                    await handleStatusChange(
                      confirmModal.report.id,
                      confirmModal.newStatus,
                      reason.trim() || undefined
                    );
                  }

                  // Nếu đang xem chi tiết thì cập nhật trạng thái luôn
                  if (
                    selectedReport?.id &&
                    confirmModal.report &&
                    selectedReport.id === confirmModal.report.id
                  ) {
                    setSelectedReport({
                      ...selectedReport,
                      status: confirmModal.newStatus!,
                    });
                  }

                  setConfirmModal(null);
                  setReason("");
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Xác nhận
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
    </div>
  );
}
