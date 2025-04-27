import Link from "next/link";
import { ShieldExclamationIcon } from "@heroicons/react/24/outline";

export default function Unauthorized() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center py-12">
      <div className="mx-auto max-w-md text-center">
        <ShieldExclamationIcon className="h-20 w-20 mx-auto text-red-600 dark:text-red-400" />
        <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You don't have permission to access this page.
        </p>
        <div className="mt-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
