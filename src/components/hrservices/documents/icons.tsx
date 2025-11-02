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

export const FolderOutlineIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

export const ChevronRightIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);
