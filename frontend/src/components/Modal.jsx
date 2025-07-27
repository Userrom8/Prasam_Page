/* eslint-disable react/prop-types */
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-gray-600 dark:text-gray-300 mb-6">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-neutral-700 hover:bg-gray-300 dark:hover:bg-neutral-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
