import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { CampaignCard } from "@/components/dashboard/CampaignCard";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { EmailComposer } from "@/components/composer/EmailComposer";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { Mail, Users, Reply, Calendar } from "lucide-react";

const Index = () => {
  const [currentPath, setCurrentPath] = useState("/");
  const [stats, setStats] = useState({
    emailsSent: 0,
    activeLeads: 0,
    replyRate: "0%",
    meetingsBooked: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        loadStats();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadStats = async () => {
    const { data: leads } = await supabase.from("leads").select("*");
    const { data: emails } = await supabase.from("email_logs").select("*").eq("status", "sent");
    
    const repliedLeads = leads?.filter(l => l.status === "replied").length || 0;
    const totalLeads = leads?.length || 0;
    const replyRate = totalLeads > 0 ? ((repliedLeads / totalLeads) * 100).toFixed(1) : "0";
    
    setStats({
      emailsSent: emails?.length || 0,
      activeLeads: totalLeads,
      replyRate: `${replyRate}%`,
      meetingsBooked: leads?.filter(l => l.status === "meeting").length || 0,
    });
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(path);
  };

  const campaigns = [
    {
      name: "Q1 Enterprise Outreach",
      status: "active" as const,
      sent: 2450,
      opened: 892,
      clicked: 234,
      replied: 67,
    },
    {
      name: "Product Launch Series",
      status: "active" as const,
      sent: 1830,
      opened: 712,
      clicked: 189,
      replied: 45,
    },
    {
      name: "Holiday Re-engagement",
      status: "completed" as const,
      sent: 3200,
      opened: 1280,
      clicked: 384,
      replied: 96,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Dashboard" 
          onNewCampaign={() => navigate("/leads")} 
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Emails Sent"
                value={stats.emailsSent.toLocaleString()}
                change={{ value: "+12.5%", trend: "up" }}
                icon={Mail}
                iconColor="text-primary"
                delay={0}
              />
              <StatCard
                title="Active Leads"
                value={stats.activeLeads.toLocaleString()}
                change={{ value: "+8.2%", trend: "up" }}
                icon={Users}
                iconColor="text-accent"
                delay={50}
              />
              <StatCard
                title="Reply Rate"
                value={stats.replyRate}
                change={{ value: "+0.6%", trend: "up" }}
                icon={Reply}
                iconColor="text-success"
                delay={100}
              />
              <StatCard
                title="Meetings Booked"
                value={stats.meetingsBooked.toString()}
                change={{ value: "+23%", trend: "up" }}
                icon={Calendar}
                iconColor="text-warning"
                delay={150}
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Chart & Campaigns */}
              <div className="xl:col-span-2 space-y-6">
                <PerformanceChart />
                
                {/* Campaigns */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      Active Campaigns
                    </h2>
                    <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      View all →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {campaigns.map((campaign, index) => (
                      <CampaignCard
                        key={campaign.name}
                        {...campaign}
                        delay={index * 50}
                      />
                    ))}
                  </div>
                </div>

                {/* Leads Table */}
                <LeadsTable />
              </div>

              {/* Right Column - Composer & Activity */}
              <div className="space-y-6">
                <EmailComposer />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
