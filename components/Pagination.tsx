import React from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}


function Pagination({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const visiblePages: (number | string)[] = [];

  if (totalPages <= 10) {
    for (let i = 1; i <= totalPages; i++) {
      visiblePages.push(i);
    }
  } else {
    visiblePages.push(1);

    if (currentPage <= 6) {
      for (let i = 2; i <= 7; i++) {
        visiblePages.push(i);
      }
      visiblePages.push("...");
      visiblePages.push(totalPages);
    } else if (currentPage >= totalPages - 5) {
      visiblePages.push("...");
      for (let i = totalPages - 7; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      visiblePages.push("...");
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        visiblePages.push(i);
      }
      visiblePages.push("...");
      visiblePages.push(totalPages);
    }
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-10">
      {/* "Back button" */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200"
      >
        &larr;
      </button>

      {/* Display pages */}
      {visiblePages.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-gray-700 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* "Next" button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:hover:bg-gray-200"
      >
        &rarr;
      </button>
    </div>
  );
};

export default Pagination



