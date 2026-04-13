import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import LandingPage from "./pages/LandingPage";
import GamePage from "./pages/GamePage";
import OrderConfirmation from "./pages/OrderConfirmation";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <CartSidebar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout><LandingPage /></PublicLayout>} />
            <Route path="/game/:slug" element={<PublicLayout><GamePage /></PublicLayout>} />
            <Route path="/order/:orderNumber" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
