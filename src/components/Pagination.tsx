import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  visiblePages = 5,
}) => {
  if (totalPages <= 1) return null;

  const half = Math.floor(visiblePages / 2);
  let startPage = currentPage - half;
  let endPage = currentPage + half;

  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(visiblePages, totalPages);
  } else if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - visiblePages + 1);
  }

  return (
    <nav className="flex justify-center mt-6" aria-label="Pagination">
      <ul className="inline-flex items-center space-x-1">
        {/* First page */}
        <li>
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-l-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            «
          </button>
        </li>

        {/* Before */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            &lt;
          </button>
        </li>

        {/* number page */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const page = startPage + i;
          return (
            <li key={page}>
              <button
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border text-sm ${
                  currentPage === page
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* After */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            &gt;
          </button>
        </li>

        {/* last page*/}
        <li>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-r-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50"
          >
            »
          </button>
        </li>
        
      </ul>
    </nav>
  );
};

export default Pagination;
