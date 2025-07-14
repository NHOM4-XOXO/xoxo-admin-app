"use client";

import { Eye, Trash2, Flag, Heart, MessageSquare, Share } from "lucide-react";
import type { Post } from "../../types/Post";
import { StatusBadge } from "../../components/PostManagement/StatusBadge";

interface PostRowProps {
  post: Post;
  onViewDetails: (post: Post) => void;
  onStatusChange: (postId: number, newStatus: Post["status"]) => void;
  onDelete: (postId: number) => void;
}

export function PostRow({
  post,
  onViewDetails,
  onStatusChange,
  onDelete,
}: PostRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div className="flex items-start space-x-3">
          <img
            className="h-10 w-10 rounded-full flex-shrink-0"
            src={post.authorAvatar || "/placeholder.svg"}
            alt={post.author}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900">
              {post.author}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
              {post.content}
            </div>
            {post.image && (
              <div className="mt-2">
                <img
                  className="h-16 w-24 object-cover rounded"
                  src={
                    post.image ||
                    "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/4/6/2-cho-meo-shutterstock-1680795958168987499640-42-0-682-1024-crop-16807963234611742266511.jpg"
                  }
                  alt="Post image"
                />
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={post.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatDate(post.createdAt)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="space-y-1">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Heart className="h-3 w-3 mr-1" />
              {post.likes}
            </span>
            <span className="flex items-center">
              <MessageSquare className="h-3 w-3 mr-1" />
              {post.comments}
            </span>
            <span className="flex items-center">
              <Share className="h-3 w-3 mr-1" />
              {post.shares}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {post.reports > 0 ? (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
            {post.reports} báo cáo
          </span>
        ) : (
          <span className="text-sm text-gray-500">Không có</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={() => onViewDetails(post)}
            className="text-blue-600 hover:text-blue-900 p-1"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
          {post.status === "published" && (
            <button
              onClick={() => onStatusChange(post.id, "hidden")}
              className="text-yellow-600 hover:text-yellow-900 p-1"
              title="Ẩn bài viết"
            >
              <Flag className="h-4 w-4" />
            </button>
          )}
          {post.status === "hidden" && (
            <button
              onClick={() => onStatusChange(post.id, "published")}
              className="text-green-600 hover:text-green-900 p-1"
              title="Hiển thị bài viết"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(post.id)}
            className="text-red-600 hover:text-red-900 p-1"
            title="Xóa bài viết"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
