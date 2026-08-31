import React, { useEffect, useState } from "react";
import { Mail, Phone, User, CircleDot } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import configuration from "../config";
import Input from "../components/Input";
import Label from "../components/Label";
import Button from "../components/Button";
import { toast } from "sonner";

const CreateLead = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateItem = location.state;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const editId = stateItem?.leadId;

  useEffect(() => {
    if (editId) {
      fetchLeadDetails(stateItem.leadId);
    }
  }, [editId, stateItem]);

  const fetchLeadDetails = async (id) => {
    configuration
      .getAPIaxios({
        url: `api/leads/${id}`,
      })
      .then((data) => {
        if (data) {
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            status: data.status || "",
          });
        }
      })
      .catch((error) => {
        return toast.error(error.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let data;

      if (editId) {
        data = await configuration.allAPI({
          url: `api/leads/${editId}`,
          params: formData,
          method: "PATCH",
        });
      } else {
        data = await configuration.postAPI({
          url: "api/leads",
          params: formData,
        });
      }

      if (data?.payload) {
        toast.success(
          editId
            ? "Lead updated successfully"
            : "Record added successfully",
        );

        navigate("/leads");
      } else if (data?.error) {
        toast.error(data.error.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {editId ? "Edit Lead" : "Add Lead"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {editId
            ? "Update the lead information in your lead management system."
            : "Create a new lead and add it to your lead management system."}
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label
              text="Name"
              className="mb-2 block text-sm font-medium text-gray-700"
            />

            <div className="mt-2">
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter lead name"
                icon={User}
              />
            </div>

            {errors.name ? (
              <Label
                className="mt-1 block text-sm error-text"
                text={errors.name}
              />
            ) : null}
          </div>

          <div>
            <Label
              text="Email"
              className="mb-2 block text-sm font-medium text-gray-700"
            />

            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="lead@example.com"
                icon={Mail}
              />
            </div>

            {errors.email ? (
              <Label
                className="mt-1 block text-sm error-text"
                text={errors.email}
              />
            ) : null}
          </div>

          <div>
            <Label
              text="Phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            />

            <div className="mt-2">
              <Input
                id="phone"
                name="phone"
                type="number"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                icon={Phone}
              />
            </div>

            {errors.phone ? (
              <Label
                className="mt-1 block text-sm error-text"
                text={errors.phone}
              />
            ) : null}
          </div>

          <div>
            <Label
              text="Status"
              className="mb-2 block text-sm font-medium text-gray-700"
            />

            <div className="relative mt-2">
              <CircleDot className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            {errors.status ? (
              <Label
                className="mt-1 block text-sm error-text"
                text={errors.status}
              />
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
            <Button
              text="Cancel"
              onClick={() => navigate("/leads")}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
            />

            <Button
              type="submit"
              text={
                isLoading
                  ? editId
                    ? "Updating..."
                    : "Creating..."
                  : editId
                    ? "Update Lead"
                    : "Create Lead"
              }
              disabled={isLoading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white hover:bg-blue-700 cursor-pointer"
              onClick={() => handleSubmit()}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLead;
