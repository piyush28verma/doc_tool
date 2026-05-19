import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FiFile,
  FiTrash2,
  FiMenu,
  FiCheckSquare,
  FiSquare,
  FiFileText,
} from "react-icons/fi";

function SortableFileCard({ file, isSelected, isChecked, onSelect, onCheck, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getFileIcon = (extension) => {
    if (extension === ".pdf") return <FiFileText className="text-red-400" />;
    return <FiFile className="text-blue-400" />;
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`file-card flex items-center gap-3 ${isSelected ? "selected" : ""} ${isDragging ? "dragging" : ""}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onCheck(file.id);
        }}
        className="text-dark-400 hover:text-white transition-colors flex-shrink-0"
        aria-label={isChecked ? "Deselect file" : "Select file"}
      >
        {isChecked ? (
          <FiCheckSquare className="text-blue-400" />
        ) : (
          <FiSquare />
        )}
      </button>

      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-dark-500 hover:text-dark-300 transition-colors flex-shrink-0"
        aria-label="Drag to reorder"
      >
        <FiMenu />
      </button>

      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        onClick={() => onSelect(file.id)}
      >
        <div className="text-xl flex-shrink-0">{getFileIcon(file.extension)}</div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate">{file.originalName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-dark-400">{formatSize(file.fileSize)}</span>
            <span className="text-dark-600">•</span>
            <span className="text-xs text-dark-400 uppercase">{file.extension.replace(".", "")}</span>
            {file.pageCount && (
              <>
                <span className="text-dark-600">•</span>
                <span className="text-xs text-dark-400">{file.pageCount} page{file.pageCount !== 1 ? "s" : ""}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(file.id);
        }}
        className="btn-icon text-dark-500 hover:text-red-400 flex-shrink-0"
        aria-label={`Delete ${file.originalName}`}
      >
        <FiTrash2 className="text-sm" />
      </button>
    </div>
  );
}

function FileList({ files, setFiles, selectedFileId, onSelectFile, checkedFiles, onCheckFile, onDeleteFile, onSelectAll, onDeselectAll }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFiles((currentFiles) => {
        const oldIndex = currentFiles.findIndex((f) => f.id === active.id);
        const newIndex = currentFiles.findIndex((f) => f.id === over.id);
        return arrayMove(currentFiles, oldIndex, newIndex);
      });
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-dark-500">
        <FiFile className="text-4xl mx-auto mb-3 opacity-50" />
        <p className="text-sm">No files uploaded yet</p>
        <p className="text-xs mt-1">Upload files to get started</p>
      </div>
    );
  }

  const allChecked = checkedFiles.length === files.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold text-dark-300 uppercase tracking-wider">
          Files ({files.length})
        </h2>
        <button
          onClick={allChecked ? onDeselectAll : onSelectAll}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          {allChecked ? "Deselect All" : "Select All"}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={files.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {files.map((file) => (
              <SortableFileCard
                key={file.id}
                file={file}
                isSelected={selectedFileId === file.id}
                isChecked={checkedFiles.includes(file.id)}
                onSelect={onSelectFile}
                onCheck={onCheckFile}
                onDelete={onDeleteFile}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default FileList;
