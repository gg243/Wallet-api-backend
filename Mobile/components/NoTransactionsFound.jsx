import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "../constants/colors";
import { styles } from "../assets/styles/home.styles";
import { TouchableOpacity } from "react-native";

const NoTransactionsFound = () => {
  const router = useRouter();

  return (
    <View style={styles.emptyState}>
      <Ionicons
        name=""
        size={60}
        color={COLORS.textLight}
        style={styles.emptyStateIcon}
      />

      <Text style={styles.emptyStateTitle}>No transactions yet</Text>
      <Text style={styles.emptyStateText}>
        Start tracking your finances by adding your first transaction
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => {
          router.push("/create");
        }}
      >
        <Ionicons size={18} name="" color={COLORS.white} />
        <Text style={styles.emptyStateButtonText}> Add transaction</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoTransactionsFound;
