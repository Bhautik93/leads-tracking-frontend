import React from "react";
import { Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-gray-100 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Users className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-lg font-bold text-gray-900">Leads Tracker</h1>
          </div>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Leads
          </NavLink>

          {/* <NavLink
            to="/leads/new"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Add Lead
          </NavLink> */}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-600">
                {localStorage.getItem("name")?.split("")[0]?.toUpperCase()}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {localStorage
                  .getItem("name")
                  ?.split(" ")
                  ?.map((word) => word[0].toUpperCase() + word.slice(1))
                  .join("") || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                {localStorage.getItem("email") || "admin@example.com"}
              </p>
            </div>
          </div>

          <Button
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            text="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("name");
              localStorage.removeItem("email");
              navigate("/");
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
