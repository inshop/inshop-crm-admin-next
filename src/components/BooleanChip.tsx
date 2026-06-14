import Chip from "@mui/material/Chip";

interface BooleanChipProps {
  value: boolean;
}

export function BooleanChip({ value }: BooleanChipProps) {
  return (
    <Chip
      size="small"
      label={value ? "Yes" : "No"}
      color={value ? "success" : "error"}
      variant="filled"
    />
  );
}
