"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/Card";
import Card from "@/components/Card";
import { generateMockData } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import {
  UsersIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useAuthorization } from "@/lib/useAuthorization";

// Generate mock chart data
const generateActivityData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months.map((month) => ({
    name: month,
    users: Math.floor(Math.random() * 500) + 200,
    products: Math.floor(Math.random() * 100) + 10,
    revenue: Math.floor(Math.random() * 10000) + 5000,
  }));
};

// Generate mock user data
const generateUserActivity = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    name: day,
    newUsers: Math.floor(Math.random() * 50) + 5,
    activeUsers: Math.floor(Math.random() * 200) + 100,
  }));
};

export default function DashboardPage() {
  const [activityData, setActivityData] = useState<any[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add authorization check - dashboard is accessible to both admin and user roles
  const { authorizeRoute, loading: authLoading, user } = useAuthorization();

  useEffect(() => {
    // Check if user is authorized to access this page
    authorizeRoute("/dashboard");
  }, []);

  useEffect(() => {
    // Simulate data loading
    if (!authLoading) {
      const timer = setTimeout(() => {
        setActivityData(generateActivityData());
        setUserActivity(generateUserActivity());
        setLoading(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [authLoading]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Calculate totals for stat cards
  const totalUsers =
    activityData.reduce((sum, item) => sum + item.users, 0) /
    activityData.length;
  const totalProducts = activityData.reduce(
    (sum, item) => sum + item.products,
    0
  );
  const totalRevenue = activityData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const growthRate = Math.floor(Math.random() * 20) + 5;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome to your admin dashboard{" "}
          {user?.displayName ? `, ${user.displayName}` : ""}
        </p>
        {user && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You are logged in as:{" "}
            <span className="font-semibold">{user.role}</span>
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={Math.round(totalUsers)}
          icon={<UsersIcon className="h-6 w-6" />}
          change={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Products"
          value={totalProducts}
          icon={<ShoppingBagIcon className="h-6 w-6" />}
          change={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Growth"
          value={`${growthRate}%`}
          icon={<ArrowTrendingUpIcon className="h-6 w-6" />}
          change={{ value: 2, isPositive: true }}
        />
        <StatCard
          title="Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
          change={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Activity" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#4f46e5"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="products" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Weekly User Activity" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={userActivity}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="newUsers" fill="#4f46e5" />
              <Bar dataKey="activeUsers" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <Card title="Recent Activity">
        <div className="space-y-4">
          {generateMockData(5, () => ({
            id: Math.random().toString(36).substring(7),
            action: [
              "User signed up",
              "New order placed",
              "Product updated",
              "Comment added",
              "User upgraded plan",
            ][Math.floor(Math.random() * 5)],
            user: [
              "John Doe",
              "Jane Smith",
              "Robert Johnson",
              "Emily Davis",
              "Michael Wilson",
            ][Math.floor(Math.random() * 5)],
            time: `${Math.floor(Math.random() * 12) + 1} ${
              Math.random() > 0.5 ? "hours" : "minutes"
            } ago`,
          })).map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {activity.user.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.user}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
