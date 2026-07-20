import { ApiVersion } from "./ApiVersion";

/**
 * Isolates version-specific request validation and response mapping.
 * Different API versions can accept different schemas and return different shapes,
 * while mapping to/from the exact same domain models.
 */
export interface VersionMapper<TDomain = any, TRequest = any, TResponse = any> {
  /**
   * Validates the raw request payload (JSON or Query Params) against the version's schema.
   * Throws a validation error if invalid.
   * Returns the version-agnostic domain request object.
   */
  validateRequest(rawPayload: any): TRequest;

  /**
   * Maps the raw internal domain model into the version-specific JSON response shape.
   */
  mapResponse(domainModel: TDomain): TResponse;
}

/**
 * A registry linking API versions to their specific mappers for a given route.
 */
export type VersionMapperRegistry<TDomain = any> = Partial<Record<ApiVersion, VersionMapper<TDomain, any, any>>>;
