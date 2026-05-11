import { pgTable, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { aiConversations } from './ai-conversations';

export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  selectedLines: jsonb('selected_lines').$type<{ startLine: number; endLine: number } | null>(),
  model: text('model').notNull(),
  tokensUsed: integer('tokens_used'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const insertAiMessageSchema = createInsertSchema(aiMessages);
export const selectAiMessageSchema = createSelectSchema(aiMessages);
export type AiMessageRow = typeof aiMessages.$inferSelect;
export type NewAiMessageRow = typeof aiMessages.$inferInsert;
