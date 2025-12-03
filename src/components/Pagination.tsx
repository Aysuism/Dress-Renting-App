type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ currentPage, totalPages, onPageChange, }: PaginationProps) => {
  const getPages = () => {
    let pages: (number | string)[] = [];

    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, 4, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-6 w-full">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-1 text-[#1C274C] disabled:opacity-50 cursor-pointer"
      >
        &lt;
      </button>

      {getPages().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2 py-1 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={idx}
            onClick={() => onPageChange(page as number)}
            className={`px-2 py-1 cursor-pointer ${currentPage === page
                ? "text-[#1C274C] font-bold"
                : "text-gray-500"
              }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-1 text-[#1C274C] disabled:opacity-50 cursor-pointer"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;