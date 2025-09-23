import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-bold text-gray-900">
            Điều khoản dịch vụ
          </h1>
          <p className="text-gray-600 mt-2">
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Chấp nhận điều khoản
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Bằng cách truy cập và sử dụng Admin Panel của XOXO Social Network,
              bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều
              kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều
              khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Quyền truy cập và sử dụng
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Admin Panel được cung cấp cho các quản trị viên được ủy quyền để
                quản lý và điều hành mạng xã hội XOXO. Việc sử dụng hệ thống này
                phải tuân thủ:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Chỉ sử dụng tài khoản được cấp phát chính thức</li>
                <li>Không chia sẻ thông tin đăng nhập với bên thứ ba</li>
                <li>Sử dụng các chức năng đúng mục đích và có trách nhiệm</li>
                <li>Tuân thủ các quy định về bảo mật thông tin</li>
                <li>Báo cáo ngay lập tức mọi hoạt động bất thường</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. Trách nhiệm của quản trị viên
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Với tư cách là quản trị viên, bạn có trách nhiệm:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Quản lý người dùng một cách công bằng và minh bạch</li>
                <li>Kiểm duyệt nội dung tuân thủ tiêu chuẩn cộng đồng</li>
                <li>Xử lý báo cáo và khiếu nại kịp thời</li>
                <li>Bảo vệ thông tin người dùng và dữ liệu hệ thống</li>
                <li>Không lạm dụng quyền hạn vì mục đích cá nhân</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              4. Bảo mật và quyền riêng tư
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi cam kết bảo vệ thông tin và dữ liệu trong hệ thống. Quản
              trị viên phải đảm bảo rằng mọi thông tin được xử lý tuân thủ các
              quy định về bảo vệ dữ liệu cá nhân và chỉ được sử dụng cho mục
              đích quản lý hệ thống.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              5. Hành vi bị cấm
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                Các hành vi sau đây bị nghiêm cấm khi sử dụng Admin Panel:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Truy cập trái phép vào các chức năng không được phép</li>
                <li>Thay đổi, xóa hoặc phá hoại dữ liệu hệ thống</li>
                <li>Sử dụng hệ thống cho mục đích thương mại cá nhân</li>
                <li>Chia sẻ thông tin nhạy cảm ra bên ngoài</li>
                <li>Tạo tài khoản giả mạo hoặc spam</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              6. Chấm dứt dịch vụ
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi có quyền tạm dừng hoặc chấm dứt quyền truy cập của bạn
              vào Admin Panel mà không cần thông báo trước nếu bạn vi phạm các
              điều khoản này hoặc có hành vi có thể gây hại đến hệ thống và
              người dùng.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              7. Thay đổi điều khoản
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Chúng tôi có quyền cập nhật và thay đổi các điều khoản này bất cứ
              lúc nào. Mọi thay đổi sẽ được thông báo qua email hoặc thông báo
              trong hệ thống. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi
              đồng nghĩa với việc bạn chấp nhận các điều khoản mới.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              8. Liên hệ
            </h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng
                liên hệ với chúng tôi:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>Email:</strong> owner@xoxo.com
                </p>
                <p>
                  <strong>Điện thoại:</strong> (+84) 774114028
                </p>
                <p>
                  <strong>Địa chỉ:</strong> 167 Lê Trọng Tấn, Quận Tân Phú,
                  TP.HCM
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
