import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Video, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const MeetingsPage = () => {
  const [currentPath, setCurrentPath] = useState("/meetings");
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

  const meetings = [
    {
      id: 1,
      title: "Discovery Call with Acme Corp",
      attendee: "John Smith",
      email: "john@acme.com",
      date: "Today",
      time: "2:00 PM - 2:30 PM",
      type: "video",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Product Demo - TechStart",
      attendee: "Sarah Johnson",
      email: "sarah@techstart.io",
      date: "Tomorrow",
      time: "10:00 AM - 11:00 AM",
      type: "video",
      status: "upcoming",
    },
    {
      id: 3,
      title: "Follow-up with Enterprise Inc",
      attendee: "Mike Chen",
      email: "mike@enterprise.com",
      date: "Jan 31, 2026",
      time: "3:00 PM - 3:30 PM",
      type: "in-person",
      status: "scheduled",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title="Meetings" 
          onNewCampaign={() => navigate("/leads")} 
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {meeting.attendee.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{meeting.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{meeting.attendee}</p>
                      </div>
                    </div>
                    <Badge variant={meeting.status === "upcoming" ? "default" : "secondary"}>
                      {meeting.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{meeting.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {meeting.type === "video" ? (
                        <Video className="h-4 w-4" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      <span className="capitalize">{meeting.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">Join Meeting</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {meetings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No meetings scheduled</h3>
                <p className="text-muted-foreground">Booked meetings will appear here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MeetingsPage;
