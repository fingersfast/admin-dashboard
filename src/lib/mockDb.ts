import { User, Product, DBItem } from "./db";
import { generateId } from "./utils";

// Mock database collections
type Collections = {
  users: User[];
  products: Product[];
  [key: string]: DBItem[];
};

// Initialize collections with sample data
let db: Collections = {
  users: [
    {
      id: "admin123",
      email: "admin@example.com",
      displayName: "Admin User",
      role: "admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user456",
      email: "user@example.com",
      displayName: "Regular User",
      role: "user",
      createdAt: new Date().toISOString(),
    },
  ],
  products: Array.from({ length: 10 }, (_, i) => ({
    id: `product_${i + 1}`,
    name: `Product ${i + 1}`,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    price: Math.floor(Math.random() * 10000) / 100,
    imageUrl: `https://picsum.photos/seed/product${i + 1}/200/200`,
    category: ["Electronics", "Clothing", "Home", "Books", "Food"][
      Math.floor(Math.random() * 5)
    ],
    inStock: Math.random() > 0.2,
    createdAt: new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
    ).toISOString(),
  })),
};

// Load data from localStorage if available
const loadFromStorage = () => {
  if (typeof window !== "undefined") {
    Object.keys(db).forEach((collection) => {
      const storedData = localStorage.getItem(`mock_${collection}`);
      if (storedData) {
        try {
          db[collection] = JSON.parse(storedData);
        } catch (error) {
          console.error(`Error parsing stored ${collection}:`, error);
        }
      } else {
        localStorage.setItem(
          `mock_${collection}`,
          JSON.stringify(db[collection])
        );
      }
    });
  }
};

// Save data to localStorage
const saveToStorage = (collection: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`mock_${collection}`, JSON.stringify(db[collection]));
  }
};

// Create item
export const mockCreateItem = async <T extends DBItem>(
  collectionName: string,
  data: T
): Promise<T> => {
  const now = new Date().toISOString();
  const newItem = {
    ...data,
    id: data.id || generateId(),
    createdAt: now,
    updatedAt: now,
  };

  if (!db[collectionName]) {
    db[collectionName] = [];
  }

  db[collectionName].push(newItem as any);
  saveToStorage(collectionName);

  return newItem as T;
};

// Get item by ID
export const mockGetItemById = async <T extends DBItem>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  if (!db[collectionName]) {
    return null;
  }

  const item = db[collectionName].find((item) => item.id === id);
  return item ? (item as T) : null;
};

// Update item
export const mockUpdateItem = async <T extends DBItem>(
  collectionName: string,
  id: string,
  data: Partial<T>
): Promise<void> => {
  if (!db[collectionName]) {
    throw new Error(`Collection ${collectionName} does not exist`);
  }

  const index = db[collectionName].findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Item with ID ${id} not found in ${collectionName}`);
  }

  db[collectionName][index] = {
    ...db[collectionName][index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  saveToStorage(collectionName);
};

// Delete item
export const mockDeleteItem = async (
  collectionName: string,
  id: string
): Promise<void> => {
  if (!db[collectionName]) {
    throw new Error(`Collection ${collectionName} does not exist`);
  }

  const index = db[collectionName].findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`Item with ID ${id} not found in ${collectionName}`);
  }

  db[collectionName].splice(index, 1);
  saveToStorage(collectionName);
};

// Get items with pagination and filtering
export const mockGetItems = async <T extends DBItem>(
  collectionName: string,
  options?: {
    pageSize?: number;
    page?: number;
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    filters?: Array<{ field: string; op: string; value: any }>;
  }
): Promise<{ items: T[]; hasMore: boolean; totalItems: number }> => {
  if (!db[collectionName]) {
    return { items: [], hasMore: false, totalItems: 0 };
  }

  let items = [...db[collectionName]];
  const pageSize = options?.pageSize || 10;
  const page = options?.page || 1;

  // Apply filters
  if (options?.filters && options.filters.length > 0) {
    items = items.filter((item) => {
      return options.filters!.every((filter) => {
        const fieldValue = (item as any)[filter.field];

        switch (filter.op) {
          case "==":
            return fieldValue === filter.value;
          case "!=":
            return fieldValue !== filter.value;
          case ">":
            return fieldValue > filter.value;
          case ">=":
            return fieldValue >= filter.value;
          case "<":
            return fieldValue < filter.value;
          case "<=":
            return fieldValue <= filter.value;
          case "contains":
            return String(fieldValue)
              .toLowerCase()
              .includes(String(filter.value).toLowerCase());
          default:
            return true;
        }
      });
    });
  }

  // Apply sorting
  if (options?.orderByField) {
    const orderDirection = options.orderDirection === "asc" ? 1 : -1;
    items.sort((a, b) => {
      const aValue = (a as any)[options.orderByField!];
      const bValue = (b as any)[options.orderByField!];

      if (aValue < bValue) return -1 * orderDirection;
      if (aValue > bValue) return 1 * orderDirection;
      return 0;
    });
  }

  const totalItems = items.length;

  // Apply pagination
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems as T[],
    hasMore: endIndex < items.length,
    totalItems,
  };
};

// Initialize storage
loadFromStorage();
