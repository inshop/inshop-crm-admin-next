import Chip from "@mui/material/Chip";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface BooleanChipProps {
  value: boolean;
}

export function BooleanChip({ value }: BooleanChipProps) {
  return (
    <Chip
      size="small"
      label={value ? "Yes" : "No"}
      icon={
        value ? (
          <CheckIcon style={{ fontSize: 12 }} />
        ) : (
          <CloseIcon style={{ fontSize: 12 }} />
        )
      }
      variant="outlined"
      sx={{
        fontWeight: 600,
        fontSize: "0.6875rem",
        height: 22,
        borderRadius: "6px",
        ...(value
          ? {
              color: "#16A34A",
              borderColor: "#BBF7D0",
              backgroundColor: "#F0FDF4",
              "& .MuiChip-icon": { color: "#16A34A" },
            }
          : {
              color: "#64748B",
              borderColor: "#E2E8F0",
              backgroundColor: "#F8FAFC",
              "& .MuiChip-icon": { color: "#94A3B8" },
            }),
      }}
    />
  );
}
