import { pgTable, serial, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

// Gym Table
export const gyms = pgTable('gyms', {
    gymId: serial('gym_id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    location: varchar('location', { length: 255 }),
    createdDate: timestamp('created_date').notNull(),
});

export const users = pgTable('users', {
    userId: serial('user_id').primaryKey(),
    displayName: text('display_name').notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: text('password'),
    joinedDate: timestamp('joined_date').notNull(),
    authBy: varchar('authBy', { length: 255 }),
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