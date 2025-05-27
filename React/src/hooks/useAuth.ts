import { useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  email: string;
  role: string;
  nameIdentifier: string;
  name: string;
} | null;

export default function useAuth() {
  const initialToken = Cookies.get("token");
  const decodeToken = (token: string): DecodedToken => {
    try {
      const decoded = jwtDecode(token) as Record<string, unknown>;
      const exp = decoded["exp"] as number;
      if (exp && Date.now() >= exp * 1000) {
        return null;
      }
      return {
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as string,
        nameIdentifier: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] as string,
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string,
      };
    } catch {
      return null; 
    }
  };
  const initialDecoded = initialToken ? decodeToken(initialToken) : null;
  const initialIsAuthenticated = !!initialToken && !!initialDecoded;

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialIsAuthenticated);
  const [decodedUserData, setDecodedUserData] = useState<DecodedToken>(initialDecoded);


  const userLogin = (token: string) => {
    if (!token) {
      Cookies.remove("token");
      setIsAuthenticated(false);
      setDecodedUserData(null);
      return;
    }

    const decoded = decodeToken(token);
    if (decoded) {
      Cookies.set("token", token);
      setIsAuthenticated(true);
      setDecodedUserData(decoded);
    } else {
      console.error("Invalid token provided during login");
      Cookies.remove("token");
      setIsAuthenticated(false);
      setDecodedUserData(null);
    }
  };

  const userLogout = () => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setDecodedUserData(null);
  };

  return { isAuthenticated, userLogin, userLogout, decodedUserData };
}