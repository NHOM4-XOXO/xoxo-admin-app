// Error handling utilities cho toàn bộ app

export const getVietnameseErrorMessage = (
  status: number,
  context?: string
): string => {
  if (status >= 500) {
    return "Lỗi máy chủ nội bộ, vui lòng thử lại sau!";
  }

  if (context === "login") {
    switch (status) {
      case 403:
        return "Tài khoản không có quyền truy cập Admin Panel!";
      case 423:
        return "Tài khoản đã bị khóa tạm thời!";
      case 429:
        return "Đăng nhập quá nhiều lần, vui lòng thử lại sau!";
      default:
        return "Email hoặc mật khẩu không chính xác!";
    }
  }

  if (context === "changePassword") {
    switch (status) {
      case 400:
        return "Mật khẩu hiện tại không đúng hoặc mật khẩu mới không hợp lệ!";
      case 401:
        return "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!";
      case 403:
        return "Bạn không có quyền thay đổi mật khẩu!";
    }
  }

  if (context === "userManagement") {
    switch (status) {
      case 400:
        return "Thông tin người dùng không hợp lệ!";
      case 401:
        return "Phiên đăng nhập hết hạn!";
      case 403:
        return "Bạn không có quyền quản lý người dùng!";
      case 404:
        return "Không tìm thấy người dùng!";
      case 409:
        return "Email đã được sử dụng!";
    }
  }

  if (context === "postManagement") {
    switch (status) {
      case 400:
        return "Thông tin bài viết không hợp lệ!";
      case 401:
        return "Phiên đăng nhập hết hạn!";
      case 403:
        return "Bạn không có quyền quản lý bài viết!";
      case 404:
        return "Không tìm thấy bài viết!";
    }
  }

  if (context === "reportManagement") {
    switch (status) {
      case 400:
        return "Thông tin báo cáo không hợp lệ!";
      case 401:
        return "Phiên đăng nhập hết hạn!";
      case 403:
        return "Bạn không có quyền xử lý báo cáo!";
      case 404:
        return "Không tìm thấy báo cáo!";
    }
  }

  // Generic messages
  switch (status) {
    case 400:
      return "Thông tin không hợp lệ!";
    case 401:
      return "Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!";
    case 403:
      return "Bạn không có quyền thực hiện thao tác này!";
    case 404:
      return "Không tìm thấy thông tin yêu cầu!";
    case 409:
      return "Dữ liệu đã tồn tại hoặc xung đột!";
    case 422:
      return "Dữ liệu đầu vào không hợp lệ!";
    case 423:
      return "Tài nguyên đã bị khóa!";
    case 429:
      return "Quá nhiều yêu cầu, vui lòng thử lại sau!";
    case 500:
      return "Lỗi máy chủ nội bộ!";
    case 502:
      return "Máy chủ đang bảo trì!";
    case 503:
      return "Dịch vụ tạm thời không khả dụng!";
    default:
      if (status >= 500) {
        return "Lỗi máy chủ, vui lòng liên hệ quản trị viên!";
      } else if (status >= 400) {
        return "Yêu cầu không hợp lệ!";
      } else {
        return "Có lỗi không xác định xảy ra!";
      }
  }
};

// Helper function để handle API errors trong RTK Query
export const handleRTKQueryError = (error: any, context?: string): string => {
  if (error?.status) {
    return getVietnameseErrorMessage(error.status, context);
  }

  if (error?.data?.message) {
    // Nếu vẫn muốn dùng message từ BE trong một số trường hợp
    return error.data.message;
  }

  return "Có lỗi không xác định xảy ra!";
};

// Network error messages
export const getNetworkErrorMessage = (): string => {
  return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!";
};
