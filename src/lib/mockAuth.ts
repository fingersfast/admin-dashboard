import { UserData } from "./auth";

// Mock user storage
let users: UserData[] = [
  {
    uid: "admin123",
    email: "admin@example.com",
    displayName: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    uid: "user456",
    email: "user@example.com",
    displayName: "Regular User",
    role: "user",
    createdAt: new Date().toISOString(),
  },
];

// Current user session
let currentUser: UserData | null = null;

// Cookie management for session
export const setSessionCookie = (userData: UserData) => {
  if (typeof window !== "undefined") {
    document.cookie = `session=${btoa(
      JSON.stringify({ uid: userData.uid })
    )}; path=/; max-age=86400`;
  }
};

export const getSessionCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const sessionCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("session=")
  );

  if (!sessionCookie) return null;

  return sessionCookie.split("=")[1].trim();
};

export const clearSessionCookie = () => {
  if (typeof window !== "undefined") {
    document.cookie = "session=; path=/; max-age=0";
  }
};

// Mock auth functions
export const mockCreateUser = async (
  email: string,
  password: string,
  name: string
): Promise<UserData> => {
  // Check if user already exists
  if (users.some((user) => user.email === email)) {
    throw new Error("User with this email already exists.");
  }

  // Create new user
  const newUser: UserData = {
    uid: `user_${Date.now()}`,
    email,
    displayName: name,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  // Store locally
  users.push(newUser);
  localStorage.setItem("mockUsers", JSON.stringify(users));

  // Set current user
  currentUser = newUser;

  // Set cookie
  setSessionCookie(newUser);

  return newUser;
};

export const mockLoginUser = async (email: string, password: string) => {
  // In a real app, you would verify the password

  // Find user
  const user = users.find((user) => user.email === email);

  if (!user) {
    throw new Error("User not found.");
  }

  // Set current user
  currentUser = user;

  // Set cookie
  setSessionCookie(user);

  return { user };
};

export const mockLogoutUser = async () => {
  currentUser = null;
  clearSessionCookie();
};

export const mockGetCurrentUser = (): Promise<UserData | null> => {
  return new Promise((resolve) => {
    // If we have current user in memory
    if (currentUser) {
      resolve(currentUser);
      return;
    }

    // Try to get from cookie
    const session = getSessionCookie();
    if (session) {
      try {
        const { uid } = JSON.parse(atob(session));
        const user = users.find((user) => user.uid === uid);
        if (user) {
          currentUser = user;
          resolve(user);
          return;
        }
      } catch (error) {
        console.error("Error parsing session:", error);
      }
    }

    resolve(null);
  });
};

export const mockGetUserData = async (
  userId: string
): Promise<UserData | null> => {
  const user = users.find((user) => user.uid === userId);
  return user || null;
};

// Initialize mock users from localStorage (if any)
if (typeof window !== "undefined") {
  const storedUsers = localStorage.getItem("mockUsers");
  if (storedUsers) {
    try {
      users = JSON.parse(storedUsers);
    } catch (error) {
      console.error("Error parsing stored users:", error);
    }
  } else {
    // Store initial users
    localStorage.setItem("mockUsers", JSON.stringify(users));
  }
}
