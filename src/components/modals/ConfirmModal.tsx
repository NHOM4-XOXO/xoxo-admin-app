import { useState } from "react";
import { X, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  message: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
  colorClass?: string;
  titleClass?: string;
}

export default function ConfirmModal({
  message,
  onCancel,
  onConfirm,
  colorClass = "bg-red-600 hover:bg-red-700",
  titleClass = "text-red-600",
}: ConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4 mb-0">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg relative">
        <button
          onClick={onCancel}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
          disabled={loading}
        >
          <X />
        </button>
        <h2 className={`text-lg font-semibold mb-4 ${titleClass}`}>
          Thông báo
        </h2>
        <p>{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100 cursor-pointer"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded ${colorClass} cursor-pointer flex items-center`}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
