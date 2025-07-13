// import { useState } from "react";

// import {
//   Search,
//   Filter,
//   Eye,
//   Trash2,
//   Flag,
//   Heart,
//   MessageSquare,
//   Share,
// } from "lucide-react";

// interface Post {
//   id: number;
//   author: string;
//   authorAvatar: string;
//   content: string;
//   image?: string;
//   createdAt: string;
//   likes: number;
//   comments: number;
//   shares: number;
//   status: "published" | "hidden" | "reported";
//   reports: number;
// }

// const mockPosts: Post[] = [
//   {
//     id: 1,
//     author: "Nguyễn Văn A",
//     authorAvatar: "../../../public/profile-icon-vector.jpg",
//     content:
//       "Hôm nay thật là một ngày tuyệt vời! Cảm ơn mọi người đã ủng hộ dự án của tôi. Tôi rất vui khi thấy cộng đồng ngày càng phát triển.",
//     image: "../../public/ireland.jpg",
//     createdAt: "2024-01-15T10:30:00Z",
//     likes: 245,
//     comments: 32,
//     shares: 18,
//     status: "published",
//     reports: 0,
//   },
//   {
//     id: 2,
//     author: "Trần Thị B",
//     authorAvatar: "../../../public/profile-icon-vector.jpg",
//     content:
//       "Chia sẻ một số kinh nghiệm về việc học lập trình cho những bạn mới bắt đầu. Hãy kiên trì và không ngại thất bại!",
//     createdAt: "2024-01-14T15:45:00Z",
//     likes: 189,
//     comments: 45,
//     shares: 23,
//     status: "published",
//     reports: 0,
//   },
//   {
//     id: 3,
//     author: "Lê Văn C",
//     authorAvatar: "../../../public/profile-icon-vector.jpg",
//     content: "Nội dung không phù hợp và có thể gây tranh cãi...",
//     createdAt: "2024-01-13T09:20:00Z",
//     likes: 12,
//     comments: 8,
//     shares: 2,
//     status: "reported",
//     reports: 5,
//   },
//   {
//     id: 4,
//     author: "Phạm Thị D",
//     authorAvatar: "../../../public/profile-icon-vector.jpg",
//     content:
//       "Cuối tuần này có ai muốn đi picnic không? Thời tiết đẹp quá, không đi thì phí!",
//     image: "../../public/ireland.jpg",
//     createdAt: "2024-01-12T14:15:00Z",
//     likes: 67,
//     comments: 15,
//     shares: 8,
//     status: "published",
//     reports: 0,
//   },
//   {
//     id: 5,
//     author: "Hoàng Văn E",
//     authorAvatar: "../../../public/profile-icon-vector.jpg",
//     content: "Bài viết đã bị ẩn do vi phạm quy định cộng đồng.",
//     createdAt: "2024-01-11T11:00:00Z",
//     likes: 3,
//     comments: 1,
//     shares: 0,
//     status: "hidden",
//     reports: 8,
//   },
// ];

// export default function PostManagement() {
//   const [posts, setPosts] = useState<Post[]>(mockPosts);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "published" | "hidden" | "reported"
//   >("all");
//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);
//   const [showPostModal, setShowPostModal] = useState(false);

//   const filteredPosts = posts.filter((post) => {
//     const matchesSearch =
//       post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.content.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesStatus =
//       statusFilter === "all" || post.status === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const getStatusBadge = (status: Post["status"]) => {
//     switch (status) {
//       case "published":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
//             Đã đăng
//           </span>
//         );
//       case "hidden":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
//             Đã ẩn
//           </span>
//         );
//       case "reported":
//         return (
//           <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
//             Bị báo cáo
//           </span>
//         );
//     }
//   };

//   const handleStatusChange = (postId: number, newStatus: Post["status"]) => {
//     setPosts(
//       posts.map((post) =>
//         post.id === postId ? { ...post, status: newStatus } : post
//       )
//     );
//   };

//   const handleDeletePost = (postId: number) => {
//     if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
//       setPosts(posts.filter((post) => post.id !== postId));
//     }
//   };

//   const viewPostDetails = (post: Post) => {
//     setSelectedPost(post);
//     setShowPostModal(true);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString("vi-VN");
//   };
//   //   console.log("Postmanagement rendered");

