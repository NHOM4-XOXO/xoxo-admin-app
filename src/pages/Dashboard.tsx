import React from "react";
import {
  Users,
  FileText,
  AlertTriangle,
  TrendingUp,
  Eye,
  MessageSquare,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useNavigate } from "react-router-dom";
import {
  useGetActivitiesQuery,
  useGetChartDataQuery,
  useGetStatsQuery,
  useGetTopPostsQuery,
} from "../api/dashboardApi";

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: stats } = useGetStatsQuery();
  const { data: recentActivities } = useGetActivitiesQuery();
  const { data: topPosts } = useGetTopPostsQuery();
  const { data: chartData } = useGetChartDataQuery();

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ComponentType<{ className?: string }>;
    color?: string;
  }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p
              className={`text-sm ${
                change > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {change > 0 ? "+" : ""}
              {change}% so với hôm qua
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({
    activity,
  }: {
    activity: { message: string; time: string; urgent: boolean };
  }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div
        className={`w-2 h-2 rounded-full mt-2 ${
          activity.urgent ? "bg-red-500" : "bg-green-500"
        }`}
      />
      <div className="flex-1">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hoạt động hệ thống</p>
      </div>

      {/* Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Cảnh báo: {stats?.pendingReports || 0} báo cáo cần xử lý
            </h3>
            <p className="text-sm text-red-700">
              Có các báo cáo nghiêm trọng cần được xem xét ngay lập tức
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng người dùng"
          value={stats?.totalUsers.toLocaleString() || 0}
          change={5.2}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Người dùng mới hôm nay"
          value={stats?.newUsersToday || 0}
          change={12.3}
          icon={UserPlus}
          color="green"
        />
        <MetricCard
          title="Tổng bài viết"
          value={stats?.totalPosts.toLocaleString() || 0}
          change={-2.1}
          icon={FileText}
          color="purple"
        />
        <MetricCard
          title="Người dùng online"
          value={stats?.onlineUsers.toLocaleString() || 0}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Hoạt động gần đây
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {recentActivities?.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center ">
                Xem tất cả hoạt động
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Thao tác nhanh
              </h2>
            </div>
            <div className="p-6 space-y-3">
              <button
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer"
                onClick={() => navigate("/users")}
              >
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Quản lý người dùng
                    </p>
                    <p className="text-sm text-gray-500">
                      Xem và quản lý tài khoản
                    </p>
                  </div>
                </div>
              </button>
              <button
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer"
                onClick={() => navigate("/reports")}
              >
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Xử lý báo cáo</p>
                    <p className="text-sm text-gray-500">
                      {stats?.pendingReports || 0} báo cáo chờ xử lý
                    </p>
                  </div>
                </div>
              </button>
              <button
                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 cursor-pointer"
                onClick={() => navigate("/posts")}
              >
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Quản lý bài viết
                    </p>
                    <p className="text-sm text-gray-500">
                      Kiểm duyệt và quản lý nội dung
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Top Posts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Bài viết nổi bật
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topPosts?.map((post) => (
                  <div
                    key={post.id}
                    className="border-b border-gray-100 pb-4 last:border-b-0"
                  >
                    <h3 className="font-medium text-gray-900 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {post.likes}
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.comments}
                      </span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Người dùng mới (7 ngày qua)
            </h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData?.userGrowth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${
                        date.getMonth() + 1
                      }/${date.getFullYear()}`;
                    }}
                    formatter={(value) => [value, "Người dùng mới"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Hoạt động đăng bài
            </h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData?.postActivity || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${
                        date.getMonth() + 1
                      }/${date.getFullYear()}`;
                    }}
                    formatter={(value) => [value, "Bài viết"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="posts" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
