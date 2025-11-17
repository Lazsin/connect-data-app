export default function Pagination({ page, setPage, totalCount, pageSize, setPageSize }) {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // ---------- Авто-генерация короткой пагинации ----------
  const getPages = () => {
    if (totalPages <= 7) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    const pages = [];

    pages.push(1); // первая

    if (page > 3) pages.push("...");

    if (page > 2) pages.push(page - 1);
    if (page !== 1 && page !== totalPages) pages.push(page);
    if (page < totalPages - 1) pages.push(page + 1);

    if (page < totalPages - 2) pages.push("...");

    pages.push(totalPages); // последняя

    return pages;
  };

  const pages = getPages();
  // -------------------------------------------------------

  return (
    <div className="flex-col items-center gap-4 mt-6">

      {/* Верхняя строка инфо */}
      <div className="flex justify-center gap-4 items-center w-full my-5">
        <span>Страница {page} из {totalPages || 1}</span>

        <select
          value={pageSize}
          onChange={handlePageSizeChange}
          className="border rounded p-1"
        >
          {[5, 10, 25].map(size => (
            <option key={size} value={size}>{size} на страницу</option>
          ))}
        </select>
      </div>

      {/* Пагинация */}
      <div className="flex justify-center gap-2 items-center w-full my-5">

        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          -
        </button>

        {/* Коллекция страниц */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-3 py-1">…</span>
          ) : (
            <button
              key={idx}
              onClick={() => setPage(p)}
              className={`px-3 py-1 border rounded ${
                p === page ? "bg-blue-500 text-white" : ""
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          +
        </button>

      </div>

    </div>
  );
}
