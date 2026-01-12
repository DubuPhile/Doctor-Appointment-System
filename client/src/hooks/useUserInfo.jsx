import { useMemo } from "react";
import useAuth from "./useAuth";
import {jwtDecode} from "jwt-decode";

export const useUserInfo = () => {
  const { auth } = useAuth();

  return useMemo(() => {
    if (!auth?.accessToken) return { user: null, email: null, roles: null };

    const decoded = jwtDecode(auth.accessToken);
    return {
      userInfo:decoded?.UserInfo || null,
      userId:decoded?.UserInfo?._id || decoded?._id || null,
      user: decoded?.UserInfo?.user || decoded?.user || null,
      isDoctor: decoded?.UserInfo?.isDoctor || decoded?.isDoctor || null,
      roles: decoded?.UserInfo?.roles || decoded?.roles || null,
    };
  }, [auth?.accessToken]);
};
