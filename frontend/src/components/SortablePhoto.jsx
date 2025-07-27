/* eslint-disable react/prop-types */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function SortablePhoto({ photo, isSelected, onSelectionChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo._id });

  const style = {
    transition: transition || "transform 250ms ease",
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group aspect-square touch-none"
    >
      <img
        src={`${API_URL}/image/${photo.filename}`}
        alt={photo.filename}
        className={`w-full h-full object-cover rounded-xl shadow-lg transition-all duration-300 ${
          isSelected
            ? "ring-4 ring-sky-500 dark:ring-sky-400 ring-offset-2 ring-offset-stone-100 dark:ring-offset-stone-900"
            : "ring-2 ring-transparent"
        }`}
      />
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 rounded-xl ${
          isSelected
            ? "bg-opacity-40"
            : "bg-opacity-0 group-hover:bg-opacity-50"
        }`}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelectionChange(photo.filename)}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute top-3 left-3 h-5 w-5 bg-white/50 dark:bg-black/50 backdrop-blur-sm rounded text-sky-600 focus:ring-0 focus:ring-offset-0 z-10 cursor-pointer"
        />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => photo.onDelete(photo.filename)}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SortablePhoto;
