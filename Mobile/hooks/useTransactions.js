import { useCallback, useState } from "react";
import { API_URL } from "../constants/api";
import { Alert } from "react-native";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);

  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fretch(`$(API_URL)/transactions/user/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.log("Error fetching transactions", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_URL}/ transactions/summary/${userId}`
      );
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error loading:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      await Promise.all(fetchTransactions(), fetchSummary());
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/transactions/ ${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      loadData();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
