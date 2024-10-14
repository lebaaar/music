import { pgTable, serial, text, varchar, integer, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';

// Enums
export const providerEnum = pgEnum('provider', ['email', 'oauth', 'oauth_email']);

// Tables
export const users = pgTable('users', {
    userId: serial('user_id').primaryKey(),
    displayName: text('display_name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password'),
    joinedDate: timestamp('joined_date').notNull(),
    provider: providerEnum('provider').notNull(),
    googleId: varchar('google_id', { length: 255 }),
    gymId: integer('gym_id').references(() => gyms.gymId),
});

export const gyms = pgTable('gyms', {
    gymId: serial('gym_id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password').notNull(),
    location: varchar('location', { length: 255 }),
    joinedDate: timestamp('created_date').notNull(),
    isVerified: boolean('is_verified').notNull(),
});

export const songRequests = pgTable('song_requests', {
    songRequestId: serial('song_request_id').primaryKey(),
    userId: integer('user_id').references(() => users.userId),
    gymId: integer('gym_id').references(() => gyms.gymId),
    songTitle: varchar('song_title', { length: 255 }),
    artistName: varchar('artist_name', { length: 255 }),
    status: varchar('status', { length: 50 }),
    requestTimestamp: timestamp('request_timestamp'),
});

export const notifications = pgTable('notifications', {
    notificationId: serial('notification_id').primaryKey(),
    userId: integer('user_id').references(() => users.userId),
    gymId: integer('gym_id').references(() => gyms.gymId),
    title: varchar('title', { length: 255 }),
    description: varchar('description', { length: 255 }),
    time: timestamp('time')
});
