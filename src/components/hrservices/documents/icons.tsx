// icons for reusing
export const FolderIcon = ({ className = "w-10 h-8" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path
      fill="currentColor"
      d="M10 4l2 2h8a2 2 0 012 2v9a3 3 0 01-3 3H5a3 3 0 01-3-3V7a3 3 0 013-3h5z"
    />
  </svg>
);

export const FileIcon = ({ className = "w-8 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a1 1 0 001-1V8z" />
    <path fill="currentColor" d="M14 2v6h6" />
  </svg>
);
