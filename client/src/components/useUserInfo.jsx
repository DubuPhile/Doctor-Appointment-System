import { useMemo } from "react";
import useAuth from "../hooks/useAuth";
import {jwtDecode} from "jwt-decode";

export const useUserInfo = () => {
  const { auth } = useAuth();

  return useMemo(() => {
    if (!auth?.accessToken) return { user: null, email: null, roles: null };

    const decoded = jwtDecode(auth.accessToken);
    return {
      user: decoded?.UserInfo?.user || decoded?.user || null,
      email: decoded?.UserInfo?.email || decoded?.email || null,
      roles: decoded?.UserInfo?.roles || decoded?.roles || null,
    };
  }, [auth?.accessToken]);
};
