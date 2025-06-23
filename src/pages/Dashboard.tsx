
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    document.title = "Dashboard | SENVIA";
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <DashboardOverview />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
