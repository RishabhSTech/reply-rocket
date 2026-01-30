import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Play, Pause, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

const CampaignsPage = () => {
  const [currentPath, setCurrentPath] = useState("/campaigns");
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

  const campaigns = [
    {
      id: 1,
      name: "Q1 Enterprise Outreach",
      status: "active",
      sent: 2450,
      opened: 892,
      replied: 67,
    },
    {
      id: 2,
      name: "Product Launch Series",
      status: "active",
      sent: 1830,
      opened: 712,
      replied: 45,
    },
    {
      id: 3,
      name: "Holiday Re-engagement",
      status: "paused",
      sent: 3200,
      opened: 1280,
      replied: 96,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Campaigns" 
          onNewCampaign={() => navigate("/leads")} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                      <Badge 
                        variant={campaign.status === "active" ? "default" : "secondary"}
                        className="mt-1"
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      {campaign.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sent</p>
                      <p className="font-semibold text-lg">{campaign.sent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Opened</p>
                      <p className="font-semibold text-lg">{campaign.opened.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Replied</p>
                      <p className="font-semibold text-lg">{campaign.replied.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CampaignsPage;
