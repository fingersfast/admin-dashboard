import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useAuthorization, routePermissions } from "../lib/useAuthorization";
import {
  HomeIcon,
  UsersIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Users", href: "/dashboard/users", icon: UsersIcon },
  { name: "Products", href: "/dashboard/products", icon: ShoppingBagIcon },
  { name: "Reports", href: "/dashboard/reports", icon: ChartBarIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, checkRouteAccess } = useAuthorization();

  // Filter navigation items based on user role
  const filteredNavigationItems = navigationItems.filter(
    (item) => user && checkRouteAccess(item.href)
  );

  return (
    <div
      className={cn(
        "h-full bg-white dark:bg-gray-800 flex flex-col border-r dark:border-gray-700",
        className
      )}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Dashboard
        </h2>
        {user && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Role: {user.role}
          </p>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {filteredNavigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive
                        ? "text-indigo-500 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 mt-auto border-t dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; 2025 Admin Dashboard
        </p>
      </div>
    </div>
  );
}
