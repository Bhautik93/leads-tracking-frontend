import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Spinner from "./components/Spinner";

const Login = lazy(() => import("./pages/Admin/Login"));
const Register = lazy(() => import("./pages/Admin/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Leads = lazy(() => import("./pages/Leads"));
const CreateLead = lazy(() => import("./pages/CreateLead"));
const LeadDetail = lazy(() => import("./pages/LeadDetail"));
const ProtectedLayout = lazy(() => import("./components/ProtectedLayout"));
const PublicLayout = lazy(() => import("./components/PublicLayout"));
const PageNotFound = lazy(() => import("./pages/404/PageNotFound"));

function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/create-admin" element={<Register />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/new" element={<CreateLead />} />
            <Route path="/leads/details" element={<LeadDetail />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
