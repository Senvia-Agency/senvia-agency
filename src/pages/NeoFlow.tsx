import { Helmet } from "react-helmet-async";
import NeoFlowAlertBar from "@/components/neoflow/NeoFlowAlertBar";
import NeoFlowHero from "@/components/neoflow/NeoFlowHero";
import NeoFlowMetrics from "@/components/neoflow/NeoFlowMetrics";
import NeoFlowDemo from "@/components/neoflow/NeoFlowDemo";
import NeoFlowValue from "@/components/neoflow/NeoFlowValue";
import NeoFlowCaseStudy from "@/components/neoflow/NeoFlowCaseStudy";
import NeoFlowTimeline from "@/components/neoflow/NeoFlowTimeline";
import NeoFlowSecurity from "@/components/neoflow/NeoFlowSecurity";
import NeoFlowPricing from "@/components/neoflow/NeoFlowPricing";
import NeoFlowROI from "@/components/neoflow/NeoFlowROI";
import NeoFlowFAQ from "@/components/neoflow/NeoFlowFAQ";
import NeoFlowCTA from "@/components/neoflow/NeoFlowCTA";
import NeoFlowFooter from "@/components/neoflow/NeoFlowFooter";

const NeoFlow = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SENVIA NeoFlow™ - Colaborador Digital Completo</title>
        <meta name="description" content="Site de Alta Conversão + CRM + Automação WhatsApp & E-mail em 15 dias. €897 one-off + manutenção €100/mês." />
      </Helmet>
      
      <NeoFlowAlertBar />
      <NeoFlowHero />
      <NeoFlowMetrics />
      <NeoFlowDemo />
      <NeoFlowValue />
      <NeoFlowCaseStudy />
      <NeoFlowTimeline />
      <NeoFlowSecurity />
      <NeoFlowPricing />
      <NeoFlowROI />
      <NeoFlowFAQ />
      <NeoFlowCTA />
      <NeoFlowFooter />
    </div>
  );
};

export default NeoFlow;