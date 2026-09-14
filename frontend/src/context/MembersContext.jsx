import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getAllUsersService } from "../services/TeamService";

const MembersContext = createContext(null);

export function MembersProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState(null);

  const fetchAllUsers = async () => {
    try {
      setMembersLoading(true);
      setMembersError(null);

      const response = await getAllUsersService();

      if (!response.success) {
        throw new Error(
          response.message || "Failed to fetch users"
        );
      }

      const availableMembers = (
        response.data?.users || []
      ).filter((user) => user.role !== "ADMIN");

      setMembers(availableMembers);
    } catch (err) {
      setMembersError(
        err instanceof Error
          ? err.message
          : "Failed to fetch users"
      );
    } finally {
      setMembersLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <MembersContext.Provider
      value={{
        members,
        setMembers,
        fetchAllUsers,
        membersLoading,
        membersError,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers() {
  const context = useContext(MembersContext);

  if (!context) {
    throw new Error(
      "useMembers must be used inside MembersProvider"
    );
  }

  return context;
}