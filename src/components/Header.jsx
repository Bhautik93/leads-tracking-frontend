import React, { useState } from "react";
import { Users, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "./Button";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-gray-100 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Users className="h-5 w-5 text-white" />
          </div>

          <h1 className="text-lg font-bold text-gray-900">
            Leads Tracker
          </h1>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Leads
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
              <span className="text-sm font-semibold text-blue-600">
                {localStorage.getItem("name")?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800">
                {localStorage.getItem("name") || "Admin"}
              </p>

              <p className="text-xs text-gray-500">
                {localStorage.getItem("email") || "admin@example.com"}
              </p>
            </div>
          </div>

          <Button
            text="Logout"
            onClick={handleLogout}
            className="hidden cursor-pointer rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:block"
          />

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <NavLink
            to="/leads"
            onClick={() => setIsMenuOpen(false)}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            Leads
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;