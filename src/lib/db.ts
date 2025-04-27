import {
  mockCreateItem,
  mockGetItemById,
  mockUpdateItem,
  mockDeleteItem,
  mockGetItems,
} from "./mockDb";

// Generic interface for database items
export interface DBItem {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
}

// User interface
export interface User extends DBItem {
  email: string;
  displayName?: string;
  photoURL?: string;
  role: "admin" | "user";
}

// Product interface
export interface Product extends DBItem {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
  inStock: boolean;
}

// Create item
export const createItem = async <T extends DBItem>(
  collectionName: string,
  data: T
): Promise<T> => {
  return mockCreateItem(collectionName, data);
};

// Get item by ID
export const getItemById = async <T extends DBItem>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  return mockGetItemById(collectionName, id);
};

// Update item
export const updateItem = async <T extends DBItem>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  return mockUpdateItem(collectionName, id, data);
};

// Delete item
export const deleteItem = async (
  collectionName: string,
  id: string
): Promise<void> => {
  return mockDeleteItem(collectionName, id);
};

// Get all items from a collection with pagination
export const getItems = async <T extends DBItem>(
  collectionName: string,
  options?: {
    pageSize?: number;
    lastDoc?: any;
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    filters?: Array<{ field: string; op: string; value: any }>;
  }
): Promise<{ items: T[]; lastDoc: any | null }> => {
  const { items, hasMore } = await mockGetItems<T>(collectionName, {
    pageSize: options?.pageSize,
    page: options?.lastDoc || 1,
    orderByField: options?.orderByField,
    orderDirection: options?.orderDirection,
    filters: options?.filters,
  });

  // If using lastDoc for pagination, increment the page
  const lastDoc = options?.lastDoc
    ? (options.lastDoc as number) + 1
    : hasMore
    ? 2
    : null;

  return { items, lastDoc };
};

// Mock file upload
export const uploadFile = async (path: string, file: File): Promise<string> => {
  // Simulate file upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return a mock URL using URL.createObjectURL if available,
  // or a placeholder if not
  if (typeof URL !== "undefined" && URL.createObjectURL) {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error creating object URL:", error);
    }
  }

  return `https://picsum.photos/seed/${Date.now()}/200/200`;
};

// Mock file delete
export const deleteFile = async (path: string): Promise<void> => {
  // Simulate file deletion delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Nothing needed for mock, just log
  console.log("Mock deleted file at:", path);
};
