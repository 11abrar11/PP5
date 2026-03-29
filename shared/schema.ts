/**
 * Shared Database Schema Definitions
 * - Uses Drizzle ORM for PostgreSQL table definitions
 * - Defines validation schemas with Zod
 * - Exports TypeScript types for use in frontend and backend
 */
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS (The "Blueprints" for PostgreSQL) ===

/**
 * Services Table
 * Stores the content for the 6 core service cards on the Services page.
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // Stores the string name of a Lucide icon (e.g., "Palette")
  category: text("category"), // Optional category for grouping (e.g., "Design", "Digital")
});

/**
 * Case Studies Table
 * Stores the content for the portfolio gallery and project detail pages.
 */
export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  client: text("client").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  solution: text("solution"), // Paragraph explaining the work done
  impact: text("impact"),     // Paragraph explaining the results achieved
  imageUrl: text("image_url"), // Path to the project thumbnail/banner
});

/**
 * Contact Inquiries Table
 * Logs every lead submitted through the Contact Us form.
 */
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === ZOD SCHEMAS (Data Validation & Transformation) ===

// Schema for valid service insertion (ID is auto-generated)
export const insertServiceSchema = createInsertSchema(services).omit({ id: true });

// Schema for valid case study insertion (ID is auto-generated)
export const insertCaseStudySchema = createInsertSchema(caseStudies).omit({ id: true });

/**
 * Inquiry Validation Schema
 * This is used to validate the contact form input on BOTH the frontend and backend.
 */
export const insertInquirySchema = createInsertSchema(inquiries, {
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
}).omit({ id: true, createdAt: true });

// === TYPES (TypeScript intellisense for developers) ===

// Static types for selecting from the database
export type Service = typeof services.$inferSelect;
export type CaseStudy = typeof caseStudies.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;

// Static types for inserting into the database
export type InsertService = z.infer<typeof insertServiceSchema>;
export type InsertCaseStudy = z.infer<typeof insertCaseStudySchema>;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
