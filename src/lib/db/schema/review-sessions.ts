import { pgTable, text, timestamp, uuid, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users';

export const reviewSessions = pgTable(
  'review_sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    repoOwner: text('repo_owner').notNull(),
    repoName: text('repo_name').notNull(),
    prNumber: integer('pr_number').notNull(),
    prHeadSha: text('pr_head_sha').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    lastActiveAt: timestamp('last_active_at', { withTimezone: true }).notNull().defaultNow(),
    status: text('status').notNull().default('in_progress'),
    viewPreference: text('view_preference').notNull().default('unified'),
  },
  (t) => ({
    userPrUniq: uniqueIndex('review_sessions_user_pr').on(
      t.userId,
      t.repoOwner,
      t.repoName,
      t.prNumber,
    ),
  }),
);

export const insertReviewSessionSchema = createInsertSchema(reviewSessions);
export const selectReviewSessionSchema = createSelectSchema(reviewSessions);
export type ReviewSessionRow = typeof reviewSessions.$inferSelect;
export type NewReviewSessionRow = typeof reviewSessions.$inferInsert;
