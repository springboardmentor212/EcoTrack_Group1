import { useEffect, useState } from "react";
import * as userService from "../services/userService";

export default function useCurrentUser() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    userService
      .getMyProfile()
      .then((res) => {
        if (mounted) {
          setProfile(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to load current user", err);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const name = profile?.fullName || "";
  const initial = name
    ? name.charAt(0).toUpperCase()
    : "?";

  const role = profile?.role || "user";

  return {
    profile,
    name,
    initial,
    email: profile?.email || "",
    role,
    loading,
  };
}