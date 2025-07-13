import type { Post } from "../../types/Post";

interface StatusBadgeProps {
  status: Post["status"];
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "published":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          Đã đăng
        </span>
      );
    case "hidden":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
          Đã ẩn
        </span>
      );
    case "reported":
      return (
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          Bị báo cáo
        </span>
      );
  }
}
