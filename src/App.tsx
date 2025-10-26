import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";
import Navbar from "./components/layout/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useUser } from '@clerk/clerk-react';

const queryClient = new QueryClient();

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  // Wait until Clerk finishes initializing
  if (!isLoaded) return null;

  // If user not signed-in and not on auth routes, redirect to /login
  if (!isSignedIn && !['/login', '/sign-up'].includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {isSignedIn && <Navbar />}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
