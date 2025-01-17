import { mysqlTable, int, varchar, text, decimal, timestamp, date } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const campaigns = mysqlTable('campaigns', {
  id: int('id').primaryKey().autoincrement().notNull(),
  user_id: int('user_id').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  goal_amount: decimal('goal_amount', { precision: 10, scale: 2 }).notNull(),
  current_amount: decimal('current_amount', { precision: 10, scale: 2 }).default('0.00'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow().onUpdateNow(),
  category: varchar('category', { length: 255 }),
  image_url: varchar('image_url', { length: 255 }),
  campaign_deadline: date('campaign_deadline'),
});

