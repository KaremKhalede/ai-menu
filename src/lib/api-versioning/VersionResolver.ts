import { NextRequest } from "next/server";
import { ApiVersion, VersionFallbackPolicy, VersionSettings, VersionConfig, ApiVersionStatus } from "./ApiVersion";

export class VersionResolver {
  /**
   * Deterministically resolves the requested API version from URL or Header.
   */
  static resolve(req: NextRequest): ApiVersion {
    // 1. Check Header (Highest Priority)
    const headerVersion = req.headers.get("x-api-version");
    if (headerVersion && this.isValidVersion(headerVersion)) {
      return this.handleLifecycle(headerVersion as ApiVersion);
    }

    // 2. Check URL Path (e.g. /api/v1/...)
    const urlParts = req.nextUrl.pathname.split("/");
    const pathVersion = urlParts.find((part) => this.isValidVersion(part));
    
    if (pathVersion) {
      return this.handleLifecycle(pathVersion as ApiVersion);
    }

    // 3. Fallback Policy Execution
    if (VersionSettings.fallbackPolicy === VersionFallbackPolicy.STRICT) {
      throw new Error("Missing or unsupported API version.");
    }

    // Default policy
    return VersionSettings.defaultVersion;
  }

  private static isValidVersion(v: string): boolean {
    return Object.values(ApiVersion).includes(v as ApiVersion);
  }

  private static handleLifecycle(version: ApiVersion): ApiVersion {
    const status = VersionConfig[version];
    if (status === ApiVersionStatus.RETIRED) {
      throw new Error(`API Version ${version} is retired and no longer supported.`);
    }
    return version;
  }
}
