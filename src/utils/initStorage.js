
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_GROUPS,
  INITIAL_ASSIGNMENTS,
} from "../data/initialData";

const STORAGE_KEYS = {
  users: "joineazy_users",
  courses: "joineazy_courses",
  groups: "joineazy_groups",
  assignments: "joineazy_assignments",
};

const readStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return null;
  }
};

const writeStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initializeStorage = () => {
  try {
    const defaults = {
      [STORAGE_KEYS.users]: INITIAL_USERS,
      [STORAGE_KEYS.courses]: INITIAL_COURSES,
      [STORAGE_KEYS.groups]: INITIAL_GROUPS,
      [STORAGE_KEYS.assignments]: INITIAL_ASSIGNMENTS,
    };

    Object.entries(defaults).forEach(([key, initialData]) => {
      const existing = readStorage(key);

      if (!Array.isArray(existing)) {
        writeStorage(key, initialData);
      }
    });

    return true;
  } catch (error) {
    console.error("Storage initialization failed:", error);
    return false;
  }
};

export const clearApplicationStorage = () => {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
};

export const getStorageKeys = () => ({ ...STORAGE_KEYS });
