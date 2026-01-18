import React, { useMemo } from "react";
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
import { TrendingDown, Calendar, History, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
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
  useCreateWeightMutation,
  useDeleteWeightMutation,
} from "../hooks/queries";
import { useQueryClient } from "@tanstack/react-query";

const Progress: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();
  const weightsQuery = useWeightsQuery(true);
  const createMut = useCreateWeightMutation();
  const deleteMut = useDeleteWeightMutation();

  const weights = useMemo(
    () => [...(weightsQuery.data || [])].reverse(),
    [weightsQuery.data]
  );
  const latestWeight = weights[weights.length - 1]?.weight || 0;

  // Chart Data Formatting
  const chartData = useMemo(() => {
    return weights.map((w) => ({
      date: format(parseISO(w.date), "MMM d"),
      weight: w.weight,
    }));
  }, [weights]);

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
        <IonToolbar className="--background: transparent; pt-4 px-4">
          <IonTitle className="text-2xl font-black text-slate-900 px-0">
            Progress
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="--background: #f8fafc;">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div className="p-6 space-y-6">
          {/* 1. HERO CHART CARD */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 overflow-hidden">
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
              <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <TrendingDown size={14} /> 2.4kg this month
              </div>
            </div>

            <div className="h-64 w-full -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorWeight"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                    dy={10}
                  />
                  <YAxis hide domain={["dataMin - 5", "dataMax + 5"]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#4f46e5"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorWeight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
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
                    key={entry._id}
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
                      onClick={() => deleteMut.mutate(entry._id)}
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
