"use client";

import { Heart, MessageSquare, Share } from "lucide-react";
import type { Post } from "../../types/Post";
import { StatusBadge } from "../../components/PostManagement/StatusBadge";

interface PostModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export function PostModal({ post, isOpen, onClose }: PostModalProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Chi tiết bài viết
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                className="h-12 w-12 rounded-full"
                src={post.authorAvatar || "/placeholder.svg"}
                alt={post.author}
              />
              <div>
                <h4 className="text-lg font-medium">{post.author}</h4>
                <p className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
                <StatusBadge status={post.status} />
              </div>
            </div>
            <div className="border-t pt-4">
              <p className="text-gray-900 whitespace-pre-wrap">
                {post.content}
              </p>
              {post.image && (
                <img
                  className="mt-4 max-w-full h-auto rounded-lg"
                  src={
                    post.image ||
                    "https://images2.thanhnien.vn/zoom/686_429/528068263637045248/2023/4/6/2-cho-meo-shutterstock-1680795958168987499640-42-0-682-1024-crop-16807963234611742266511.jpg"
                  }
                  alt="Post content"
                />
              )}
            </div>
            <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes} lượt thích
                </span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {post.comments} bình luận
                </span>
                <span className="flex items-center">
                  <Share className="h-4 w-4 mr-1" />
                  {post.shares} chia sẻ
                </span>
              </div>
              {post.reports > 0 && (
                <span className="text-red-600 font-medium">
                  {post.reports} báo cáo
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
