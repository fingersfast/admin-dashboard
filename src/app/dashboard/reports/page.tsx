"use client";

import { useState, useEffect } from "react";
import Card from "@/components/Card";
import { generateMockData } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useAuthorization } from "@/lib/useAuthorization";

// Generate mock data for charts
const generateMonthlyData = () => {
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
    revenue: Math.floor(Math.random() * 10000) + 5000,
  }));
};

const generateCategoryData = () => {
  const categories = ["Electronics", "Clothing", "Home", "Books", "Food"];
  return categories.map((category) => ({
    name: category,
    value: Math.floor(Math.random() * 100) + 10,
  }));
};

const generateDailyData = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    name: day,
    visitors: Math.floor(Math.random() * 1000) + 500,
    conversions: Math.floor(Math.random() * 100) + 10,
  }));
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ReportsPage() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add authorization check - this page is accessible to both admin and user roles
  const { authorizeRoute, loading: authLoading } = useAuthorization();

  useEffect(() => {
    // Check if user is authorized to access this page
    authorizeRoute("/dashboard/reports");
  }, []);

  useEffect(() => {
    // Simulate data loading
    if (!authLoading) {
      const timer = setTimeout(() => {
        setMonthlyData(generateMonthlyData());
        setCategoryData(generateCategoryData());
        setDailyData(generateDailyData());
        setLoading(false);
      }, 800);

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

  // Calculate summary stats
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalUsers = monthlyData.reduce((sum, item) => sum + item.users, 0);
  const averageRevenue = totalRevenue / monthlyData.length;
  const totalConversions = dailyData.reduce(
    (sum, item) => sum + item.conversions,
    0
  );
  const conversionRate =
    (totalConversions /
      dailyData.reduce((sum, item) => sum + item.visitors, 0)) *
    100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of key metrics and performance indicators
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Total Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Total Users
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {totalUsers.toLocaleString()}
            </p>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Avg. Monthly Revenue
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(averageRevenue)}
            </p>
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
              Conversion Rate
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
              {conversionRate.toFixed(2)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Revenue" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                fill="#4f46e5"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly User Growth" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyData}
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
                stroke="#10b981"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Daily Visitor Activity" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="visitors" fill="#4f46e5" />
              <Bar dataKey="conversions" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Product Categories" className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
