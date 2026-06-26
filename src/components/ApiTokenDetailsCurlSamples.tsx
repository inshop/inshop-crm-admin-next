"use client";

import { useState } from "react";
import ApiTokenCurlSamples from "@/components/ApiTokenCurlSamples";
import {
  useApiTokensControllerFindOneQuery,
  useApiTokensControllerRegenerateMutation,
} from "@/lib/redux/features/apiTokens";

interface ApiTokenDetailsCurlSamplesProps {
  tokenId: number;
}

export default function ApiTokenDetailsCurlSamples({
  tokenId,
}: ApiTokenDetailsCurlSamplesProps) {
  const { data } = useApiTokensControllerFindOneQuery({ id: tokenId });
  const [regenerate, { isLoading: isRegenerating }] =
    useApiTokensControllerRegenerateMutation();
  const [regeneratedToken, setRegeneratedToken] = useState<string>();

  if (!data) return null;

  const token = data as {
    plainToken?: string;
    tokenPrefix?: string;
    environment?: { code?: string };
  };

  const plainToken = regeneratedToken;

  const handleRegenerate = async () => {
    const result = await regenerate({ id: tokenId }).unwrap();
    if (
      result &&
      typeof result === "object" &&
      "plainToken" in result &&
      typeof result.plainToken === "string"
    ) {
      setRegeneratedToken(result.plainToken);
    }
  };

  return (
    <ApiTokenCurlSamples
      plainToken={plainToken}
      tokenPrefix={token.tokenPrefix}
      environmentCode={token.environment?.code ?? "ENVIRONMENT_CODE"}
      onRegenerate={plainToken ? undefined : handleRegenerate}
      isRegenerating={isRegenerating}
    />
  );
}
