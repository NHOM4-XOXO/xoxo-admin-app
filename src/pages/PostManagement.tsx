import { useState, useEffect, useMemo } from "react";
import {
  Eye,
  Trash2,
  Flag,
  Heart,
  MessageSquare,
  Share,
  RefreshCw,
  FileText,
  AlertTriangle,
  EyeOff,
  X,
  Undo2,
} from "lucide-react";
import Tippy from "@tippyjs/react";
import {
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../api/postAPI";
import type { PostItemResponse } from "../types/Post.type";
import CustomPagination from "../components/CustomPagination";
import { removeVietnameseTones } from "../components/removeVietnameseTones";
import SearchComponent from "../components/SearchComponent";
import "../index.css";
import FilterDropdown from "../components/FilterDropdown";
import ConfirmModal from "../components/modals/ConfirmModal";
import { useLocation, useNavigate } from "react-router-dom";

const optionListStatus = [
  { value: "all", label: "Tất cả trạng  thái" },
  { value: "ACTIVE", label: "Đã đăng" },
  { value: "HIDDEN", label: "Đã ẩn" },
  { value: "DELETE", label: "Đã xóa" },
];

export default function PostManagement() {
  // Redux hooks for data fetching and mutations
  // Nếu response là { statusCode, message, data } thì lấy posts = data?.data || []
  const { data: postsResponse, isLoading, error } = useGetPostsQuery();
  // const rawItems = Array.isArray(postsResponse)
  //   ? (postsResponse as any[])
  //   : Array.isArray((postsResponse as any)?.data)
  //   ? ((postsResponse as any).data as any[])
  //   : [];

  // const posts: PostItemResponse[] = rawItems.map((it) =>
  //   it?.post
  //     ? { ...(it.post as PostItemResponse), media: it.media || [] }
  //     : (it as PostItemResponse)
  // );

  // const uniquePosts = (() => {
  //   const m = new Map<number | string, PostItemResponse>();
  //   posts.forEach((p) => {
  //     if (p && p.id != null) m.set(p.id, p);
  //   });
  //   return Array.from(m.values());
  // })();

  // const sortedPosts = [...uniquePosts].sort((a, b) => {
  //   const aDeleted = a.status === "DELETED" || a.status === "DELETE";
  //   const bDeleted = b.status === "DELETED" || b.status === "DELETE";
  //   if (aDeleted !== bDeleted) return aDeleted ? 1 : -1;
  //   return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  // });
  const posts = useMemo(() => {
    const items = Array.isArray(postsResponse)
      ? (postsResponse as any[])
      : Array.isArray((postsResponse as any)?.data)
      ? ((postsResponse as any).data as any[])
      : [];
    return items.map((it) =>
      it?.post ? { ...(it.post as PostItemResponse), media: it.media || [] } : (it as PostItemResponse)
    );
  }, [postsResponse]);

  const uniquePosts = useMemo(() => {
    const m = new Map<number | string, PostItemResponse>();
    posts.forEach((p) => {
      if (p && p.id != null) m.set(p.id, p);
    });
    return Array.from(m.values());
  }, [posts]);

  const sortedPosts = useMemo(() => {
    return [...uniquePosts].sort((a, b) => {
      const aDeleted = a.status === "DELETED" || a.status === "DELETE";
      const bDeleted = b.status === "DELETED" || b.status === "DELETE";
      if (aDeleted !== bDeleted) return aDeleted ? 1 : -1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });
  }, [uniquePosts]);

  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Local state for UI
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState<PostItemResponse | null>(
    null
  );
  const [showPostModal, setShowPostModal] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
    const toggleCaption = (id: number) =>
      setExpandedPostId((prev) => (prev === id ? null : id));
  const [showFullModalContent, setShowFullModalContent] = useState(false);

  const [filteredPosts, setFilteredPosts] = useState<PostItemResponse[]>([]);

  //Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchTerm]);

  // Filter posts based on search and filter criteria
  useEffect(() => {
    const keyword = removeVietnameseTones(searchTerm.toLowerCase());
    setFilteredPosts(
      sortedPosts.filter((post: PostItemResponse) => {
        // Tìm kiếm theo tên tác giả hoặc nội dung
        const authorName = `${post.authorFirstName || ""} ${
          post.authorLastName || ""
        }`.trim();
        const matchesSearch =
          removeVietnameseTones(authorName.toLowerCase()).includes(keyword) ||
          removeVietnameseTones((post.content || "").toLowerCase()).includes(
            keyword
          );

        const matchesStatus =
          statusFilter === "all" || post.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
    );
  }, [posts, searchTerm, statusFilter]);

  const [confirmModal, setConfirmModal] = useState<{
    message: string;
    onConfirm: () => Promise<void> | void;
    colorClass?: string;
    titleClass?: string;
  } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ...existing state: showPostModal, selectedPost, posts ...
  const [postNotFound, setPostNotFound] = useState<{
    id: string;
    message?: string;
  } | null>(null);
  const [originReportId, setOriginReportId] = useState<string | null>(null);
  const [originReportStatus, setOriginReportStatus] = useState<string | null>(
    null
  );
  // Open modal and set URL query param
  const openPostModal = (post: any) => {
    setSelectedPost(post);
    setShowPostModal(true);
    setShowFullModalContent(false);
    navigate(`${location.pathname}?postId=${post.id}`, { replace: false });
  };

  // Close modal and remove query param
  //  const closePostModal = () => {
  //    setShowPostModal(false);
  //    setSelectedPost(null);
  //    // remove query param
  //    navigate(location.pathname, { replace: true });
  //  };

  // On mount: if ?postId= exists, try open that post's modal
  // ...existing code...
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const postId = params.get("postId");
    const reportId = params.get("reportId") || null;
    const reportStatus = params.get("reportStatus") || null;
    setOriginReportId(reportId);
    setOriginReportStatus(reportStatus);

    if (!postId) {
      setShowPostModal(false);
      setSelectedPost(null);
      setPostNotFound(null);
      return;
    }

    // 1) tìm trong danh sách đã load
    const found =
      posts?.find((p: any) => String(p.id) === postId) ||
      filteredPosts?.find((p: any) => String(p.id) === postId) ||
      sortedPosts.find((p: any) => String(p.id) === postId);

    // Nếu tìm thấy trong list nhưng status là DELETED => hiển thị not-found
    if (found) {
      if (found.status === "DELETED" || found.status === "DELETE") {
        setSelectedPost(null);
        setPostNotFound({
          id: postId,
          message: "Bài viết đã bị xóa hoặc không tồn tại.",
        });
        setShowPostModal(true);
        return;
      }

      setSelectedPost(found);
      setShowPostModal(true);
      setPostNotFound(null);
      return;
    }

    // 2) nếu chưa có trong list -> fetch single post (nếu backend có endpoint)
    (async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL || "";
        const res = await fetch(
          `${apiBase}/api/admin/posts/${encodeURIComponent(postId)}`,
          {
            credentials: "include",
          }
        );

        // debug
        console.log("fetch post by id", postId, "status", res.status);

        // treat 404 / 204 / no-content as not found
        if (res.status === 404 || res.status === 204) {
          setSelectedPost(null);
          setShowPostModal(true);
          setPostNotFound({
            id: postId,
            message: "Bài viết đã bị xóa hoặc không tồn tại.",
          });
          return;
        }

        if (!res.ok) {
          // other error -> show notification inside modal
          setSelectedPost(null);
          setShowPostModal(true);
          setPostNotFound({
            id: postId,
            message: "Không thể tải bài viết (lỗi server).",
          });
          return;
        }

        const json = await res.json();
        const p = json?.data || json;
        const normalized =
          p && p.post
            ? { ...(p.post as PostItemResponse), media: p.media || [] }
            : (p as PostItemResponse);
        if (!normalized) {
          setSelectedPost(null);
          setShowPostModal(true);
          setPostNotFound({
            id: postId,
            message: "Bài viết đã bị xóa hoặc không tồn tại.",
          });
          return;
        }

        // nếu post trả về có status deleted -> treat as not found
        if (normalized.status === "DELETED" || normalized.status === "DELETE") {
          setSelectedPost(null);
          setShowPostModal(true);
          setPostNotFound({
            id: postId,
            message: "Bài viết đã bị xóa hoặc không tồn tại.",
          });
          return;
        }

        setSelectedPost(normalized);
        setShowPostModal(true);
        setPostNotFound(null);
      } catch (err) {
        console.error("Fetch post by id error", err);
        setSelectedPost(null);
        setShowPostModal(true);
        setPostNotFound({
          id: postId,
          message: "Lỗi khi tải bài viết.",
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, sortedPosts]);
  // ...existing code...

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Đã đăng
          </span>
        );
      case "HIDDEN":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
            Đã ẩn
          </span>
        );
      case "DELETED":
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
            Đã xóa
          </span>
        );
      default:
        return (
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
  };

  const handleStatusChange = async (
    postId: number,
    newStatus: PostItemResponse["status"]
  ) => {
    try {
      await updatePost({
        id: postId,
        status: newStatus,
      }).unwrap();
    } catch (error) {
      // Handle error silently or show user notification
    }
  };

  // const viewPostDetails = (post: PostItemResponse) => {
  //   setSelectedPost(post);
  //   setShowPostModal(true);
  // };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
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
            count: posts.filter((p) => p.status === "ACTIVE").length,
            onClick: () => handleFilterByStatus("ACTIVE"),
          },
          {
            icon: <EyeOff className="w-10 h-10 text-gray-600" />,
            label: "Đã ẩn",
            count: posts.filter((p) => p.status === "HIDDEN").length,
            onClick: () => handleFilterByStatus("HIDDEN"),
          },
          {
            icon: <AlertTriangle className="w-10 h-10 text-red-600" />,
            label: "Đã xóa",
            count: posts.filter((p) => p.status === "DELETED").length,
            onClick: () => handleFilterByStatus("DELETED"),
          },
        ].map((item, index) => (
          <div key={index}>
            <button
              onClick={item.onClick}
              className="flex items-center w-full p-8 bg-white rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition duration-200 cursor-pointer"
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
      <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
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
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-[520px]">
                  Bài viết
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Tương tác
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
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
                        src={post.authorAvatarUrl || "/placeholder.svg"}
                        alt={`${post.authorFirstName || ""} ${
                          post.authorLastName || ""
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {post.authorFirstName} {post.authorLastName}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {post.location}
                        </div>
                        <div className="px-2 text-gray-700 text-sm">
                          <p
                            className={`${
                              expandedPostId === post.id ? "" : "line-clamp-2"
                            } break-words whitespace-pre-wrap`}
                          >
                            {post.content || ""}
                          </p>
                        </div>

                        {/* Nếu có hashtags */}
                        {post.hashtags && (
                          <div className="mt-1 text-xs text-blue-600">
                            #{post.hashtags}
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
                          {post.likeCount}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {post.commentCount}
                        </span>
                        <span className="flex items-center">
                          <Share className="h-3 w-3 mr-1" />
                          {post.shareCount}
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {post.viewCount}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Tippy
                        content="Xem chi tiết"
                        placement="bottom"
                        theme="small-text"
                        delay={[0, 0]}
                        hideOnClick={false}
                        interactive={false}
                      >
                        <button
                          onClick={() => openPostModal(post)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tippy>

                      {post.status === "HIDDEN" && (
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
                              setConfirmModal({
                                message:
                                  "Bạn có chắc chắn muốn hiển thị bài viết này không?",
                                onConfirm: async () => {
                                  await handleStatusChange(post.id, "ACTIVE");
                                  setConfirmModal(null);
                                },
                                colorClass:
                                  getStatusBgColor("ACTIVE").colorClass,
                                titleClass:
                                  getStatusBgColor("ACTIVE").titleClass,
                              })
                            }
                            disabled={isUpdating}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Tippy>
                      )}

                      {post.status === "ACTIVE" && (
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
                              setConfirmModal({
                                message:
                                  "Bạn có chắc chắn muốn ẩn bài viết này không?",
                                onConfirm: async () => {
                                  await handleStatusChange(post.id, "HIDDEN");
                                  setConfirmModal(null);
                                },
                                colorClass:
                                  getStatusBgColor("HIDDEN").colorClass,
                                titleClass:
                                  getStatusBgColor("HIDDEN").titleClass,
                              })
                            }
                            disabled={isUpdating}
                            className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50 cursor-pointer"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </Tippy>
                      )}

                      {post.status !== "DELETED" && (
                        <Tippy
                          content="Xóa bài viết"
                          placement="bottom"
                          theme="small-text"
                          delay={[0, 0]}
                          hideOnClick={false}
                          interactive={false}
                        >
                          <button
                            onClick={() =>
                              setConfirmModal({
                                message:
                                  "Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.",
                                onConfirm: async () => {
                                  await deletePost(post.id);
                                  setConfirmModal(null);
                                },
                              })
                            }
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50 cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </Tippy>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Details Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Chi tiết bài viết
                </h3>
                <button
                  onClick={() => {
                    setShowPostModal(false);
                    setSelectedPost(null);
                    setPostNotFound(null);
                    navigate(location.pathname, { replace: true });
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X />
                </button>
              </div>
              {/* Nếu post bị xóa hoặc không tồn tại */}
              {postNotFound ? (
                <div className="py-8 text-center">
                  <p className="text-red-600 font-semibold mb-2">
                    Bài viết không tồn tại hoặc đã bị xóa.
                  </p>
                  <p className="text-sm text-gray-600 mb-6">
                    ID bài viết: {postNotFound.id}
                  </p>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => {
                        const target = originReportId
                          ? `/reports?reportId=${encodeURIComponent(
                              originReportId
                            )}`
                          : "/reports";
                        navigate(target);
                        setShowPostModal(false);
                        setPostNotFound(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Quay lại báo cáo
                    </button>
                  </div>
                </div>
              ) : selectedPost ? (
                // Hiển thị chi tiết bài viết
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={selectedPost.authorAvatarUrl || "/placeholder.svg"}
                      alt={`${selectedPost.authorFirstName || ""} ${
                        selectedPost.authorLastName || ""
                      }`}
                    />
                    <div>
                      <h4 className="text-lg font-medium">
                        {selectedPost.authorFirstName}{" "}
                        {selectedPost.authorLastName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedPost.createdAt)}
                      </p>
                      {getStatusBadge(selectedPost.status)}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    {/* modal content with xem thêm / thu gọn */}
                    {selectedPost.content ? (
                      showFullModalContent ? (
                        <>
                          <p className="text-gray-900 whitespace-pre-wrap">
                            {selectedPost.content}
                          </p>
                          <button
                            onClick={() => setShowFullModalContent(false)}
                            className="text-blue-500 text-sm mt-2 hover:underline"
                          >
                            Thu gọn
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-900">
                            {selectedPost.content.length > 500
                              ? `${selectedPost.content.slice(0, 500)}…`
                              : selectedPost.content}
                          </p>
                          {selectedPost.content.length > 500 && (
                            <button
                              onClick={() => setShowFullModalContent(true)}
                              className="text-blue-500 text-sm mt-2 hover:underline"
                            >
                              Xem thêm
                            </button>
                          )}
                        </>
                      )
                    ) : null}
                    {selectedPost.media && selectedPost.media.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedPost.media.map((m) => (
                          <div key={m.id} className="overflow-hidden rounded-md">
                            {m.mediaType === "IMAGE" ? (
                              <img
                                src={m.mediaUrl}
                                alt={m.originalFilename || `media-${m.id}`}
                                className="w-full h-48 object-cover rounded-md"
                              />
                            ) : (
                              <video
                                src={m.mediaUrl}
                                controls
                                className="w-full h-48 object-cover rounded-md"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedPost.hashtags && (
                      <div className="mt-2 text-xs text-blue-600">
                        #{selectedPost.hashtags}
                      </div>
                    )}
                    <div className="mt-2 text-xs text-gray-500">
                      Vị trí: {selectedPost.location}
                    </div>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-6">
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {selectedPost.likeCount} lượt thích
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {selectedPost.commentCount} bình luận
                      </span>
                      <span className="flex items-center">
                        <Share className="h-4 w-4 mr-1" />
                        {selectedPost.shareCount} chia sẻ
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {selectedPost.viewCount} lượt xem
                      </span>
                    </div>
                    {originReportId && (
                      <div className="flex justify-end items-center space-x-2 mt-4">
                        {/* Quay lại báo cáo */}
                        <button
                          onClick={() => {
                            navigate(
                              `/reports?reportId=${encodeURIComponent(
                                originReportId
                              )}`
                            );
                            setShowPostModal(false);
                            setOriginReportId(null);
                          }}
                          className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                          title="Quay lại báo cáo"
                        >
                          <Undo2 className="w-4 h-4" />
                        </button>

                        {/* Nếu report = REJECTED thì show Ẩn / Xóa, khoảng cách đều với nút quay lại */}
                        {originReportStatus === "REJECTED" && (
                          <>
                            <button
                              onClick={() =>
                                setConfirmModal({
                                  message:
                                    "Bạn có chắc chắn muốn ẩn bài viết này không?",
                                  onConfirm: async () => {
                                    if (!selectedPost) return;
                                    await handleStatusChange(
                                      selectedPost.id,
                                      "HIDDEN"
                                    );
                                    setConfirmModal(null);
                                  },
                                  colorClass:
                                    getStatusBgColor("HIDDEN").colorClass,
                                  titleClass:
                                    getStatusBgColor("HIDDEN").titleClass,
                                })
                              }
                              className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                              title="Ẩn bài viết"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                setConfirmModal({
                                  message:
                                    "Bạn có chắc chắn muốn xóa bài viết này? Hành động không thể hoàn tác.",
                                  onConfirm: async () => {
                                    if (!selectedPost) return;
                                    await deletePost(selectedPost.id);
                                    setConfirmModal(null);
                                  },
                                  colorClass: "bg-red-600 hover:bg-red-700",
                                  titleClass: "text-red-600",
                                })
                              }
                              className="flex items-center px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Loading state
                <div className="py-8 text-center">
                  <p>Đang tải...</p>
                </div>
              )}
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
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onCancel={() => setConfirmModal(null)}
          onConfirm={confirmModal.onConfirm}
          colorClass={confirmModal.colorClass}
          titleClass={confirmModal.titleClass}
        />
      )}
    </div>
  );
}

function getStatusBgColor(status: string) {
  switch (status) {
    case "ACTIVE":
      return {
        colorClass: "bg-green-600 hover:bg-green-700",
        titleClass: "text-green-600",
      };
    case "HIDDEN":
      return {
        colorClass: "bg-yellow-600 hover:bg-yellow-700",
        titleClass: "text-yellow-600",
      };
    default:
      return {
        colorClass: "bg-blue-600 hover:bg-blue-700",
        titleClass: "text-blue-600",
      };
  }
}
