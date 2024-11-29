import { createContext, useState, useContext, ReactNode } from "react";
import { IProfile } from "../interfaces";

// Define the type for the user object


// Define the type for the context
interface UserContextType {
  user: IProfile | null;
  setUser: (user: IProfile) => void;
}

// Create the context with an initial value of `undefined`
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the provider component
interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<IProfile | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };