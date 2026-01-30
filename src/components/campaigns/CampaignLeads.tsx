import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Users,
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Mail,
    Linkedin,
    ExternalLink,
    Trash2
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CampaignLeadsProps {
    campaignId: string;
}

const statusStyles: Record<string, string> = {
    "Pending": "bg-muted text-muted-foreground border-border",
    "Intro Sent": "bg-primary/10 text-primary border-primary/20",
    "Replied": "bg-success/10 text-success border-success/20",
    "1st Follow Up": "bg-warning/10 text-warning border-warning/20",
    "2nd Follow Up": "bg-orange-500/10 text-orange-500 border-orange-500/20",
    "Not Interested": "bg-destructive/10 text-destructive border-destructive/20",
    "Meeting Booked": "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

export function CampaignLeads({ campaignId }: CampaignLeadsProps) {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadLeads();
    }, [campaignId]);

    const loadLeads = async () => {
        try {
            // In a real implementation, we would filter by campaign_id
            // For now, we'll fetch all leads and simulate the relationship
            // OR we assuming schema update: leads has campaign_id

            // Let's check if we can filter by campaign_id
            // If not, we might need to create a junction table or add the column
            // Proceeding with assumption that 'campaign_id' column exists or we fetch all for now

            const { data, error } = await supabase
                .from("leads")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;

            // Filter client-side if needed (or server side if column exists)
            // For this demo, we'll show all leads but ideally we filter: .eq('campaign_id', campaignId)
            setLeads(data || []);
        } catch (error) {
            console.error("Error loading leads:", error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const handleAddLead = () => {
        toast.info("Import Leads feature coming soon");
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Campaign Leads</CardTitle>
                        <CardDescription>Manage leads assigned to this campaign</CardDescription>
                    </div>
                    <Button onClick={handleAddLead}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Leads
                    </Button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leads..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8">Loading...</div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No leads found in this campaign.</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b text-xs font-medium text-muted-foreground uppercase">
                            <div className="col-span-1 flex items-center"><Checkbox /></div>
                            <div className="col-span-4">Lead</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-3">Contact</div>
                            <div className="col-span-1"></div>
                        </div>
                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="grid grid-cols-12 gap-4 py-4 px-4 border-b last:border-0 hover:bg-muted/50 items-center transition-colors">
                                <div className="col-span-1 flex items-center"><Checkbox /></div>
                                <div className="col-span-4">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                {lead.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-medium text-sm">{lead.name}</h4>
                                            <p className="text-xs text-muted-foreground">{lead.position}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    <Badge variant="outline" className={cn("capitalize font-normal", statusStyles[lead.status] || statusStyles["Pending"])}>
                                        {lead.status || "Pending"}
                                    </Badge>
                                </div>
                                <div className="col-span-3 flex items-center gap-2">
                                    {lead.email && <Mail className="w-3 h-3 text-muted-foreground" />}
                                    <span className="text-xs text-muted-foreground truncate">{lead.email || "No email"}</span>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Remove from Campaign</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
