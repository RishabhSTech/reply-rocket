import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { name: "Mon", opens: 42, clicks: 24, replies: 8 },
  { name: "Tue", opens: 53, clicks: 28, replies: 12 },
  { name: "Wed", opens: 49, clicks: 22, replies: 10 },
  { name: "Thu", opens: 68, clicks: 35, replies: 18 },
  { name: "Fri", opens: 72, clicks: 42, replies: 22 },
  { name: "Sat", opens: 38, clicks: 18, replies: 6 },
  { name: "Sun", opens: 35, clicks: 15, replies: 5 },
];

export function PerformanceChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-slide-up">
      <div className="mb-5">
        <h3 className="font-semibold text-foreground">Weekly Performance</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Opens, clicks, and replies over time
        </p>
      </div>

      <div className="flex items-center gap-6 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Opens</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-sm text-muted-foreground">Clicks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-sm text-muted-foreground">Replies</span>
        </div>
      </div>

      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(221, 83%, 53%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(221, 83%, 53%)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(168, 76%, 42%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(168, 76%, 42%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area
              type="monotone"
              dataKey="opens"
              stroke="hsl(221, 83%, 53%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorOpens)"
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="hsl(168, 76%, 42%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorClicks)"
            />
            <Line
              type="monotone"
              dataKey="replies"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2}
              dot={{ fill: "hsl(38, 92%, 50%)", strokeWidth: 0, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
