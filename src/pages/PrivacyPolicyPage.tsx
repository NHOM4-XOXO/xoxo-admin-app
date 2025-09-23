import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại trang đăng nhập
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chính sách bảo mật
              </h1>
              <p className="text-gray-600 mt-2">
                Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Cam kết bảo mật thông tin
            </h2>
            <p className="text-gray-700 leading-relaxed">
              XOXO Social Network cam kết bảo vệ quyền riêng tư và thông tin cá
              nhân của người dùng và quản trị viên. Chính sách này mô tả cách
              chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn
              khi sử dụng Admin Panel.
            </p>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Thông tin chúng tôi thu thập
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="font-semibold">Thông tin đăng nhập:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email và mật khẩu quản trị viên</li>
                <li>Thông tin xác thực hai bước (nếu có)</li>
                <li>Địa chỉ IP và thông tin thiết bị</li>
              </ul>

              <h3 className="font-semibold">Thông tin hoạt động:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nhật ký truy cập và thao tác trong hệ thống</li>
                <li>Thời gian đăng nhập và đăng xuất</li>
                <li>Các chức năng được sử dụng</li>
                <li>Dữ liệu người dùng được quản lý</li>
              </ul>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Cách chúng tôi sử dụng thông tin
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Thông tin được thu thập chỉ được sử dụng cho các mục đích sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Xác thực và phân quyền truy cập hệ thống</li>
                <li>Ghi nhận và theo dõi hoạt động quản trị</li>
                <li>Đảm bảo an ninh và bảo mật hệ thống</li>
                <li>Cung cấp hỗ trợ kỹ thuật khi cần thiết</li>
                <li>Phân tích và cải thiện hiệu suất hệ thống</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Bảo vệ thông tin
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="font-semibold">Biện pháp kỹ thuật:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Mã hóa dữ liệu khi truyền tải (SSL/TLS)</li>
                <li>Mã hóa mật khẩu bằng thuật toán an toàn</li>
                <li>Tường lửa và hệ thống giám sát 24/7</li>
                <li>Sao lưu dữ liệu định kỳ</li>
                <li>Kiểm tra bảo mật thường xuyên</li>
              </ul>

              <h3 className="font-semibold">Biện pháp quản lý:</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Phân quyền truy cập theo từng vai trò</li>
                <li>Đào tạo nhân viên về bảo mật thông tin</li>
                <li>Quy trình xử lý sự cố bảo mật</li>
                <li>Kiểm toán và đánh giá định kỳ</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Chia sẻ thông tin
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của
                bạn với bên thứ ba, trừ các trường hợp sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Khi có yêu cầu từ cơ quan pháp luật có thẩm quyền</li>
                <li>Để bảo vệ quyền lợi và an toàn của XOXO và người dùng</li>
                <li>
                  Với các nhà cung cấp dịch vụ được ủy quyền (có thỏa thuận bảo
                  mật)
                </li>
                <li>Khi có sự đồng ý rõ ràng từ bạn</li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Lưu trữ thông tin
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Thông tin của bạn được lưu trữ trong thời gian cần thiết để:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Duy trì tài khoản quản trị viên hoạt động</li>
                <li>Tuân thủ các yêu cầu pháp lý (tối thiểu 3 năm)</li>
                <li>Giải quyết tranh chấp hoặc khiếu nại</li>
                <li>Phục vụ mục đích kiểm toán nội bộ</li>
              </ul>
              <p className="leading-relaxed mt-4">
                Khi tài khoản quản trị viên bị chấm dứt, dữ liệu sẽ được xóa
                hoặc ẩn danh hóa sau 30 ngày, trừ những thông tin cần thiết để
                tuân thủ pháp luật.
              </p>
            </div>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Quyền của quản trị viên
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Với tư cách là quản trị viên, bạn có các quyền sau:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Yêu cầu xem thông tin cá nhân được lưu trữ</li>
                <li>Đề nghị cập nhật hoặc sửa đổi thông tin không chính xác</li>
                <li>Yêu cầu xóa thông tin (trong phạm vi cho phép)</li>
                <li>Rút lại sự đồng ý xử lý dữ liệu (nếu áp dụng)</li>
                <li>Khiếu nại về việc xử lý dữ liệu không đúng quy định</li>
              </ul>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Cập nhật chính sách
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chính sách bảo mật này có thể được cập nhật định kỳ để phản ánh
              các thay đổi về quy định pháp luật hoặc cải tiến hệ thống. Mọi
              thay đổi quan trọng sẽ được thông báo trước ít nhất 30 ngày qua
              email hoặc thông báo trong hệ thống.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Liên hệ về bảo mật
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                Nếu bạn có câu hỏi hoặc lo ngại về chính sách bảo mật này, vui
                lòng liên hệ:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-3">
                  Bộ phận Bảo mật Thông tin
                </h3>
                <p>
                  <strong>Email:</strong> admin@xoxo.com
                </p>
                <p>
                  <strong>Điện thoại:</strong> (+84) 774114028
                </p>
                <p>
                  <strong>Địa chỉ:</strong> 167 Lê Trọng Tấn, Quận Tân Phú,
                  TP.HCM
                </p>
                <p className="mt-3 text-sm text-gray-600">
                  Thời gian phản hồi: Trong vòng 48 giờ làm việc
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
