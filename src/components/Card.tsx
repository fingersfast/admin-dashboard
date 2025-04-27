import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export default function Card({
  title,
  children,
  className,
  footer,
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg",
        className
      )}
    >
      {title && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">{children}</div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
          {footer}
        </div>
      )}
    </div>
  );
}

export function StatCard({
  title,
  value,
  icon,
  change,
  className,
}: {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: { value: number; isPositive: boolean };
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon && (
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
                {icon}
              </div>
            )}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </dt>
            <dd className="flex items-baseline">
              <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                {value}
              </div>

              {change && (
                <div
                  className={cn(
                    "ml-2 flex items-baseline text-sm font-semibold",
                    change.isPositive
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  )}
                >
                  <span>
                    {change.isPositive ? "↑" : "↓"} {Math.abs(change.value)}%
                  </span>
                </div>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}
