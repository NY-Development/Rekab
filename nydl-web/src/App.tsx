import { useEffect } from "react";
import AppRouter from "@/routes";
import { useAuthStore } from "@/store/auth.store";

export default function App() {
  useEffect(() => {
    useAuthStore.getState().hydrateFromCookie();
  }, []);

  return <AppRouter />;
}