import React from 'react'
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  Eye, 
  MessageSquare,
  UserPlus,
  Settings,
  Bell,
  ArrowRight
} from 'lucide-react'

const Dashboard = () => {
  // Mock data - trong thực tế sẽ fetch từ API
  const stats = {
    totalUsers: 12540,
    newUsersToday: 234,
    totalPosts: 8750,
    newPostsToday: 156,
    pendingReports: 23,
    onlineUsers: 1840,
    engagementRate: 78.5
  }

  const recentActivities = [
    { id: 1, type: 'report', message: 'Báo cáo nội dung không phù hợp từ user @john_doe', time: '2 phút trước', urgent: true },
    { id: 2, type: 'user', message: 'Người dùng mới đăng ký: @new_user123', time: '5 phút trước', urgent: false },
    { id: 3, type: 'post', message: 'Bài viết viral: "Trending topic hôm nay"', time: '10 phút trước', urgent: false },
    { id: 4, type: 'report', message: 'Báo cáo spam từ user @suspicious_acc', time: '15 phút trước', urgent: true },
    { id: 5, type: 'user', message: 'User @popular_user đạt 10K followers', time: '20 phút trước', urgent: false }
  ]

  const topPosts = [
    { id: 1, title: 'Xu hướng công nghệ 2024', likes: 1250, comments: 89, shares: 156 },
    { id: 2, title: 'Kinh nghiệm học lập trình', likes: 980, comments: 67, shares: 123 },
    { id: 3, title: 'Review smartphone mới nhất', likes: 750, comments: 45, shares: 89 }
  ]

  const MetricCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
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
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% so với hôm qua
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  )

  const ActivityItem = ({ activity }: { activity: { message: string; time: string; urgent: boolean } }) => (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
      <div className={`w-2 h-2 rounded-full mt-2 ${activity.urgent ? 'bg-red-500' : 'bg-green-500'}`} />
      <div className="flex-1">
        <p className="text-sm text-gray-900">{activity.message}</p>
        <p className="text-xs text-gray-500">{activity.time}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hoạt động hệ thống</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Bell className="w-4 h-4 mr-2" />
            Thông báo
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Cài đặt
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Cảnh báo: {stats.pendingReports} báo cáo cần xử lý</h3>
            <p className="text-sm text-red-700">Có các báo cáo nghiêm trọng cần được xem xét ngay lập tức</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Tổng người dùng"
          value={stats.totalUsers.toLocaleString()}
          change={5.2}
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Người dùng mới hôm nay"
          value={stats.newUsersToday}
          change={12.3}
          icon={UserPlus}
          color="green"
        />
        <MetricCard
          title="Tổng bài viết"
          value={stats.totalPosts.toLocaleString()}
          change={-2.1}
          icon={FileText}
          color="purple"
        />
        <MetricCard
          title="Người dùng online"
          value={stats.onlineUsers.toLocaleString()}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h2>
          </div>
          <div className="p-6">
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
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
              <h2 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Quản lý người dùng</p>
                    <p className="text-sm text-gray-500">Xem và quản lý tài khoản</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Xử lý báo cáo</p>
                    <p className="text-sm text-gray-500">{stats.pendingReports} báo cáo chờ xử lý</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Quản lý bài viết</p>
                    <p className="text-sm text-gray-500">Kiểm duyệt và quản lý nội dung</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Top Posts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Bài viết nổi bật</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topPosts.map((post) => (
                  <div key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
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
            <h2 className="text-lg font-semibold text-gray-900">Người dùng mới (7 ngày qua)</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Hoạt động đăng bài</h2>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Biểu đồ sẽ được hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard