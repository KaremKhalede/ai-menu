import { IdempotencyRecordModel, IdempotencyStatus } from "./IdempotencyTypes";

export interface IdempotencyProvider {
  /**
   * Attempts to atomically insert a new record.
   * If a record with the same key already exists, it must return the existing record instead of throwing an error.
   * If successful, it returns the newly created record and isNew: true.
   */
  insertIfNotExists(record: IdempotencyRecordModel): Promise<{ record: IdempotencyRecordModel, isNew: boolean }>;

  /**
   * Updates an existing record's status and conditionally stores the response snapshot.
   */
  update(idempotencyKey: string, status: IdempotencyStatus, responseSnapshot?: any): Promise<void>;

  /**
   * Explicitly deletes a record (typically used to purge expired keys).
   */
  delete(idempotencyKey: string): Promise<void>;
}
