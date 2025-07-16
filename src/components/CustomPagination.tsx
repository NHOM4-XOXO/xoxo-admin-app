import { Pagination } from "antd";

interface CustomPaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  simple?: boolean;
  className?: string;
}

export default function CustomPagination({
  currentPage,
  pageSize,
  total,
  onChange,
  showSizeChanger = true,
  // showQuickJumper = false,
  simple = false,
  className = "",
}: CustomPaginationProps) {
  return (
    <div className={`flex justify-end p-4 ${className}`}>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        showSizeChanger={showSizeChanger}
        // showQuickJumper={showQuickJumper}
        simple={simple}
        pageSizeOptions={["5", "10", "20", "50"]}
        onChange={onChange}
      />
    </div>
  );
}
