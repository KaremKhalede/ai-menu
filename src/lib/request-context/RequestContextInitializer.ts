import { RequestContext, RequestContextOptions } from "./RequestContext";

export class RequestContextInitializer {
  /**
   * Solely responsible for constructing and validating a new RequestContext.
   * This separates the concern of creation/validation from asynchronous propagation.
   */
  public static create(options: RequestContextOptions): RequestContext {
    // Perform any strict validations here
    if (!options.requestId) {
      throw new Error("A valid requestId is strictly required to initialize a RequestContext");
    }

    // Default missing properties if necessary, sanitize inputs, etc.
    const sanitizedOptions = {
      ...options,
      requestId: options.requestId.trim(),
    };

    return new RequestContext(sanitizedOptions);
  }
}
