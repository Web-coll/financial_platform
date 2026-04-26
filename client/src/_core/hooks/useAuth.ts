import { useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

const DEMO_USER = {
  id: "guest-user",
  name: "Invitado",
  email: "invitado@finplan.local",
};

/**
 * Modo demo sin login obligatorio.
 * Mantiene la misma API del hook para no romper componentes existentes.
 */
export function useAuth(_options?: UseAuthOptions) {
  const state = useMemo(
    () => ({
      user: DEMO_USER,
      loading: false,
      error: null,
      isAuthenticated: true,
    }),
    []
  );

  return {
    ...state,
    refresh: async () => state,
    logout: async () => undefined,
  };
}
