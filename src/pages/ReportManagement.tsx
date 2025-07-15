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
import { useGetReportsQuery, useUpdateReportMutation } from "../api/reportApi";
import type { Report } from "../types/Report.type";

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

  // Filter reports based on search and filter criteria
  useEffect(() => {
    setFilteredReports(
      reports.filter((report) => {
        const matchesSearch =
          report.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || report.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    );
  }, [reports, searchTerm, statusFilter]);

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
    newStatus: Report["status"]
  ) => {
    try {
      await updateReport({
        id: reportId,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update report status:", error);
    }
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
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <ShieldAlert className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng báo cáo</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.status === "hidden").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Check className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã xử lý</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.status === "published").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <UserX className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Vi phạm</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter((r) => r.status === "reported").length}
              </p>
            </div>
          </div>
        </div>
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
        <div className="overflow-x-auto">
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
              {filteredReports.map((report) => (
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
                              handleStatusChange(report.id, "published")
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Đánh dấu đã xử lý"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "reported")
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

                <div className="border-t pt-4 flex justify-end space-x-3">
                  {selectedReport.status !== "reported" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "reported");
                        setShowReportModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                    >
                      Đánh dấu vi phạm
                    </button>
                  )}
                  {selectedReport.status !== "published" && (
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "published");
                        setShowReportModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      Đánh dấu đã xử lý
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
