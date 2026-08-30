import React, { useEffect, useState } from "react";
import { Trash2, Mail, Phone, Calendar, User, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import configuration from "../config";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

const LeadDetail = () => {
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const location = useLocation();
  const [deleteNoteLoading, setDeleteNoteLoading] = useState(null);

  const leadId = location.state?.leadId;

  const getLeadDetail = async (id) => {
    setLoading(true);
    configuration
      .getAPIaxios({
        url: `api/leads/${id}`,
      })
      .then((data) => {
        if (data) {
          setLead(data);
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getLeadNotes = async (id) => {
    setNotesLoading(true);
    configuration
      .getAPIaxios({
        url: `api/leads/${id}/notes`,
      })
      .then((data) => {
        if (data) {
          setNotes(Array.isArray(data) ? data : data.payload || []);
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      })
      .finally(() => {
        setNotesLoading(false);
      });
  };

  useEffect(() => {
    if (leadId) {
      getLeadDetail(leadId);
      getLeadNotes(leadId);
    }
  }, [leadId]);

  const handleAddNote = async () => {
    if (!note.trim()) {
      toast.error("Please enter a note");
      return;
    }

    try {
      setNoteLoading(true);

      const response = await configuration.postAPI({
        url: `api/leads/${leadId}/notes`,
        params: {
          content: note.trim(),
        },
      });

      if (response?.payload) {
        setNote("");
        getLeadNotes(leadId);
        toast.success("Note added successfully");
      } else if (response?.error) {
        toast.error(response.error.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.message || "Unable to add note");
    } finally {
      setNoteLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-50 text-blue-600";

      case "contacted":
        return "bg-yellow-50 text-yellow-600";

      case "qualified":
        return "bg-green-50 text-green-600";

      case "lost":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setDeleteNoteLoading(noteId);

      const data = await configuration.allAPI({
        url: `api/leads/${leadId}/notes/${noteId}`,
        method: "DELETE",
      });

      if (data?.payload) {
        getLeadNotes(leadId);

        toast.success("Note deleted successfully");
      } else if (data?.error) {
        toast.error(data.error.message);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to delete note",
      );
    } finally {
      setDeleteNoteLoading(null);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            text="Back"
            onClick={() => navigate("/leads")}
            className="flex h-9 w-20 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer"
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Details</h1>

            <p className="mt-1 text-sm text-gray-500">
              View lead information and manage notes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {lead?.name}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                      lead?.status,
                    )}`}
                  >
                    {lead?.status
                      ? lead.status.charAt(0).toUpperCase() +
                        lead.status.slice(1)
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="space-y-5 px-6 py-5">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {lead?.email || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {lead?.phone || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-5 w-5 text-gray-400" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Created
                    </p>

                    <p className="mt-1 text-sm text-gray-700">
                      {lead?.createdAt
                        ? new Date(lead?.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />

                  <h2 className="font-semibold text-gray-900">Add Note</h2>
                </div>
              </div>

              <form className="p-6">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write a note about this lead..."
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="mt-4 flex justify-end">
                  <Button
                    type="submit"
                    text={noteLoading ? "Adding..." : "Add Note"}
                    disabled={noteLoading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    onClick={handleAddNote}
                  />
                </div>
              </form>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-5">
                <h2 className="font-semibold text-gray-900">Notes</h2>

                <p className="mt-1 text-sm text-gray-500">
                  {notes.length} {notes.length === 1 ? "note" : "notes"}
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {notesLoading ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm text-gray-500">Loading notes...</p>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <Plus className="h-5 w-5 text-gray-400" />
                    </div>

                    <p className="mt-3 text-sm font-medium text-gray-700">
                      No notes yet
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Add the first note for this lead.
                    </p>
                  </div>
                ) : (
                  notes.map((item) => (
                    <div key={item.id} className="px-6 py-5">
                      <div className="flex items-start justify-between gap-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                          {item.content}
                        </p>

                        <div className="flex shrink-0 items-center gap-3">
                          <span className="text-xs text-gray-400">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleString()
                              : ""}
                          </span>

                          <span
                            onClick={() => {
                              if (deleteNoteLoading !== item.id)
                                handleDeleteNote(item.id);
                            }}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 ${
                              deleteNoteLoading === item.id
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            }`}
                          >
                            {deleteNoteLoading === item.id ? (
                              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetail;
