export enum ApiVersion {
  V1 = "v1",
  V2 = "v2",
}

export enum ApiVersionStatus {
  ACTIVE = "ACTIVE",
  DEPRECATED = "DEPRECATED",
  RETIRED = "RETIRED",
}

export const VersionConfig = {
  [ApiVersion.V1]: ApiVersionStatus.DEPRECATED,
  [ApiVersion.V2]: ApiVersionStatus.ACTIVE,
};

export enum VersionFallbackPolicy {
  STRICT = "STRICT",     // Throws error if missing or unsupported
  DEFAULT = "DEFAULT",   // Defaults to the configured stable version
}

export const VersionSettings = {
  fallbackPolicy: VersionFallbackPolicy.DEFAULT,
  defaultVersion: ApiVersion.V2,
};
