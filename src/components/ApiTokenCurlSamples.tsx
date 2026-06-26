"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { buildApiTokenCurlExamples } from "@/lib/api-token-curl-examples";

interface ApiTokenCurlSamplesProps {
  environmentCode: string;
  plainToken?: string;
  tokenPrefix?: string;
  showTokenWarning?: boolean;
  onRegenerate?: () => void | Promise<void>;
  isRegenerating?: boolean;
}

export default function ApiTokenCurlSamples({
  environmentCode,
  plainToken,
  tokenPrefix,
  showTokenWarning = false,
  onRegenerate,
  isRegenerating = false,
}: ApiTokenCurlSamplesProps) {
  const hasRealToken = !!plainToken;
  const curlExamples = buildApiTokenCurlExamples(
    plainToken ?? "<YOUR_TOKEN>",
    environmentCode,
  );

  return (
    <Alert severity={showTokenWarning ? "warning" : "info"} sx={{ mb: 2 }}>
      {showTokenWarning ? (
        <>
          Copy this token now. You will not be able to view it again.
          <Box
            component="code"
            sx={{
              display: "block",
              mt: 1,
              p: 1,
              bgcolor: "action.hover",
              borderRadius: 1,
              wordBreak: "break-all",
            }}
          >
            {plainToken}
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              if (plainToken) {
                void navigator.clipboard.writeText(plainToken);
              }
            }}
          >
            Copy token
          </Button>
        </>
      ) : hasRealToken ? (
        <>
          <Typography variant="body2" sx={{ mb: 1 }}>
            API token
          </Typography>
          <Box
            component="code"
            sx={{
              display: "block",
              p: 1,
              bgcolor: "action.hover",
              borderRadius: 1,
              wordBreak: "break-all",
            }}
          >
            {plainToken}
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              void navigator.clipboard.writeText(plainToken);
            }}
          >
            Copy token
          </Button>
        </>
      ) : (
        <>
          {tokenPrefix && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Token prefix:{" "}
              <Box component="code">{tokenPrefix}</Box>
            </Typography>
          )}
          <Typography variant="body2" sx={{ mb: 1 }}>
            The full token secret is not stored. Regenerate to get a new token
            and curl examples.
          </Typography>
          {onRegenerate && (
            <Button
              variant="contained"
              size="small"
              disabled={isRegenerating}
              onClick={() => {
                void onRegenerate();
              }}
            >
              {isRegenerating ? "Regenerating…" : "Regenerate token"}
            </Button>
          )}
        </>
      )}

      {(hasRealToken || !showTokenWarning) && (
        <>
          <Typography
            variant="subtitle2"
            sx={{ mt: showTokenWarning || hasRealToken ? 2 : 1, mb: 0.5 }}
          >
            Example usage
            {!hasRealToken && !showTokenWarning ? " (replace <YOUR_TOKEN>)" : ""}
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1,
              bgcolor: "action.hover",
              borderRadius: 1,
              overflow: "auto",
              fontSize: "0.75rem",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {curlExamples}
          </Box>
          <Button
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
            onClick={() => {
              void navigator.clipboard.writeText(curlExamples);
            }}
          >
            Copy curl examples
          </Button>
        </>
      )}
    </Alert>
  );
}
