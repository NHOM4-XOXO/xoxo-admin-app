import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Check,
  X,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface Report {
  id: number;
  type: "spam" | "inappropriate" | "harassment" | "fake" | "other";
  reporter: string;
  reporterAvatar: string;
  targetType: "post" | "comment" | "user";
  targetId: number;
  targetContent: string;
  targetAuthor: string;
  reason: string;
  createdAt: string;
  status: "pending" | "reviewing" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high";
}

const mockReports: Report[] = [
  {
    id: 1,
    type: "spam",
    reporter: "Nguyễn Văn A",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    targetType: "post",
    targetId: 123,
    targetContent:
      "Quảng cáo sản phẩm không rõ nguồn gốc, có thể là lừa đảo...",
    targetAuthor: "Tài khoản spam",
    reason: "Bài viết này là spam quảng cáo",
    createdAt: "2024-01-15T10:30:00Z",
    status: "pending",
    priority: "high",
  },
  {
    id: 2,
    type: "inappropriate",
    reporter: "Trần Thị B",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    targetType: "comment",
    targetId: 456,
    targetContent: "Nội dung không phù hợp với cộng đồng...",
    targetAuthor: "User123",
    reason: "Nội dung không phù hợp",
    createdAt: "2024-01-14T15:45:00Z",
    status: "reviewing",
    priority: "medium",
  },
  {
    id: 3,
    type: "harassment",
    reporter: "Lê Văn C",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    targetType: "user",
    targetId: 789,
    targetContent: "Người dùng này liên tục quấy rối tôi",
    targetAuthor: "BadUser",
    reason: "Quấy rối và bắt nạt",
    createdAt: "2024-01-13T09:20:00Z",
    status: "resolved",
    priority: "high",
  },
  {
    id: 4,
    type: "fake",
    reporter: "Phạm Thị D",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    targetType: "post",
    targetId: 101,
    targetContent: "Tin tức giả mạo về sự kiện chính trị...",
    targetAuthor: "FakeNews",
    reason: "Thông tin sai lệch",
    createdAt: "2024-01-12T14:15:00Z",
    status: "dismissed",
    priority: "low",
  },
  {
    id: 5,
    type: "other",
    reporter: "Hoàng Văn E",
    reporterAvatar: "/placeholder.svg?height=40&width=40",
    targetType: "comment",
    targetId: 202,
    targetContent: "Vi phạm quy định khác của cộng đồng",
    targetAuthor: "Violator",
    reason: "Vi phạm quy định cộng đồng",
    createdAt: "2024-01-11T11:00:00Z",
    status: "pending",
    priority: "medium",
  },
];

export default function ReportManagement() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "reviewing" | "resolved" | "dismissed"
  >("all");
  const [typeFilter, setTypeFilter] = useState<
    "all" | "spam" | "inappropriate" | "harassment" | "fake" | "other"
  >("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.targetContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: Report["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Chờ xử lý
          </span>
        );
      case "reviewing":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            Đang xem xét
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Đã xử lý
          </span>
        );
      case "dismissed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            Đã bỏ qua
          </span>
        );
    }
  };

  const getTypeBadge = (type: Report["type"]) => {
    const typeMap = {
      spam: { label: "Spam", color: "bg-red-100 text-red-800" },
      inappropriate: {
        label: "Không phù hợp",
        color: "bg-orange-100 text-orange-800",
      },
      harassment: { label: "Quấy rối", color: "bg-purple-100 text-purple-800" },
      fake: { label: "Tin giả", color: "bg-pink-100 text-pink-800" },
      other: { label: "Khác", color: "bg-gray-100 text-gray-800" },
    };
    const typeInfo = typeMap[type];
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${typeInfo.color}`}
      >
        {typeInfo.label}
      </span>
    );
  };

  const getPriorityIcon = (priority: Report["priority"]) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <AlertTriangle className="h-4 w-4 text-green-500" />;
    }
  };

  const viewReportDetails = (report: Report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  //Để tạm sau này kết nối với API
  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => setReports(data));
  }, []);

  //  const handleStatusChange = (
  //    reportId: number,
  //    newStatus: Report["status"]
  //  ) => {
  //    setReports(
  //      reports.map((report) =>
  //        report.id === reportId ? { ...report, status: newStatus } : report
  //      )
  //    );
  //  };
  const handleStatusChange = async (
    reportId: number,
    newStatus: Report["status"]
  ) => {
    await fetch(`/api/reports/${reportId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý báo cáo</h1>
        <p className="text-gray-600">Xử lý các báo cáo vi phạm từ người dùng</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo người báo cáo, nội dung hoặc lý do..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="reviewing">Đang xem xét</option>
                <option value="resolved">Đã xử lý</option>
                <option value="dismissed">Đã bỏ qua</option>
              </select>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tất cả loại</option>
              <option value="spam">Spam</option>
              <option value="inappropriate">Không phù hợp</option>
              <option value="harassment">Quấy rối</option>
              <option value="fake">Tin giả</option>
              <option value="other">Khác</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Báo cáo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đối tượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
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
                        src={report.reporterAvatar || "/placeholder.svg"}
                        alt={report.reporter}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reporter}
                          </div>
                          {getPriorityIcon(report.priority)}
                        </div>
                        <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                          {report.reason}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTypeBadge(report.type)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div className="font-medium">
                        {report.targetType === "post"
                          ? "Bài viết"
                          : report.targetType === "comment"
                          ? "Bình luận"
                          : "Người dùng"}
                      </div>
                      <div className="text-gray-600">
                        bởi {report.targetAuthor}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {report.targetContent}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(report.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(report.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewReportDetails(report)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {report.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "reviewing")
                            }
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="Xem xét"
                          >
                            <Clock className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "resolved")
                            }
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Đánh dấu đã xử lý"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "dismissed")
                            }
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Bỏ qua"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {report.status === "reviewing" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "resolved")
                            }
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Đánh dấu đã xử lý"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(report.id, "dismissed")
                            }
                            className="text-gray-600 hover:text-gray-900 p-1"
                            title="Bỏ qua"
                          >
                            <X className="h-4 w-4" />
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
      </div>

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
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
                      src={selectedReport.reporterAvatar || "/placeholder.svg"}
                      alt={selectedReport.reporter}
                    />
                    <div>
                      <h4 className="text-lg font-medium">
                        {selectedReport.reporter}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedReport.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getPriorityIcon(selectedReport.priority)}
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Loại báo cáo:
                      </span>
                      <div className="mt-1">
                        {getTypeBadge(selectedReport.type)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Đối tượng:
                      </span>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedReport.targetType === "post"
                          ? "Bài viết"
                          : selectedReport.targetType === "comment"
                          ? "Bình luận"
                          : "Người dùng"}
                        bởi {selectedReport.targetAuthor}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-500">
                      Lý do báo cáo:
                    </span>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedReport.reason}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Nội dung bị báo cáo:
                    </span>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">
                        {selectedReport.targetContent}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedReport.status === "pending" && (
                  <div className="border-t pt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "dismissed");
                        setShowReportModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Bỏ qua
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "reviewing");
                        setShowReportModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    >
                      Bắt đầu xem xét
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedReport.id, "resolved");
                        setShowReportModal(false);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                    >
                      Đánh dấu đã xử lý
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
