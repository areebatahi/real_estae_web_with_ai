import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminSidebar from "./components/AdminSidebar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import PropertySearch from "./pages/PropertySearch";
import PropertyDetail from "./pages/PropertyDetail";
import AIFinder from "./pages/AIFinder";
import Compare from "./pages/Compare";
import Saved from "./pages/Saved";
import About from "./pages/About";
import Contact from "./pages/Contact";

import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProperties from "./pages/admin/Properties";
import AddEditProperty from "./pages/admin/AddEditProperty";
import AdminLeads from "./pages/admin/Leads";
import AdminVisits from "./pages/admin/Visits";
import AdminAgents from "./pages/admin/Agents";
import Verification from "./pages/admin/Verification";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-charcoal-50">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/properties" element={<PublicLayout><PropertySearch /></PublicLayout>} />
        <Route path="/properties/:id" element={<PublicLayout><PropertyDetail /></PublicLayout>} />
        <Route path="/ai-finder" element={<PublicLayout><AIFinder /></PublicLayout>} />
        <Route path="/compare" element={<PublicLayout><Compare /></PublicLayout>} />
        <Route path="/saved" element={<PublicLayout><Saved /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute><AdminLayout><AdminProperties /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/properties/new" element={<ProtectedRoute><AdminLayout><AddEditProperty /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/properties/:id/edit" element={<ProtectedRoute><AdminLayout><AddEditProperty /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/leads" element={<ProtectedRoute><AdminLayout><AdminLeads /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/visits" element={<ProtectedRoute><AdminLayout><AdminVisits /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/agents" element={<ProtectedRoute><AdminLayout><AdminAgents /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/verification" element={<ProtectedRoute><AdminLayout><Verification /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute><AdminLayout><Analytics /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}

function NotFound() {
  return (
    <div className="container-px mx-auto max-w-3xl py-24 text-center">
      <h1 className="section-heading">Page not found</h1>
      <p className="mt-3 text-charcoal-500">The page you're looking for doesn't exist.</p>
    </div>
  );
}
