import { useContext } from "react";
import { DojoContext } from "../context/DojoContext";

export const useConfigStore = () => {
  const value = useContext(DojoContext);
  if (!value) {
    throw new Error("useConfigStore must be used within a DojoProvider");
  }
  return value.configStore;
};
