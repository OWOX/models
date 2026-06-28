import { AuthProvider, useAuth } from "./lib/auth";
import { AccountProvider } from "./lib/account";
import { CanvasApp } from "./components/canvas/Canvas";

function Shell() {
  const { ready } = useAuth();
  if (!ready) return null;
  return <CanvasApp />;
}

export function App() {
  // AuthProvider = OWOX "connect" (Push). AccountProvider = Supabase account
  // (Save). Independent; the account UI manages its own readiness.
  return (
    <AccountProvider>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </AccountProvider>
  );
}