//   return (
//     <div className="space-y-6">
//       <div className="mt-10 flex flex-col justify-center items-center text-center">
//         <h1 className="text-2x font-bold text-gray-900">Quản lý bài viết</h1>
//         <p className="text-gray-600">Quản lý nội dung và hoạt động bài viết</p>
//       </div>

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow p-6">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm theo tác giả hoặc nội dung..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Filter className="h-5 w-5 text-gray-400" />
//             <select
//               value={statusFilter}
//               onChange={(e) =>
//                 setStatusFilter(
//                   e.target.value as "all" | "published" | "hidden" | "reported"
//                 )
//               }
//               className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="published">Đã đăng</option>
//               <option value="hidden">Đã ẩn</option>
//               <option value="reported">Bị báo cáo</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Posts Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Bài viết
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Trạng thái
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Thời gian
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Tương tác
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Báo cáo
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Hành động
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredPosts.map((post) => (
//                 <tr key={post.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4">
//                     <div className="flex items-start space-x-3">
//                       <img
//                         className="h-10 w-10 rounded-full flex-shrink-0"
//                         src={post.authorAvatar || "/placeholder.svg"}
//                         alt={post.author}
//                       />
//                       <div className="flex-1 min-w-0">
//                         <div className="text-sm font-medium text-gray-900">
//                           {post.author}
//                         </div>
//                         <div className="text-sm text-gray-600 line-clamp-2 mt-1">
//                           {post.content}
//                         </div>
//                         {post.image && (
//                           <div className="mt-2">
//                             <img
//                               className="h-16 w-24 object-cover rounded"
//                               src={post.image || "/placeholder.svg"}
//                               alt="Post image"
//                             />
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {getStatusBadge(post.status)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {formatDate(post.createdAt)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     <div className="space-y-1">
//                       <div className="flex items-center space-x-4 text-xs text-gray-500">
//                         <span className="flex items-center">
//                           <Heart className="h-3 w-3 mr-1" />
//                           {post.likes}
//                         </span>
//                         <span className="flex items-center">
//                           <MessageSquare className="h-3 w-3 mr-1" />
//                           {post.comments}
//                         </span>
//                         <span className="flex items-center">
//                           <Share className="h-3 w-3 mr-1" />
//                           {post.shares}
//                         </span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {post.reports > 0 ? (
//                       <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
//                         {post.reports} báo cáo
//                       </span>
//                     ) : (
//                       <span className="text-sm text-gray-500">Không có</span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex items-center justify-end space-x-2">
//                       <button
//                         onClick={() => viewPostDetails(post)}
//                         className="text-blue-600 hover:text-blue-900 p-1"
//                         title="Xem chi tiết"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </button>
//                       {post.status === "published" && (
//                         <button
//                           onClick={() => handleStatusChange(post.id, "hidden")}
//                           className="text-yellow-600 hover:text-yellow-900 p-1"
//                           title="Ẩn bài viết"
//                         >
//                           <Flag className="h-4 w-4" />
//                         </button>
//                       )}
//                       {post.status === "hidden" && (
//                         <button
//                           onClick={() =>
//                             handleStatusChange(post.id, "published")
//                           }
//                           className="text-green-600 hover:text-green-900 p-1"
//                           title="Hiển thị bài viết"
//                         >
//                           <Eye className="h-4 w-4" />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDeletePost(post.id)}
//                         className="text-red-600 hover:text-red-900 p-1"
//                         title="Xóa bài viết"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Post Details Modal */}
//       {showPostModal && selectedPost && (
//         <div className="fixed inset-0 bg-gray-600/50 overflow-y-auto h-full w-full z-50">
//           <div className="relative top-10 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
//             <div className="mt-3">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-medium text-gray-900">
//                   Chi tiết bài viết
//                 </h3>
//                 <button
//                   onClick={() => setShowPostModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   ×
//                 </button>
//               </div>
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <img
//                     className="h-12 w-12 rounded-full"
//                     src={selectedPost.authorAvatar || "/placeholder.svg"}
//                     alt={selectedPost.author}
//                   />
//                   <div>
//                     <h4 className="text-lg font-medium">
//                       {selectedPost.author}
//                     </h4>
//                     <p className="text-sm text-gray-500">
//                       {formatDate(selectedPost.createdAt)}
//                     </p>
//                     {getStatusBadge(selectedPost.status)}
//                   </div>
//                 </div>
//                 <div className="border-t pt-4">
//                   <p className="text-gray-900 whitespace-pre-wrap">
//                     {selectedPost.content}
//                   </p>
//                   {selectedPost.image && (
//                     <img
//                       className="mt-4 max-w-full h-auto rounded-lg"
//                       src={selectedPost.image || "/placeholder.svg"}
//                       alt="Post content"
//                     />
//                   )}
//                 </div>
//                 <div className="border-t pt-4 flex items-center justify-between text-sm text-gray-500">
//                   <div className="flex items-center space-x-6">
//                     <span className="flex items-center">
//                       <Heart className="h-4 w-4 mr-1" />
//                       {selectedPost.likes} lượt thích
//                     </span>
//                     <span className="flex items-center">
//                       <MessageSquare className="h-4 w-4 mr-1" />
//                       {selectedPost.comments} bình luận
//                     </span>
//                     <span className="flex items-center">
//                       <Share className="h-4 w-4 mr-1" />
//                       {selectedPost.shares} chia sẻ
//                     </span>
//                   </div>
//                   {selectedPost.reports > 0 && (
//                     <span className="text-red-600 font-medium">
//                       {selectedPost.reports} báo cáo
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
