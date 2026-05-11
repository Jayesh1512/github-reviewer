import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { reviewSessions } from './review-sessions';

export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => reviewSessions.id, { onDelete: 'cascade' }),
  filePath: text('file_path').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiConversationSchema = createInsertSchema(aiConversations);
export const selectAiConversationSchema = createSelectSchema(aiConversations);
export type AiConversationRow = typeof aiConversations.$inferSelect;
export type NewAiConversationRow = typeof aiConversations.$inferInsert;
