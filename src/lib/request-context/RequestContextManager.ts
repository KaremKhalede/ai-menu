import { RequestContext } from "./RequestContext";
import { RequestContextProvider } from "./RequestContextProvider";
import { AsyncLocalRequestContextProvider } from "./AsyncLocalRequestContextProvider";

export class RequestContextMissingError extends Error {
  constructor() {
    super("Request context is missing. Ensure the execution is properly initialized via RequestContextProvider.");
    this.name = "RequestContextMissingError";
  }
}

export class RequestContextManager {
  private static provider: RequestContextProvider = new AsyncLocalRequestContextProvider();

  public static setProvider(provider: RequestContextProvider) {
    this.provider = provider;
  }

  /**
   * Retrieves the active request context.
   * Throws a deterministic RequestContextMissingError if absent, ensuring fail-fast behavior.
   * This guarantees that business services never execute with undefined metadata.
   */
  public static get(): RequestContext {
    const context = this.provider.get();
    if (!context) {
      throw new RequestContextMissingError();
    }
    return context;
  }

  /**
   * Safely checks if a context is currently active without throwing an error.
   */
  public static has(): boolean {
    return this.provider.get() !== undefined;
  }

  /**
   * Delegates execution to the provider to bind the context to the asynchronous call stack.
   * Business controllers and middlewares call this method.
   */
  public static run<T>(context: RequestContext, callback: () => Promise<T> | T): Promise<T> | T {
    return this.provider.run(context, callback);
  }
}
