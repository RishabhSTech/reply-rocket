import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { TrendingUp, TrendingDown, Mail, Users, Reply, Calendar } from "lucide-react";

const AnalyticsPage = () => {
  const [currentPath, setCurrentPath] = useState("/analytics");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      }
    });
  }, [navigate]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    navigate(path);
  };

  const metrics = [
    {
      title: "Total Emails Sent",
      value: "12,847",
      change: "+12.5%",
      trend: "up",
      icon: Mail,
    },
    {
      title: "Open Rate",
      value: "42.3%",
      change: "+3.2%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Reply Rate",
      value: "8.7%",
      change: "+0.8%",
      trend: "up",
      icon: Reply,
    },
    {
      title: "Meetings Booked",
      value: "47",
      change: "-2.1%",
      trend: "down",
      icon: Calendar,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Analytics" 
          onNewCampaign={() => navigate("/leads")} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => (
                <Card key={metric.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <metric.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        metric.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart */}
            <PerformanceChart />

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Q1 Enterprise Outreach", rate: "12.4%" },
                      { name: "Product Launch Series", rate: "9.8%" },
                      { name: "Holiday Re-engagement", rate: "7.2%" },
                    ].map((campaign, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{campaign.name}</span>
                        <span className="text-sm font-medium text-primary">{campaign.rate} reply rate</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Best Send Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "Tuesday 10:00 AM", rate: "48.2%" },
                      { time: "Wednesday 2:00 PM", rate: "45.6%" },
                      { time: "Thursday 9:00 AM", rate: "43.1%" },
                    ].map((slot, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm">{slot.time}</span>
                        <span className="text-sm font-medium text-primary">{slot.rate} open rate</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
