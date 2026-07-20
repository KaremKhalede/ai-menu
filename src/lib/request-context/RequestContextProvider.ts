import { RequestContext } from "./RequestContext";

export interface RequestContextProvider {
  /**
   * Retrieves the current request context from the asynchronous execution boundary.
   * Returns undefined if called outside a context.
   */
  get(): RequestContext | undefined;

  /**
   * Binds the provided RequestContext to the current asynchronous execution boundary.
   * The context is automatically cleaned up when the callback completes.
   */
  run<T>(context: RequestContext, callback: () => Promise<T> | T): Promise<T> | T;
}
