/**
 * Utilities for exporting data from the dashboard
 */

// Convert array of objects to CSV string
export const objectsToCSV = (data: any[]): string => {
  if (data.length === 0) return "";

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV header row
  const csvRows = [headers.join(",")];

  // Add data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      // Handle various data types properly
      if (val === null || val === undefined) return "";
      if (typeof val === "string") {
        // Escape quotes and wrap in quotes if contains comma or quote
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }
      if (typeof val === "object") {
        if (val instanceof Date) {
          return val.toISOString();
        }
        return JSON.stringify(val).replace(/"/g, '""');
      }
      return val;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
};

// Download data as CSV file
export const downloadCSV = (data: any[], filename: string): void => {
  const csvString = objectsToCSV(data);
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

  // Create download link
  const link = document.createElement("a");
  if (link.download !== undefined) {
    // Feature detection for browsers
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// Prepare users data for export (removes sensitive fields)
export const prepareUsersForExport = (users: any[]): any[] => {
  return users.map((user) => ({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    role: user.role,
    createdAt: user.createdAt,
    // Exclude password or sensitive fields
  }));
};

// Prepare products data for export
export const prepareProductsForExport = (products: any[]): any[] => {
  return products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    inStock: product.inStock ? "Yes" : "No",
    createdAt: product.createdAt,
  }));
};
