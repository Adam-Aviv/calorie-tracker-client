import { useState, type ComponentProps, type ReactNode } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Mail, Lock, User as UserIcon, LogIn, ArrowRight } from "lucide-react-native";
import { useLoginMutation } from "../../src/hooks/queries";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const authMutation = useLoginMutation(isRegister);

  const handleSubmit = () => {
    setError("");
    if (isRegister && !name.trim()) {
      setError("Name is required");
      return;
    }
    authMutation.mutate(
      { email: email.trim(), password, name: name.trim() },
      {
        onError: (err) => setError(err.message || "Authentication failed"),
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center px-8">
        <View className="items-center mb-10">
          <View className="p-4 bg-indigo-600 rounded-[24px] mb-6">
            <LogIn size={32} color="#fff" strokeWidth={2.5} />
          </View>
          <Text className="text-4xl font-black text-slate-900 mb-2">
            NutriTrack
          </Text>
          <Text className="text-slate-500 font-medium italic">
            Personalized Nutrition Tracking
          </Text>
        </View>

        <View className="gap-3">
          {isRegister ? (
            <InputRow
              icon={<UserIcon size={18} color="#94a3b8" />}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          ) : null}
          <InputRow
            icon={<Mail size={18} color="#94a3b8" />}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <InputRow
            icon={<Lock size={18} color="#94a3b8" />}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {error ? (
          <Text className="text-rose-500 font-bold mt-3 text-center">{error}</Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={authMutation.isPending}
          className="mt-6 h-16 bg-indigo-600 rounded-[20px] items-center justify-center"
        >
          {authMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View className="flex-row items-center gap-3">
              <Text className="text-white font-extrabold text-lg">
                {isRegister ? "Create Account" : "Sign In"}
              </Text>
              <ArrowRight size={22} color="#fff" strokeWidth={3} />
            </View>
          )}
        </Pressable>

        <View className="flex-row items-center justify-center gap-2 pt-6">
          <Text className="text-slate-400 text-sm font-semibold">
            {isRegister ? "Already a member?" : "New here?"}
          </Text>
          <Pressable
            onPress={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
          >
            <Text className="text-indigo-600 font-black text-sm">
              {isRegister ? "Sign In" : "Join NutriTrack"}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function InputRow({
  icon,
  ...props
}: { icon: ReactNode } & ComponentProps<typeof TextInput>) {
  return (
    <View className="bg-white rounded-[20px] border border-slate-200 flex-row items-center px-4 h-14">
      {icon}
      <TextInput
        className="flex-1 ml-3 font-bold text-slate-900 h-12"
        placeholderTextColor="#94a3b8"
        {...props}
      />
    </View>
  );
}
