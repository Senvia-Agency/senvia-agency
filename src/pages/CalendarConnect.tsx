import { useEffect } from "react";
import { GoogleCalendarConnect } from "@/components/dashboard/GoogleCalendarConnect";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CalendarConnect = () => {
  useEffect(() => {
    document.title = "Conectar Calendário | SENVIA";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Conecte seu Google Calendar
            </h1>
            <p className="text-lg text-muted-foreground">
              Sincronize seus eventos e melhore sua experiência
            </p>
          </div>

          <GoogleCalendarConnect />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CalendarConnect;
