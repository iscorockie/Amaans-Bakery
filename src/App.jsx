import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import SpecialOrderPage from "./pages/SpecialOrderPage.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/order" element={<SpecialOrderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
