import { AsyncLocalStorage } from "async_hooks";
import { RequestContext } from "./RequestContext";
import { RequestContextProvider } from "./RequestContextProvider";

export class AsyncLocalRequestContextProvider implements RequestContextProvider {
  private asyncLocalStorage = new AsyncLocalStorage<RequestContext>();

  get(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  run<T>(context: RequestContext, callback: () => Promise<T> | T): Promise<T> | T {
    // The AsyncLocalStorage boundary automatically cleans up the context 
    // the exact moment this callback resolves or rejects.
    return this.asyncLocalStorage.run(context, callback);
  }
}
