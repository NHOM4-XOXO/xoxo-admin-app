import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Trash2,
  Flag,
  Heart,
  MessageSquare,
  Share,
  Loader2,
  FileText,
  AlertTriangle,
  EyeOff,
} from "lucide-react";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../api/postAPI";
import type { Post } from "../types/Post.type";

export default function PostManagement() {
  // Redux hooks for data fetching and mutations
  const { data: posts = [], isLoading, error } = useGetPostsQuery();
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Filter posts based on search and filter criteria
  useEffect(() => {
    setFilteredPosts(
      posts.filter((post) => {
        const matchesSearch =
          post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || post.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    );
  }, [posts, searchTerm, statusFilter]);

  const getStatusBadge = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Đã đăng
          </span>
        );
      case "hidden":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Đã ẩn
          </span>
        );
      case "reported":
        return (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Bị báo cáo
          </span>
        );
    }
  };

  // const getStatusText = (status: Post["status"]) => {
  //   switch (status) {
  //     case "published":
  //       return "Đã đăng";
  //     case "hidden":
  //       return "Đã ẩn";
  //     case "reported":
  //       return "Bị báo cáo";
  //     default:
  //       return status;
  //   }
  // };

  const handleStatusChange = async (
    postId: number,
    newStatus: Post["status"]
  ) => {
    try {
      await updatePost({
        id: postId,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update post status:", error);
    }
  };

  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete.id).unwrap();
        setPostToDelete(null);
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const viewPostDetails = (post: Post) => {
    setSelectedPost(post);
    setShowPostModal(true);
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
        <p>Có lỗi xảy ra khi tải dữ liệu bài viết</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
          <p className="text-gray-600">
            Quản lý nội dung và hoạt động bài viết
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng bài viết</p>
              <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã đăng</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter((p) => p.status === "published").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <EyeOff className="w-8 h-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã ẩn</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter((p) => p.status === "hidden").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bị báo cáo</p>
              <p className="text-2xl font-bold text-gray-900">
                {posts.filter((p) => p.status === "reported").length}
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
              placeholder="Tìm kiếm theo tác giả hoặc nội dung..."
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
            <option value="published">Đã đăng</option>
            <option value="hidden">Đã ẩn</option>
            <option value="reported">Bị báo cáo</option>
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài viết
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
                  Báo cáo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
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
                              src={post.image || "/placeholder.svg"}
                              alt="Post image"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(post.status)}
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
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {post.reports} báo cáo
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Không có</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewPostDetails(post)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {post.status === "published" && (
                        <button
                          onClick={() => handleStatusChange(post.id, "hidden")}
                          disabled={isUpdating}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          title="Ẩn bài viết"
                        >
                          <Flag className="w-4 h-4" />
                        </button>
                      )}
                      {post.status === "hidden" && (
                        <button
                          onClick={() =>
                            handleStatusChange(post.id, "published")
                          }
                          disabled={isUpdating}
                          className="text-green-600 hover:text-green-900 disabled:opacity-50"
                          title="Hiển thị bài viết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setPostToDelete(post)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không có bài viết
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Không tìm thấy bài viết nào phù hợp với tiêu chí tìm kiếm.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa bài viết
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể
                hoàn tác.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setPostToDelete(null)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
                >
                  {isDeleting && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      {showPostModal && selectedPost && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết bài viết
                </h3>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={selectedPost.authorAvatar || "/placeholder.svg"}
                    alt={selectedPost.author}
                  />
                  <div>
                    <h4 className="text-lg font-medium">
                      {selectedPost.author}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {formatDate(selectedPost.createdAt)}
                    </p>
                    {getStatusBadge(selectedPost.status)}
                  </div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                  {selectedPost.image && (
                    <img
                      className="mt-4 max-w-full h-auto rounded-lg"
                      src={selectedPost.image || "/placeholder.svg"}
                      alt="Post content"
                    />
                  )}
                </div>
                <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-6">
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {selectedPost.likes} lượt thích
                    </span>
                    <span className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {selectedPost.comments} bình luận
                    </span>
                    <span className="flex items-center">
                      <Share className="h-4 w-4 mr-1" />
                      {selectedPost.shares} chia sẻ
                    </span>
                  </div>
                  {selectedPost.reports > 0 && (
                    <span className="text-red-600 font-medium">
                      {selectedPost.reports} báo cáo
                    </span>
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
