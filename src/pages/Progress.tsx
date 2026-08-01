import React, { useMemo, useState } from "react";
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLoading,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import { TrendingDown, TrendingUp, Calendar, History, Trash2 } from "lucide-react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  isBefore,
  subDays,
  subMonths,
  subYears,
  eachMonthOfInterval,
} from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuthStore } from "../store/authStore";
import {
  useWeightsQuery,
  useDeleteWeightMutation,
} from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";

type TimeRange = "30d" | "90d" | "6m" | "1y" | "all";

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: "30d", label: "30D" },
  { value: "90d", label: "90D" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "ALL" },
];

const getCutoffDate = (range: TimeRange): Date | null => {
  const now = new Date();
  switch (range) {
    case "30d":
      return subDays(now, 30);
    case "90d":
      return subDays(now, 90);
    case "6m":
      return subMonths(now, 6);
    case "1y":
      return subYears(now, 1);
    default:
      return null;
  }
};

const getTickFormat = (range: TimeRange): string => {
  switch (range) {
    case "30d":
    case "90d":
      return "MMM d";
    case "6m":
    case "1y":
      return "MMM";
    default:
      return "MMM yy";
  }
};

const Progress: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();
  const weightsQuery = useWeightsQuery(true);
  const deleteMut = useDeleteWeightMutation();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const activeRangeIndex = TIME_RANGES.findIndex((r) => r.value === timeRange);

  const weights = useMemo(() => weightsQuery.data ?? [], [weightsQuery.data]);
  const latestWeight = weights[weights.length - 1]?.weight ?? 0;

  const monthlyChange = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const thisMonth = weights.filter(
      (w) => !isBefore(parseISO(w.date), monthStart)
    );

    if (thisMonth.length < 2) return null;

    return thisMonth[thisMonth.length - 1].weight - thisMonth[0].weight;
  }, [weights]);

  const filteredWeights = useMemo(() => {
    const cutoff = getCutoffDate(timeRange);
    if (!cutoff) return weights;
    return weights.filter((w) => !isBefore(parseISO(w.date), cutoff));
  }, [weights, timeRange]);

  const chartData = useMemo(
    () =>
      filteredWeights.map((w) => ({
        timestamp: parseISO(w.date).getTime(),
        weight: w.weight,
      })),
    [filteredWeights]
  );

  const xAxisTicks = useMemo(() => {
    if (chartData.length === 0) return [];

    const start = new Date(chartData[0].timestamp);
    const end = new Date(chartData[chartData.length - 1].timestamp);

    if (timeRange === "6m" || timeRange === "1y" || timeRange === "all") {
      return eachMonthOfInterval({
        start: startOfMonth(start),
        end: endOfMonth(end),
      }).map((date) => date.getTime());
    }

    const ticks: number[] = [];
    let lastDay = "";

    for (const point of chartData) {
      const day = format(new Date(point.timestamp), "yyyy-MM-dd");
      if (day !== lastDay) {
        ticks.push(point.timestamp);
        lastDay = day;
      }
    }

    return ticks;
  }, [chartData, timeRange]);

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    try {
      await qc.invalidateQueries({ queryKey: ["weight"] });
    } finally {
      // This tells Ionic the refresh is done so the spinner disappears
      event.detail.complete();
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar
          className="--background: transparent; pt-4"
          style={{
            "--padding-start": "12px",
            "--padding-end": "12px",
            paddingTop: "var(--ion-safe-area-top)",
          }}
        >
          <IonTitle className="text-2xl font-black text-slate-900 px-0">
            Progress
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="--background: #f8fafc;">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="px-2 py-4 space-y-6">
          {/* 1. HERO CHART CARD */}
          <div className="bg-white rounded-[2.5rem] px-4 py-5 shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">
                  Weight Trend
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">
                    {latestWeight}
                  </span>
                  <span className="text-slate-400 font-bold">kg</span>
                </div>
              </div>
              {monthlyChange !== null && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                    monthlyChange <= 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {monthlyChange <= 0 ? (
                    <TrendingDown size={14} />
                  ) : (
                    <TrendingUp size={14} />
                  )}
                  {Math.abs(monthlyChange).toFixed(1)} kg this month
                </div>
              )}
            </div>

            <div className="h-64 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient
                      id="colorWeight"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
                  />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    domain={["dataMin", "dataMax"]}
                    ticks={xAxisTicks}
                    tickFormatter={(value) =>
                      format(new Date(value), getTickFormat(timeRange))
                    }
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
                    domain={["dataMin - 2", "dataMax + 2"]}
                    width={36}
                  />
                  <Tooltip
                    labelFormatter={(value) =>
                      format(new Date(value), "MMM d, yyyy")
                    }
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                    dot={false}
                    activeDot={{ r: 4, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div
              className="relative flex rounded-full p-1 mt-1"
              style={{ backgroundColor: "#EBEBF0" }}
            >
              <div
                className="absolute rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-200 ease-out"
                style={{
                  top: "4px",
                  bottom: "4px",
                  width: `calc((100% - 8px) / ${TIME_RANGES.length})`,
                  left: `calc(4px + ${activeRangeIndex} * (100% - 8px) / ${TIME_RANGES.length})`,
                }}
              />
              {TIME_RANGES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTimeRange(value)}
                  className={`relative z-10 flex-1 border-0 bg-transparent py-1.5 text-[13px] rounded-full transition-colors duration-200 appearance-none ${
                    timeRange === value
                      ? "text-neutral-900 font-bold"
                      : "text-neutral-500 font-semibold"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. QUICK STATS GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-600 rounded-4xl p-5 text-white shadow-lg shadow-indigo-100">
              <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">
                Goal Weight
              </p>
              <h4 className="text-2xl font-black">
                {user?.goalWeight || "--"}{" "}
                <span className="text-sm font-medium opacity-60">kg</span>
              </h4>
            </div>
            <div className="bg-white rounded-4xl p-5 border border-slate-100 shadow-sm">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                To Goal
              </p>
              <h4 className="text-2xl font-black text-slate-900">
                {user?.goalWeight
                  ? Math.abs(latestWeight - user.goalWeight).toFixed(1)
                  : "--"}
                <span className="text-sm font-medium text-slate-300 ml-1">
                  kg
                </span>
              </h4>
            </div>
          </div>

          {/* 3. RECENT HISTORY LIST */}
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                History
              </h3>
              <History size={16} className="text-slate-300" />
            </div>

            <div className="space-y-3">
              {[...weights]
                .reverse()
                .slice(0, 5)
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="text-slate-900 font-bold">
                          {entry.weight} kg
                        </p>
                        <p className="text-slate-400 text-xs font-medium">
                          {format(parseISO(entry.date), "MMMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMut.mutate(entry.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <IonLoading isOpen={weightsQuery.isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default Progress;
