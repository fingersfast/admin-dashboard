import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserData, getCurrentUser } from "./auth";

// Define route access by role
export const routePermissions: Record<string, string[]> = {
  "/dashboard": ["admin", "user"],
  "/dashboard/users": ["admin"],
  "/dashboard/products": ["admin"],
  "/dashboard/reports": ["admin", "user"],
  "/dashboard/settings": ["admin", "user"],
};

export const useAuthorization = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error("Error checking authorization:", error);
        setUser(null);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Check if a user is authorized for a specific route
  const checkRouteAccess = (route: string) => {
    if (!user) return false;

    // Check if the route exists in permissions
    const allowedRoles = routePermissions[route];
    // If route is not in the permissions list, default to admin-only
    if (!allowedRoles) return user.role === "admin";

    return allowedRoles.includes(user.role);
  };

  // A function to check authorization for current route
  const authorizeRoute = (route: string) => {
    if (loading) return false;

    const hasAccess = checkRouteAccess(route);
    setAuthorized(hasAccess);
    return hasAccess;
  };

  return {
    user,
    loading,
    authorized,
    authorizeRoute,
    checkRouteAccess,
  };
};
