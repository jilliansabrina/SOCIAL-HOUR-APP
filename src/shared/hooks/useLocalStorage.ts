import { useEffect, useState } from "react";

export function forceLoadUsername() {
  try {
    const data = window.localStorage.getItem("username");
    if (!data) {
      return null;
    }
    return JSON.parse(data) as string;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function useLocalStorage<E>(
  key: string,
  initialValue: E
): [E | null, (value: E) => void] {
  const [state, setState] = useState<E | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      setState(item ? JSON.parse(item) : initialValue);
    } catch (error) {
      console.error(error);
    }
  });

  const setValue = (value: E) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      setState(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [state, setValue];
}

export function useUsername() {
  const [username, setUsername] = useLocalStorage<string | null>(
    "username",
    null
  );
  const signOut = () => {
    setUsername(null);
    try {
      window.localStorage.removeItem("username");
    } catch (error) {
      console.error(error);
    }
  };
  return [username, setUsername, signOut];
}
