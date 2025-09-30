import { useUser } from "@clerk/clerk-react";
import { Stack } from "expo-router";
import { Redirect } from "expo-router";

export default function ProtectedRoutesLayout() {
  const { isSigned, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (!isSigned) {
    return <Redirect href="/sign-in" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
