import { useEffect } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { GoogleCalendarConnect } from "@/components/dashboard/GoogleCalendarConnect";
import Footer from "@/components/Footer";

const DashboardCalendar = () => {
  useEffect(() => {
    document.title = "Calendário | SENVIA";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Calendário
              </h1>
              <p className="text-muted-foreground">
                Conecte seu Google Calendar para melhorar sua experiência
              </p>
            </div>

            <GoogleCalendarConnect />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardCalendar;
