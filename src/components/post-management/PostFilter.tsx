"use client";

import { Search, Filter } from "lucide-react";

interface PostFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: "all" | "published" | "hidden" | "reported";
  setStatusFilter: (
    filter: "all" | "published" | "hidden" | "reported"
  ) => void;
}

export function PostFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: PostFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tác giả hoặc nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="published">Đã đăng</option>
            <option value="hidden">Đã ẩn</option>
            <option value="reported">Bị báo cáo</option>
          </select>
        </div>
      </div>
    </div>
  );
}
