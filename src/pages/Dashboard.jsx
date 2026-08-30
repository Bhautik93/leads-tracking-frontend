import React from "react";
import { Users } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
          <Users className="h-8 w-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to Leads Tracking
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
          Manage your leads, track their progress, and keep everything
          organized from one place.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;