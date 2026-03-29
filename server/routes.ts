/**
 * API Routes Module
 * - Registers all backend endpoints (Services, Case Studies, Inquiries)
 * - Handles file uploads via Multer
 * - Integrates with Email and Database storage
 */
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendEmail, buildInquiryEmail } from "./email";
import multer from "multer";

/**
 * Configure Multer for File Uploads
 * Files are kept in memory (RAM) and limited to 10MB to avoid server overload.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

/**
 * Validation Schema for Contact Form
 * Note: Multer parses FormData into strings, so we validate strings here.
 */
const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

/**
 * Main Route Registration Function
 */
export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  /**
   * 1. Data Seeding
   * Ensures the database has initial services and case studies on startup.
   */
  try {
    await storage.seedInitialData();
  } catch (error: any) {
    if (error.message?.includes("DATABASE_URL")) {
      console.warn("⚠️  Database not configured. Services page may show limited data.");
    } else {
      throw error;
    }
  }

  /**
   * 2. GET API: Services List
   * Fetches the dynamic list of service cards for the Services page.
   */
  app.get(api.services.list.path, async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error: any) {
      if (error.message?.includes("DATABASE_URL")) {
        return res.status(503).json({ message: "Database not configured." });
      }
      throw error;
    }
  });

  /**
   * 3. GET API: Case Studies List
   * Fetches the portfolio items for the Gallery page.
   */
  app.get(api.caseStudies.list.path, async (req, res) => {
    try {
      const studies = await storage.getCaseStudies();
      res.json(studies);
    } catch (error: any) {
      if (error.message?.includes("DATABASE_URL")) {
        return res.status(503).json({ message: "Database not configured." });
      }
      throw error;
    }
  });

  /**
   * 4. POST API: Contact Inquiry
   * Handles multi-part form submissions (text + optional file attachment).
   * Actions: Validates -> Saves to DB -> Sends Email Notification.
   */
  app.post(
    api.inquiries.create.path,
    upload.single("attachment"), // parses the file field named "attachment"
    async (req, res) => {
      try {
        // A. Validate the submitted text fields
        const parsed = inquiryFormSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            message: parsed.error.errors[0].message,
            field: parsed.error.errors[0].path.join("."),
          });
        }

        const { name, email, phone, company, projectType, message } = parsed.data;
        const file = req.file; // The uploaded file (if any) provided by Multer

        // B. Prepare the inquiry details for storage & email
        const subject = projectType
          ? `[${projectType}] Inquiry from ${name}`
          : `Inquiry from ${name}`;

        // Create a consolidated message string for the database log
        const dbMessage = [
          message,
          phone ? `Phone: ${phone}` : null,
          company ? `Company: ${company}` : null,
          projectType ? `Project Type: ${projectType}` : null,
          file ? `Attachment: ${file.originalname}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        // C. Storage Log (Save record of the lead)
        try {
          await storage.createInquiry({ name, email, subject, message: dbMessage });
        } catch (dbErr: any) {
          console.warn("⚠️  Could not save inquiry to DB:", dbErr.message);
        }

        // D. Email Notification
        // Generate the styled HTML and Text content
        const { html, text } = buildInquiryEmail({
          name,
          email,
          phone,
          company,
          projectType,
          message,
          hasAttachment: !!file,
          attachmentName: file?.originalname,
        });

        // Determine the professional 'from' address
        const senderAddress =
          process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@pp5mediasolutions.com";

        // Dispatch the email
        await sendEmail({
          from: `"PP5 Media Solutions" <${senderAddress}>`,
          to: "support@pp5mediasolutions.com",
          replyTo: email,
          subject,
          html,
          text,
          attachments: file
            ? [
              {
                filename: file.originalname,
                content: file.buffer,
                contentType: file.mimetype,
              },
            ]
            : [],
        });

        return res.status(201).json({ success: true, message: "Inquiry received and email sent." });
      } catch (err: any) {
        // Centralized error logging for the contact form
        console.error("❌ Contact form error detailed:", {
          message: err.message,
          stack: err.stack,
          code: err.code,
          command: err.command
        });
        return res.status(500).json({
          message: `Server Error: ${err.message}`,
        });
      }
    }
  );

  return httpServer;
}
