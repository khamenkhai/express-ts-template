import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { int, mysqlTable, serial, varchar, text, timestamp } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role : varchar({ length: 255 }).notNull(),
});

export type User = InferSelectModel<typeof usersTable>;

export type NewUser = InferInsertModel<typeof usersTable>;

export const postsTable = mysqlTable('posts_table', {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  content: text().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});