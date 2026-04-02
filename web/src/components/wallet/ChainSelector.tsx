type ChainSelectorProps = {
  canChange: boolean;
  onChange?: VoidFunction;
};

export const ChainSelector = ({ canChange = false, onChange = () => {} }: ChainSelectorProps) => {
  // Offline mode - no chain selection
  return null;
};
