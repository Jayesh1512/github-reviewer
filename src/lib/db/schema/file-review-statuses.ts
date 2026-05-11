import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { reviewSessions } from './review-sessions';

export const fileReviewStatuses = pgTable('file_review_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => reviewSessions.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(),
  status: text('status').notNull().default('not_started'),
  collapsedHunks: jsonb('collapsed_hunks').$type<number[]>().notNull().default([]),
  reviewedRanges: jsonb('reviewed_ranges')
    .$type<{ startLine: number; endLine: number }[]>()
    .notNull()
    .default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertFileReviewStatusSchema = createInsertSchema(fileReviewStatuses);
export const selectFileReviewStatusSchema = createSelectSchema(fileReviewStatuses);
export type FileReviewStatusRow = typeof fileReviewStatuses.$inferSelect;
export type NewFileReviewStatusRow = typeof fileReviewStatuses.$inferInsert;
