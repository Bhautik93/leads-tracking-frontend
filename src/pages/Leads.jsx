import React, { useEffect, useState } from "react";
import DataTable from "../components/Table";
import Button from "../components/Button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import configuration from "../config";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "lost", label: "Lost" },
];

const Leads = () => {
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState({
    page: 1,
    sizePerPage: 10,
    search: "",
    status: "",
    sortBy: "",
    sortOrder: "",
  });
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    lead: null,
  });
  const [isLoader, setIsLoader] = useState(false);

  const columns = [
    {
      accessor: "name",
      header: "Name",
    },
    {
      accessor: "email",
      header: "Email",
    },
    {
      accessor: "phone",
      header: "Phone",
    },
    {
      accessor: "createdAt",
      header: "Created At",
      cell: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleString();
      },
    },
    {
      accessor: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.status === "new"
              ? "bg-blue-50 text-blue-600"
              : row.status === "contacted"
                ? "bg-yellow-50 text-yellow-600"
                : row.status === "qualified"
                  ? "bg-green-50 text-green-600"
                  : row.status === "lost"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-50 text-gray-600"
          }`}
        >
          {row?.status
            ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
            : "-"}
        </span>
      ),
    },
    {
      accessor: "actions",
      header: "Actions",
      sortable: false,
      searchable: false,
      cell: (row) => (
        <div className="flex items-center gap-4">
          <Button
            text="View"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
            onClick={() =>
              navigate(`/leads/details`, {
                state: { leadId: row.id },
              })
            }
          />

          <Button
            text="Delete"
            className="text-sm font-medium text-red-600 hover:text-red-700 cursor-pointer"
            onClick={() => handleDeleteClick(row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    getDatas(filterData);
  }, [
    filterData.page,
    filterData.sizePerPage,
    filterData.status,
    filterData.sortBy,
    filterData.sortOrder,
  ]);

  const getDatas = (filterKeys) => {
    setTableLoading(true);

    configuration
      .getAPIaxios({
        url: "api/leads",
        params: {
          page: filterKeys.page,
          limit: filterKeys.sizePerPage,
          search: filterKeys.search,
          status: filterKeys.status,
          sortBy: filterKeys.sortBy,
          sortOrder: filterKeys.sortOrder,
        },
      })
      .then((res) => {
        if (res) {
          setData(res?.data || []);
          setTotalData(res?.pagination?.total || 0);
          setTotalPages(res?.pagination?.totalPages || 1);
        } else {
          setData([]);
          setTotalData(0);
          setTotalPages(1);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setTableLoading(false);
      });
  };

  const searchOnChange = (e) => {
    const updated = { ...filterData, page: 1, search: e?.trim() };

    setFilterData(updated);
    getDatas(updated);
  };

  const handleStatusChange = (e) => {
    setFilterData((prev) => ({ ...prev, page: 1, status: e.target.value }));
  };

  const handlePageChange = (page) => {
    setFilterData((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (sizePerPage) => {
    setFilterData((prev) => ({ ...prev, page: 1, sizePerPage }));
  };

  const onSortKey = ({ key, direction }) => {
    setFilterData((prev) => ({
      ...prev,
      page: 1,
      sortBy: direction ? key : "",
      sortOrder: direction || "",
    }));
  };

  const handleDeleteClick = (lead) => {
    setDeleteModal({
      open: true,
      lead,
    });
  };

  const handleDelete = async () => {
    const leadId = deleteModal.lead?.id;

    if (!leadId) {
      return;
    }

    try {
      setIsLoader(true);

      const data = await configuration.allAPI({
        url: `api/leads/${leadId}`,
        method: "DELETE",
      });

      if (data?.payload) {
        getDatas(filterData);

        toast.success("Lead deleted successfully");

        setDeleteModal({
          open: false,
          lead: null,
        });
      } else if (data?.error) {
        toast.error(data.error.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to delete lead",
      );
    } finally {
      setIsLoader(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your leads.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={filterData.status}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <Button
              text="Add Lead"
              icon={<Plus className="h-4 w-4" />}
              onClick={() => navigate("/leads/new")}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          searchOnChange={searchOnChange}
          data={data}
          loading={tableLoading}
          searchPlaceholder="Search leads..."
          serverSide
          page={filterData.page}
          pageSize={filterData.sizePerPage}
          totalRecords={totalData}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSortKey={onSortKey}
          sortConfig={{
            key: filterData.sortBy || null,
            direction: filterData.sortOrder || null,
          }}
        />
      </div>
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Delete Lead</h2>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">
                {deleteModal.lead?.name}
              </span>
              ?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                text="Cancel"
                disabled={isLoader}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                onClick={() =>
                  setDeleteModal({
                    open: false,
                    lead: null,
                  })
                }
              />

              <Button
                text={isLoader ? "Deleting..." : "Delete"}
                disabled={isLoader}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Leads;
