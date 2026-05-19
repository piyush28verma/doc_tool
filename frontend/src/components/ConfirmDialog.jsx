import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="modal-content w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle className="text-red-400 text-xl" />
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>

        <p className="text-dark-300 text-sm mb-6 ml-[52px]">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn-secondary text-sm">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger text-sm">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
