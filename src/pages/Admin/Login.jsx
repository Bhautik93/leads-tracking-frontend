import React, { useState } from "react";
import { LockKeyhole, Mail, Users, Eye, EyeOff } from "lucide-react";
import Input from "../../components/Input";
import Label from "../../components/Label";
import Button from "../../components/Button";
import { Link, useNavigate } from "react-router-dom";
import configuration from "../../config";
import { toast } from "sonner";

const Login = () => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoader, setIsLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email" || name === "password") {
      if (/\s/.test(value)) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
          url: "api/admin/sign-in",
          params: { ...formData },
        })
        .then(async (data) => {
          setIsLoader(false);
          if (data.payload) {
            localStorage.setItem("name", data.payload.name);
            localStorage.setItem("email", data.payload.email);
            localStorage.setItem("token", data.payload.token);
            navigate("/dashboard");
            return toast.success("Login successful!");
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
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600">
            <Users className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>

          <p className="mt-2 text-sm text-gray-500">
            Login to manage your leads
          </p>
        </div>

        <form action="#" method="POST" className="space-y-5">
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
                placeholder="admin@example.com"
                icon={Mail}
              />
            </div>
            {errors.email ? (
              <Label
                className={`mt-1 block text-sm error-text`}
                text={errors.email}
              />
            ) : null}
          </div>
          <div>
            <Label
              text={"Password"}
              className="mb-2 block text-sm font-medium text-gray-700"
            />
            <div className="mt-2">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                icon={LockKeyhole}
                placeholder="Enter your password"
                endIcon={showPassword ? EyeOff : Eye}
                onEndIconClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
            {errors.password ? (
              <Label
                className={`mt-1 block text-sm error-text`}
                text={errors.password}
              />
            ) : null}
          </div>

          <Button
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
            text={isLoader ? "Signing In..." : "Sign In"}
            disabled={isLoader}
            onClick={() => handleSubmit()}
          />
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Don't have an admin account?</p>

          <Link
            to="/create-admin"
            className="mt-1 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Create Admin Account
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Leads Tracking Management Portal
        </p>
      </div>
    </div>
  );
};

export default Login;
