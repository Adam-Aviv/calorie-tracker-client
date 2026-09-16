import {
  Modal,
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  headerExtra?: ReactNode;
}

export default function AppModal({
  visible,
  onClose,
  title,
  children,
  headerExtra,
}: AppModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-slate-50" edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View className="px-4 pt-4 pb-2 flex-row items-center justify-between">
            {title ? (
              <Text className="text-2xl font-black text-slate-900 capitalize flex-1">
                {title}
              </Text>
            ) : (
              <View className="flex-1" />
            )}
            <Pressable
              onPress={onClose}
              className="p-2 bg-white rounded-full border border-slate-100"
            >
              <X size={20} color="#94a3b8" />
            </Pressable>
          </View>
          {headerExtra}
          <ScrollView
            className="flex-1 px-4"
            keyboardShouldPersistTaps="handled"
            contentContainerClassName="pb-8"
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
