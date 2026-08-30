import React, { useState } from "react";
import { LockKeyhole, Mail, User, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Button from "../../components/Button";
import { toast } from "sonner";
import configuration from "../../config";

const CreateAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsLoader(true);
      configuration
        .postAPI({
          url: "api/admin/sign-up",
          params: { ...formData },
        })
        .then(async (data) => {
          setIsLoader(false);
          if (data.payload) {
            localStorage.setItem("name", data.payload.name);
            localStorage.setItem("email", data.payload.email);
            localStorage.setItem("token", data.payload.token);
            navigate("/");
          } else if (data.error) {
            setIsLoader(false);
            return toast.error(data.error.message);
          } else {
            setIsLoader(false);
            return toast.error("Something went wrong");
          }
        })
        .catch((error) => {
          setIsLoader(false);
          const message =
            error?.response?.data?.error?.message ||
            error?.response?.data?.message ||
            error?.error?.message ||
            error?.message ||
            "Something went wrong";
          return toast.error(message);
        });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
            <User className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Create Admin Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Set up the administrator account for your Leads Tracking Portal
          </p>
        </div>

        <form action="#" method="POST" className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label
                text="Full Name"
                className="mb-2 block text-sm font-medium text-gray-700"
              />

              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={User}
              />

              {errors.name && (
                <Label
                  className="mt-1 block text-sm error-text"
                  text={errors.name}
                />
              )}
            </div>

            <div>
              <Label
                text="Email Address"
                className="mb-2 block text-sm font-medium text-gray-700"
              />

              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                icon={Mail}
              />

              {errors.email && (
                <Label
                  className="mt-1 block text-sm error-text"
                  text={errors.email}
                />
              )}
            </div>

            <div>
              <Label
                text="Password"
                className="mb-2 block text-sm font-medium text-gray-700"
              />

              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                icon={LockKeyhole}
                endIcon={showPassword ? EyeOff : Eye}
                onEndIconClick={() => setShowPassword((prev) => !prev)}
              />

              {errors.password && (
                <Label
                  className="mt-1 block text-sm error-text"
                  text={errors.password}
                />
              )}
            </div>

            <div>
              <Label
                text="Confirm Password"
                className="mb-2 block text-sm font-medium text-gray-700"
              />

              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                icon={LockKeyhole}
                endIcon={showConfirmPassword ? EyeOff : Eye}
                onEndIconClick={() => setShowConfirmPassword((prev) => !prev)}
              />

              {errors.confirmPassword && (
                <Label
                  className="mt-1 block text-sm error-text"
                  text={errors.confirmPassword}
                />
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            text={isLoader ? "Registering..." : "Register"}
            disabled={isLoader}
            onClick={() => handleSubmit()}
          />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Already have an admin account?
          </p>

          <Link
            to="/"
            className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Only one administrator account is allowed.
        </p>
      </div>
    </div>
  );
};

export default CreateAdmin;
