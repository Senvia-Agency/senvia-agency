
import { useEffect } from "react";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ProfileForm from "@/components/dashboard/ProfileForm";
import PasswordChangeForm from "@/components/dashboard/PasswordChangeForm";
import { useProfile } from "@/hooks/useProfile";

const DashboardProfile = () => {
  const { profile, setProfile } = useProfile();

  useEffect(() => {
    document.title = "Perfil | SENVIA";
  }, []);

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Perfil</h1>
              <p className="text-muted-foreground">
                Gerencie suas informações pessoais
              </p>
            </div>

            <ProfileForm profile={profile} setProfile={setProfile} />
            <PasswordChangeForm />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardProfile;
