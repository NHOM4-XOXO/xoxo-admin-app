import { useState, useEffect } from "react";
import {
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
import Tippy from "@tippyjs/react";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../api/postAPI";
import type { Post } from "../types/Post.type";
import CustomPagination from "../components/CustomPagination";
import { removeVietnameseTones } from "../components/removeVietnameseTones";
import FilterDropdown from "../components/FilterDropdown";
import SearchComponent from "../components/SearchComponent";
import "../index.css";

const optionListStatus = [
  { value: "all", label: "Tất cả trạng  thái" },
  { value: "published", label: "Đã đăng" },
  { value: "hidden", label: "Đã ẩn" },
  { value: "reported", label: "Bị báo cáo" },
];

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

  //Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);
  // Filter posts based on search and filter criteria
  useEffect(() => {
    const keyword = removeVietnameseTones(searchTerm.toLowerCase());
    setFilteredPosts(
      posts.filter((post) => {
        const matchesSearch =
          removeVietnameseTones(post.author.toLowerCase()).includes(keyword) ||
          removeVietnameseTones(post.content.toLowerCase()).includes(keyword);

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

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

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
        {[
          {
            icon: <FileText className="w-10 h-10 text-blue-600" />,
            label: "Tổng bài viết",
            count: posts.length,
            onClick: () => handleFilterByStatus("all"),
          },
          {
            icon: <Eye className="w-10 h-10 text-green-600" />,
            label: "Đã đăng",
            count: posts.filter((p) => p.status === "published").length,
            onClick: () => handleFilterByStatus("published"),
          },
          {
            icon: <EyeOff className="w-10 h-10 text-gray-600" />,
            label: "Đã ẩn",
            count: posts.filter((p) => p.status === "hidden").length,
            onClick: () => handleFilterByStatus("hidden"),
          },
          {
            icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
            label: "Bị báo cáo",
            count: posts.filter((p) => p.status === "reported").length,
            onClick: () => handleFilterByStatus("reported"),
          },
        ].map((item, index) => (
          <div key={index}>
            <button
              onClick={item.onClick}
              className="flex items-center w-full p-8 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition duration-200"
            >
              {item.icon}
              <div className="ml-4 text-left">
                <p className="text-base font-medium text-gray-600">
                  {item.label}
                </p>
                <p className="text-2xl font-bold text-gray-900">{item.count}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <SearchComponent
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <FilterDropdown
            optionList={optionListStatus}
            filter={statusFilter}
            setFilter={setStatusFilter}
          />
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
              {paginatedPosts.map((post) => (
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

                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <div className="flex space-x-3">
                      {/* Xem chi tiết */}
                      <Tippy
                        content="Xem chi tiết"
                        placement="bottom"
                        theme="small-text"
                        delay={[0, 0]}
                        hideOnClick={false}
                        interactive={false}
                      >
                        <button
                          onClick={() => viewPostDetails(post)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tippy>

                      {/* Ẩn bài viết */}
                      {post.status === "published" && (
                        <Tippy
                          content="Ẩn bài viết"
                          placement="bottom"
                          theme="small-text"
                          delay={[0, 0]}
                          hideOnClick={false}
                          interactive={false}
                        >
                          <button
                            onClick={() =>
                              handleStatusChange(post.id, "hidden")
                            }
                            disabled={isUpdating}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 cursor-pointer"
                            title="Ẩn bài viết"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </Tippy>
                      )}
                      {/* Hiển thị bài viết */}
                      {post.status === "hidden" && (
                        <Tippy
                          content="Hiển thị bài viết"
                          placement="bottom"
                          theme="small-text"
                          delay={[0, 0]}
                          hideOnClick={false}
                          interactive={false}
                        >
                          <button
                            onClick={() =>
                              handleStatusChange(post.id, "published")
                            }
                            disabled={isUpdating}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50 cursor-pointer"
                            title="Hiển thị bài viết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Tippy>
                      )}
                      {/* Xoá bài viết */}
                      <Tippy
                        content="Xoá bài viết"
                        placement="bottom"
                        theme="small-text"
                        hideOnClick={false}
                        delay={[0, 0]}
                        interactive={false}
                      >
                        <button
                          onClick={() => setPostToDelete(post)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tippy>
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
      {/* Pagination */}
      <CustomPagination
        currentPage={currentPage}
        pageSize={pageSize}
        total={filteredPosts.length}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  );
}
