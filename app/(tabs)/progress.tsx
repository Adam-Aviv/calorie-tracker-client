import { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  History,
  Trash2,
} from "lucide-react-native";
import {
  format,
  parseISO,
  startOfMonth,
  isBefore,
  subDays,
  subMonths,
  subYears,
} from "date-fns";
import { LineChart } from "react-native-gifted-charts";
import { useAuthStore } from "../../src/store/authStore";
import { useWeightsQuery, useDeleteWeightMutation } from "../../src/hooks/queries";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function ProgressScreen() {
  const user = useAuthStore((state) => state.user);
  const qc = useQueryClient();
  const weightsQuery = useWeightsQuery(true);
  const deleteMut = useDeleteWeightMutation();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  const weights = useMemo(() => weightsQuery.data ?? [], [weightsQuery.data]);
  const latestWeight = weights[weights.length - 1]?.weight ?? 0;

  const monthlyChange = useMemo(() => {
    const monthStart = startOfMonth(new Date());
    const thisMonth = weights.filter(
      (w) => !isBefore(parseISO(w.date), monthStart),
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
        value: w.weight,
        label: format(parseISO(w.date), "MMM d"),
      })),
    [filteredWeights],
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={["top"]}>
      <Text className="text-2xl font-black text-slate-900 px-3 pt-3 pb-2">
        Progress
      </Text>
      <ScrollView
        className="flex-1 px-3"
        refreshControl={
          <RefreshControl
            refreshing={weightsQuery.isRefetching}
            onRefresh={() => qc.invalidateQueries({ queryKey: ["weight"] })}
          />
        }
        contentContainerClassName="pb-8 gap-6"
      >
        <View className="bg-white rounded-[2.5rem] px-4 py-5 border border-slate-100">
          <View className="flex-row justify-between items-start mb-6">
            <View>
              <Text className="text-slate-400 text-xs font-black uppercase tracking-widest">
                Weight Trend
              </Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-3xl font-black text-slate-900">
                  {latestWeight || "--"}
                </Text>
                <Text className="text-slate-400 font-bold">kg</Text>
              </View>
            </View>
            {monthlyChange !== null ? (
              <View
                className={`px-3 py-1 rounded-full flex-row items-center gap-1 ${
                  monthlyChange <= 0 ? "bg-emerald-50" : "bg-amber-50"
                }`}
              >
                {monthlyChange <= 0 ? (
                  <TrendingDown size={14} color="#059669" />
                ) : (
                  <TrendingUp size={14} color="#d97706" />
                )}
                <Text
                  className={`text-xs font-black ${
                    monthlyChange <= 0 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {Math.abs(monthlyChange).toFixed(1)} kg this month
                </Text>
              </View>
            ) : null}
          </View>

          {chartData.length > 1 ? (
            <LineChart
              data={chartData}
              color="#4f46e5"
              thickness={3}
              hideDataPoints
              areaChart
              startFillColor="#4f46e5"
              startOpacity={0.25}
              endOpacity={0}
              yAxisColor="transparent"
              xAxisColor="transparent"
              yAxisTextStyle={{ color: "#9ca3af", fontSize: 11 }}
              xAxisLabelTextStyle={{ color: "#9ca3af", fontSize: 10 }}
              noOfSections={4}
              height={220}
            />
          ) : (
            <View className="h-40 items-center justify-center">
              <Text className="text-slate-400 font-semibold">
                Log a few weights to see a trend
              </Text>
            </View>
          )}

          <View className="flex-row rounded-full p-1 mt-4 bg-slate-100">
            {TIME_RANGES.map(({ value, label }) => (
              <Pressable
                key={value}
                onPress={() => setTimeRange(value)}
                className={`flex-1 py-1.5 rounded-full items-center ${
                  timeRange === value ? "bg-white" : ""
                }`}
              >
                <Text
                  className={`text-[13px] ${
                    timeRange === value
                      ? "text-neutral-900 font-bold"
                      : "text-neutral-500 font-semibold"
                  }`}
                >
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-indigo-600 rounded-3xl p-5">
            <Text className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-1">
              Goal Weight
            </Text>
            <Text className="text-2xl font-black text-white">
              {user?.goalWeight || "--"}{" "}
              <Text className="text-sm font-medium text-white/60">kg</Text>
            </Text>
          </View>
          <View className="flex-1 bg-white rounded-3xl p-5 border border-slate-100">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
              To Goal
            </Text>
            <Text className="text-2xl font-black text-slate-900">
              {user?.goalWeight
                ? Math.abs(latestWeight - user.goalWeight).toFixed(1)
                : "--"}
              <Text className="text-sm font-medium text-slate-300"> kg</Text>
            </Text>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between items-center px-2 mb-3">
            <Text className="text-xs font-black uppercase tracking-widest text-slate-400">
              History
            </Text>
            <History size={16} color="#cbd5e1" />
          </View>
          <View className="gap-3">
            {[...weights]
              .reverse()
              .slice(0, 5)
              .map((entry) => (
                <View
                  key={entry.id}
                  className="bg-white p-4 rounded-3xl border border-slate-50 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-4">
                    <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
                      <Calendar size={20} color="#94a3b8" />
                    </View>
                    <View>
                      <Text className="text-slate-900 font-bold">
                        {entry.weight} kg
                      </Text>
                      <Text className="text-slate-400 text-xs font-medium">
                        {format(parseISO(entry.date), "MMMM d, yyyy")}
                      </Text>
                    </View>
                  </View>
                  <Pressable onPress={() => deleteMut.mutate(entry.id)}>
                    <Trash2 size={18} color="#cbd5e1" />
                  </Pressable>
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
