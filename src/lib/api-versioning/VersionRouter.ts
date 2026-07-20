import { NextRequest, NextResponse } from "next/server";
import { ApiVersionStatus, VersionConfig } from "./ApiVersion";
import { VersionResolver } from "./VersionResolver";
import { VersionMapperRegistry } from "./VersionMapper";

export interface VersionRouterConfig<TDomain> {
  mappers: VersionMapperRegistry<TDomain>;
  handler: (req: NextRequest, params: any, validatedPayload: any) => Promise<TDomain>;
}

export class VersionRouter {
  /**
   * Wraps a Next.js Route Handler to inject version resolution, request validation, and response mapping.
   */
  static wrap<TDomain>(config: VersionRouterConfig<TDomain>) {
    return async (req: NextRequest, { params }: { params: any }) => {
      try {
        // 1. Resolve API Version
        const version = VersionResolver.resolve(req);
        const mapper = config.mappers[version];

        if (!mapper) {
          return NextResponse.json(
            { error: `API Version ${version} is not implemented for this endpoint.` },
            { status: 501 }
          );
        }

        // 2. Extract Raw Payload (JSON body or Query Params)
        let rawPayload = {};
        if (req.method !== "GET" && req.method !== "DELETE") {
          try {
            rawPayload = await req.json();
          } catch (e) {
            // Ignore empty body
          }
        } else {
          rawPayload = Object.fromEntries(req.nextUrl.searchParams);
        }

        // 3. Version-Specific Request Validation
        const validatedPayload = mapper.validateRequest(rawPayload);

        // 4. Execute Version-Agnostic Domain Logic
        const domainModel = await config.handler(req, params, validatedPayload);

        // 5. Version-Specific Response Mapping
        const responsePayload = mapper.mapResponse(domainModel);

        // 6. Handle Deprecation Lifecycle
        const headers = new Headers();
        if (VersionConfig[version] === ApiVersionStatus.DEPRECATED) {
          headers.set("Deprecation", "true");
          headers.set("Warning", `299 - "API Version ${version} is deprecated."`);
        }

        return NextResponse.json(responsePayload, { headers });
      } catch (error: any) {
        if (error.message === "Missing or unsupported API version." || error.message.includes("retired")) {
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
        
        // Handle validation or domain errors
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 400 });
      }
    };
  }
}
