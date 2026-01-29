import { cn } from "@/lib/utils";
import { Mail, Reply, Calendar, MousePointer, Eye } from "lucide-react";

interface Activity {
  id: string;
  type: "sent" | "opened" | "clicked" | "replied" | "meeting";
  lead: string;
  campaign: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: "1",
    type: "replied",
    lead: "Sarah Chen",
    campaign: "Q1 Outreach",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "meeting",
    lead: "Michael Ross",
    campaign: "Enterprise Demo",
    time: "15 min ago",
  },
  {
    id: "3",
    type: "opened",
    lead: "Emily Watson",
    campaign: "Q1 Outreach",
    time: "32 min ago",
  },
  {
    id: "4",
    type: "clicked",
    lead: "David Kim",
    campaign: "Product Launch",
    time: "1 hour ago",
  },
  {
    id: "5",
    type: "sent",
    lead: "Lisa Park",
    campaign: "Q1 Outreach",
    time: "2 hours ago",
  },
];

const activityIcons = {
  sent: Mail,
  opened: Eye,
  clicked: MousePointer,
  replied: Reply,
  meeting: Calendar,
};

const activityStyles = {
  sent: "bg-muted text-muted-foreground",
  opened: "bg-primary/10 text-primary",
  clicked: "bg-warning/10 text-warning",
  replied: "bg-success/10 text-success",
  meeting: "bg-accent/10 text-accent",
};

const activityLabels = {
  sent: "Email sent to",
  opened: "Email opened by",
  clicked: "Link clicked by",
  replied: "Reply from",
  meeting: "Meeting booked with",
};

export function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border animate-slide-up">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-foreground">Recent Activity</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Live updates from your campaigns
        </p>
      </div>

      <div className="divide-y divide-border">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-4 hover:bg-secondary/30 transition-colors"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0",
                  activityStyles[activity.type]
                )}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="text-muted-foreground">
                    {activityLabels[activity.type]}
                  </span>{" "}
                  <span className="font-medium">{activity.lead}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.campaign} • {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border">
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all activity →
        </button>
      </div>
    </div>
  );
}
