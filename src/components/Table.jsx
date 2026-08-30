import React, { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchOnChange,
  searchPlaceholder = "Search...",
  pagination = true,
  pageSizeOptions = [10, 25, 50, 100],
  defaultPageSize = 10,
  selectable = false,
  onSelectionChange,
  emptyMessage = "No records found",
  serverSide = false,
  page = 1,
  pageSize: controlledPageSize,
  totalRecords: controlledTotalRecords,
  totalPages: controlledTotalPages,
  onPageChange,
  onPageSizeChange,
  sortConfig = { key: null, direction: null },
  onSortKey,
}) => {
  const [search, setSearch] = useState("");
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(defaultPageSize);
  const [selectedRows, setSelectedRows] = useState([]);
  const [state, setState] = useState({
    name: "",
    typing: false,
    typingTimeout: 0,
  });

  const currentPage = serverSide ? page : localCurrentPage;
  const pageSize = serverSide
    ? (controlledPageSize ?? defaultPageSize)
    : localPageSize;

  const filteredData = useMemo(() => {
    if (serverSide) {
      return data;
    }

    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return data;
    }

    return data.filter((row) =>
      columns.some((column) => {
        if (column.searchable === false) {
          return false;
        }

        return String(row[column.accessor] ?? "")
          .toLowerCase()
          .includes(searchValue);
      }),
    );
  }, [data, columns, search, serverSide]);

  const totalRecords = serverSide
    ? (controlledTotalRecords ?? 0)
    : filteredData.length;

  const totalPages = serverSide
    ? (controlledTotalPages ?? 1)
    : pagination
      ? Math.max(Math.ceil(totalRecords / pageSize), 1)
      : 1;

  const paginatedData = useMemo(() => {
    if (serverSide) {
      return filteredData;
    }

    if (!pagination) {
      return filteredData;
    }

    const startIndex = (currentPage - 1) * pageSize;

    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize, pagination, serverSide]);

  const handleSort = (column) => {
    if (column.sortable === false) {
      return;
    }

    const key = column.accessor;

    let direction = "asc";

    if (sortConfig.key === key) {
      direction =
        sortConfig.direction === "asc"
          ? "desc"
          : sortConfig.direction === "desc"
            ? null
            : "asc";
    }

    onSortKey?.(
      direction ? { key, direction } : { key: null, direction: null },
    );
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setLocalCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);

    if (serverSide) {
      onPageSizeChange?.(newSize);
      return;
    }

    setLocalPageSize(newSize);
    setLocalCurrentPage(1);
  };

  const handleSelectAll = (e) => {
    const ids = e.target.checked ? paginatedData.map((row) => row.id) : [];

    setSelectedRows(ids);
    onSelectionChange?.(ids);
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id];

      onSelectionChange?.(updated);

      return updated;
    });
  };

  const goToPreviousPage = () => {
    const target = Math.max(currentPage - 1, 1);

    if (serverSide) {
      onPageChange?.(target);
      return;
    }

    setLocalCurrentPage(target);
  };

  const goToNextPage = () => {
    const target = Math.min(currentPage + 1, totalPages);

    if (serverSide) {
      onPageChange?.(target);
      return;
    }

    setLocalCurrentPage(target);
  };

  const goToPage = (page) => {
    if (serverSide) {
      onPageChange?.(page);
      return;
    }

    setLocalCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const allCurrentPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((row) => selectedRows.includes(row.id));

  const SortIcon = ({ column }) => {
    if (column.sortable === false) {
      return null;
    }

    if (sortConfig.key !== column.accessor) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }

    if (sortConfig.direction === "asc") {
      return <ChevronUp className="h-4 w-4 text-blue-600" />;
    }

    return <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {(searchable || pagination) && (
        <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={state.name}
                onChange={(e) => {
                  const value = e.target.value;

                  if (state.typingTimeout) {
                    clearTimeout(state.typingTimeout);
                  }

                  setState({
                    name: value,
                    typing: false,
                    typingTimeout: setTimeout(function () {
                      searchOnChange(value.trim());
                    }, 800),
                  });
                }}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 border-b border-gray-200 px-5 py-4">
                  <input
                    type="checkbox"
                    checked={allCurrentPageSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
              )}

              <th className="w-16 border-b border-gray-200 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                #
              </th>

              {columns.map((column) => (
                <th
                  key={column.accessor}
                  className={`whitespace-nowrap border-b border-gray-200 px-5 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ${
                    column.headerClassName || ""
                  }`}
                >
                  <button
                    type="button"
                    disabled={column.sortable === false}
                    onClick={() => handleSort(column)}
                    className={`flex items-center gap-1.5 ${
                      column.sortable === false
                        ? "cursor-default"
                        : "cursor-pointer hover:text-gray-900"
                    }`}
                  >
                    {column.header}
                    <SortIcon column={column} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (selectable ? 1 : 0)}
                  className="px-5 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="mt-3 text-sm text-gray-500">Loading...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1 + (selectable ? 1 : 0)}
                  className="px-5 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      {emptyMessage}
                    </p>

                    {search && (
                      <p className="mt-1 text-xs text-gray-500">
                        Try changing your search keyword.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowNumber = (currentPage - 1) * pageSize + rowIndex + 1;

                return (
                  <tr
                    key={row.id ?? rowIndex}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                  >
                    {selectable && (
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {rowNumber}
                    </td>

                    {columns.map((column) => (
                      <td
                        key={column.accessor}
                        className={`whitespace-nowrap px-5 py-4 text-sm text-gray-700 ${
                          column.cellClassName || ""
                        }`}
                      >
                        {column.cell
                          ? column.cell(row, rowIndex)
                          : (row[column.accessor] ?? "-")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex flex-col gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">{startRecord}</span> to{" "}
            <span className="font-medium text-gray-700">{endRecord}</span> of{" "}
            <span className="font-medium text-gray-700">{totalRecords}</span>
          </p>

          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {pageNumbers.map((page, index) =>
              page === "..." ? (
                <span
                  key={`dots-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium cursor-pointer ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages || totalPages === 0}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
