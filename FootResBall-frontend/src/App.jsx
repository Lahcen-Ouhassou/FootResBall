import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import ReservationsPage from "./components/ReservationsPage";
import ReservationForm from "./components/ReservationForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import EditReservationPage from "./components/EditReservationPage";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />
        <main className="flex-1 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reservations"
          element={
            <AppLayout>
              <ReservationsPage />
            </AppLayout>
          }
        />

        {/* ADD NEW RESERVATION */}
        <Route
          path="/reserve"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReservationForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* EDIT RESERVATION */}
        <Route
          path="/reserve-edit/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EditReservationPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
