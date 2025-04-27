import {
  mockCreateUser,
  mockLoginUser,
  mockLogoutUser,
  mockGetCurrentUser,
  mockGetUserData,
} from "./mockAuth";

export interface UserData {
  uid: string;
  email: string | null;
  displayName?: string;
  photoURL?: string;
  role: "admin" | "user";
  createdAt: any;
}

export const createUser = async (
  email: string,
  password: string,
  name: string
): Promise<UserData> => {
  try {
    return await mockCreateUser(email, password, name);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    return await mockLoginUser(email, password);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    return await mockLogoutUser();
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUser = () => {
  return mockGetCurrentUser();
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    return await mockGetUserData(userId);
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};
