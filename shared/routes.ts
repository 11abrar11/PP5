/**
 * API Route Definitions
 * - Centralizes all backend endpoints to ensure consistency between frontend and backend
 * - Uses Zod for type-safe API requests and responses
 */
import { z } from 'zod';
import { insertInquirySchema, services, caseStudies } from './schema';

/**
 * Standard Error response schemas
 */
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

/**
 * API Metadata
 * Defines the method, path, input, and expected responses for every endpoint.
 */
export const api = {
  // Endpoints for retrieving dynamic Service cards
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services' as const,
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
  },
  // Endpoints for retrieving portfolio Case Studies
  caseStudies: {
    list: {
      method: 'GET' as const,
      path: '/api/case-studies' as const,
      responses: {
        200: z.array(z.custom<typeof caseStudies.$inferSelect>()),
      },
    },
  },
  // Endpoints for submitting Lead Inquiries
  inquiries: {
    create: {
      method: 'POST' as const,
      path: '/api/inquiries' as const,
      input: insertInquirySchema,
      responses: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation, // Bad request (e.g., invalid email)
      },
    },
  },
};

/**
 * URL Builder Utility
 * Injects parameters into URL paths (e.g., /api/user/:id -> /api/user/123)
 */
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
