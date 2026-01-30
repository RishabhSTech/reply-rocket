import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Star } from "lucide-react";

const InboxPage = () => {
  const [currentPath, setCurrentPath] = useState("/inbox");
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

  const messages = [
    {
      id: 1,
      from: "John Smith",
      email: "john@company.com",
      subject: "Re: Partnership Opportunity",
      preview: "Thanks for reaching out! I'd love to schedule a call to discuss...",
      time: "2h ago",
      unread: true,
      starred: true,
    },
    {
      id: 2,
      from: "Sarah Johnson",
      email: "sarah@startup.io",
      subject: "Re: Quick question about your product",
      preview: "Hi there, I've been looking at your solution and have a few questions...",
      time: "5h ago",
      unread: true,
      starred: false,
    },
    {
      id: 3,
      from: "Mike Chen",
      email: "mike@enterprise.com",
      subject: "Re: Follow up from our call",
      preview: "Great speaking with you yesterday. As discussed, here are the next steps...",
      time: "1d ago",
      unread: false,
      starred: false,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Inbox" 
          onNewCampaign={() => navigate("/leads")} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  message.unread ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {message.from.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${message.unread ? "text-foreground" : "text-muted-foreground"}`}>
                            {message.from}
                          </span>
                          {message.unread && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {message.starred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                          <span className="text-sm text-muted-foreground">{message.time}</span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${message.unread ? "font-medium" : ""}`}>
                        {message.subject}
                      </p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {message.preview}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No messages yet</h3>
                <p className="text-muted-foreground">Replies to your campaigns will appear here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InboxPage;
