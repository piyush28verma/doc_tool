import React from "react";
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

function Toast({ toasts, removeToast }) {
  const getIcon = (type) => {
    switch (type) {
      case "success": return <FiCheckCircle className="text-lg" />;
      case "error": return <FiXCircle className="text-lg" />;
      case "warning": return <FiAlertTriangle className="text-lg" />;
      default: return <FiInfo className="text-lg" />;
    }
  };

  return (
    <div className="fixed top-20 right-2 sm:right-4 z-[100] flex flex-col gap-2 w-[calc(100%-16px)] sm:w-auto sm:max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type} flex items-center gap-3 px-4 py-3 pr-10 relative`}
        >
          {getIcon(toast.type)}
          <p className="text-sm font-medium">{toast.message}</p>

          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 p-1 rounded hover:bg-white/10 transition-colors"
            aria-label="Dismiss notification"
          >
            <FiX className="text-sm" />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
