import { Pagination } from "antd";


interface CustomPaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  className?: string;
}

export default function CustomPagination({
  currentPage,
  pageSize,
  total,
  onChange,
  showSizeChanger = true,
  // showQuickJumper = false,
  
  className = "",
}: CustomPaginationProps) {
  return (
    <div className={`flex justify-center p-4 ${className}`}>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        showSizeChanger={showSizeChanger}
        // showQuickJumper={showQuickJumper}
        showQuickJumper
        pageSizeOptions={["5", "10", "20", "50"]}
        onChange={onChange}
      />
    </div>
  );
}
