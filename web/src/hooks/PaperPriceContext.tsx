import { createContext, useContext, ReactNode } from "react";

interface PaperPriceContextType {
  usdPerPaper: number | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const PaperPriceContext = createContext<PaperPriceContextType | null>(null);

export const PaperPriceProvider = ({ children }: { children: ReactNode }) => {
  // Offline mode - no price fetching needed
  return (
    <PaperPriceContext.Provider
      value={{
        usdPerPaper: null,
        isLoading: false,
        error: null,
        refetch: () => {},
      }}
    >
      {children}
    </PaperPriceContext.Provider>
  );
};

export const usePaperPrice = () => {
  const context = useContext(PaperPriceContext);
  if (!context) {
    throw new Error("usePaperPrice must be used within a PaperPriceProvider");
  }
  return context;
};
