export interface PaginationProps {
  pagination: {
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
  } | null;
  edgeLinks:
    | {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
      }
    | null
    | undefined;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  pagination,
  edgeLinks,
  onPageChange,
}: PaginationProps) => {
  if (!pagination) return null;

  return (
    <nav>
      <ul className="pagination justify-content-center">
        {/* First Page */}
        {edgeLinks?.first && (
          <li
            className={`page-item ${
              pagination.current_page === 1 ? "disabled" : ""
            }`}
          >
            <button
              title="Page Link"
              type="button"
              className="page-link"
              onClick={() => onPageChange(1)}
              disabled={pagination.current_page === 1}
            >
              First Page
            </button>
          </li>
        )}

        {/* Previous Page */}
        {edgeLinks?.prev && (
          <li className={`page-item ${!edgeLinks.prev ? "disabled" : ""}`}>
            <button
              title="Page Link"
              type="button"
              className="page-link"
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={!edgeLinks.prev}
            >
              Previous
            </button>
          </li>
        )}

        {/* Page Numbers */}
        {pagination.links.map((link, index) =>
          link.url ? (
            <li
              key={index}
              className={`page-item ${link.active ? "active" : ""}`}
            >
              {/* {link.label} */}
              {link.label !== "Next &raquo;" &&
                link.label !== "&laquo; Previous" && (
                  <button
                    title="Page Link"
                    type="button"
                    className="page-link"
                    onClick={() => onPageChange(Number(link.label))}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )}
            </li>
          ) : null
        )}

        {/* Next Page */}
        {edgeLinks?.next && (
          <li className={`page-item ${!edgeLinks.next ? "disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={!edgeLinks.next}
            >
              Next
            </button>
          </li>
        )}

        {/* Last Page */}
        {edgeLinks?.last && (
          <li
            className={`page-item ${
              pagination.current_page === pagination.last_page ? "disabled" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => onPageChange(pagination.last_page)}
              disabled={pagination.current_page === pagination.last_page}
            >
              Last Page
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
