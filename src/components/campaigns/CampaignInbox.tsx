import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Mail, Reply, Archive, MoreVertical } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

interface CampaignInboxProps {
    campaignId: string;
}

// Mock data for demo purposes
const MOCK_THREADS = [
    {
        id: "1",
        leadName: "Sarah Connor",
        company: "Skynet Corp",
        subject: "Re: Partnership opportunity",
        preview: "That sounds interesting, but we're currently focusing on...",
        date: "2m ago",
        status: "unread",
        messages: [
            { sender: "me", content: "Hi Sarah, checking in...", date: "Yesterday" },
            { sender: "lead", content: "That sounds interesting, but we're currently focusing on AI safety. Can you explain how you handle containment?", date: "10:30 AM" }
        ]
    },
    {
        id: "2",
        leadName: "John Anderson",
        company: "Meta Cortex",
        subject: "Re: Quick question",
        preview: "Let's schedule a call for next week.",
        date: "1h ago",
        status: "read",
        messages: [
            { sender: "me", content: "Hi John...", date: "Yesterday" },
            { sender: "lead", content: "Let's schedule a call for next week. Tuesday works?", date: "9:15 AM" }
        ]
    }
];

export function CampaignInbox({ campaignId }: CampaignInboxProps) {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState("");

    const selectedThread = MOCK_THREADS.find(t => t.id === selectedThreadId);

    return (
        <div className="grid grid-cols-12 gap-0 h-[600px] border rounded-lg overflow-hidden bg-background">
            {/* Thread List */}
            <div className="col-span-4 border-r flex flex-col">
                <div className="p-4 border-b space-y-3">
                    <h3 className="font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Inbox
                    </h3>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search replies..." className="pl-9" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {MOCK_THREADS.map(thread => (
                        <div
                            key={thread.id}
                            className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${selectedThreadId === thread.id ? 'bg-muted/80' : ''} ${thread.status === 'unread' ? 'bg-blue-50/30' : ''}`}
                            onClick={() => setSelectedThreadId(thread.id)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm ${thread.status === 'unread' ? 'font-bold' : 'font-medium'}`}>
                                    {thread.leadName}
                                </span>
                                <span className="text-xs text-muted-foreground">{thread.date}</span>
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">{thread.company}</div>
                            <div className="text-xs font-medium truncate mb-1">{thread.subject}</div>
                            <div className="text-xs text-muted-foreground truncate opacity-80">{thread.preview}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message View */}
            <div className="col-span-8 flex flex-col bg-slate-50/50">
                {selectedThread ? (
                    <>
                        <div className="p-6 border-b bg-background flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarFallback>{selectedThread.leadName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-semibold">{selectedThread.subject}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedThread.leadName} <span className="text-xs px-1">&bull;</span> {selectedThread.company}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon"><Archive className="w-4 h-4" /></Button>
                                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedThread.messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-lg p-4 ${msg.sender === 'me' ? 'bg-primary text-primary-foreground ml-12' : 'bg-white border mr-12'}`}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                        <div className={`text-[10px] mt-2 ${msg.sender === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                            {msg.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t bg-background">
                            <div className="space-y-4">
                                <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
                                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">Suggest: Schedule Call</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">Suggest: Send Info</Badge>
                                    <Badge variant="outline" className="cursor-pointer hover:bg-muted">Suggest: Not Interested</Badge>
                                </div>
                                <Textarea
                                    placeholder="Type your reply..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="min-h-[100px]"
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-2">
                                        {/* Formatting tools could go here */}
                                    </div>
                                    <Button>
                                        <Reply className="w-4 h-4 mr-2" />
                                        Send Reply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <Mail className="w-12 h-12 mb-4 opacity-20" />
                        <p>Select a conversation to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
