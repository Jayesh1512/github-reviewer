import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { reviewSessions } from './review-sessions';

export const localNotes = pgTable('local_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => reviewSessions.id, { onDelete: 'cascade' }),
  filePath: text('file_path'),
  lineNumber: integer('line_number'),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertLocalNoteSchema = createInsertSchema(localNotes);
export const selectLocalNoteSchema = createSelectSchema(localNotes);
export type LocalNoteRow = typeof localNotes.$inferSelect;
export type NewLocalNoteRow = typeof localNotes.$inferInsert;
