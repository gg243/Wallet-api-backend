import { useUser, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTrasnactions } from "../../hooks/useTransactions";
import { styles } from "../../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { BalanceCard } from "../../components/BalanceCard";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefrshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTrasnactions(user.id);

  const onRefresh = async () => {
    setRefrshing(true);
    await loadData();
    setRefrshing(false);
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = (id) => {
    Alert.alert(
      " Delete Transaction",
      " Are you sure you want yo delete this transaction?",
      [
        { text: "cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View styles={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.header.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.usernameText}>
              {user?.emailAddresses[0]?.emailAddresses.split("@")[0]}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/create")}
          >
            <Ionicons name="add" size={28} color="#FFF" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
          <SignOutButton />
        </View>
      </View>
      <BalanceCard summary={summary} />

      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={{ item }}
      />
    </View>
  );
}