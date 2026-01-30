import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, MousePointerClick, MessageSquare } from "lucide-react";

interface CampaignOverviewProps {
    campaign: any;
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
    // These stats would ideally come from the database aggregation
    // For now, we'll use placeholder data or data derived from the campaign object if available
    const stats = [
        {
            title: "Total Leads",
            value: "1,234",
            icon: Users,
            change: "+12%",
            desc: "from last month",
        },
        {
            title: "Emails Sent",
            value: "854",
            icon: Mail,
            change: "+25%",
            desc: "from last month",
        },
        {
            title: "Open Rate",
            value: "45%",
            icon: MousePointerClick,
            change: "+5%",
            desc: "from last month",
        },
        {
            title: "Reply Rate",
            value: "12%",
            icon: MessageSquare,
            change: "+2%",
            desc: "from last month",
        },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-500 font-medium">
                                    {stat.change}
                                </span>{" "}
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground text-center py-8">
                        Activity log coming soon...
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
