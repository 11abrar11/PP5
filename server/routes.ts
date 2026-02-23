import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { sendEmail, buildInquiryEmail } from "./email";
import multer from "multer";

// ─── Multer: in-memory storage (no disk writes) ───────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});

// ─── Validation schema for contact form (all fields come as strings from FormData) ──
const inquiryFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ── Seed initial data ───────────────────────────────────────────────────────
  try {
    await storage.seedInitialData();
  } catch (error: any) {
    if (error.message?.includes("DATABASE_URL")) {
      console.warn("⚠️  Database not configured. Services page may show limited data.");
    } else {
      throw error;
    }
  }

  // ── GET /api/services ──────────────────────────────────────────────────────
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

  // ── GET /api/case-studies ──────────────────────────────────────────────────
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

  // ── POST /api/inquiries  (multipart/form-data with optional file) ──────────
  app.post(
    api.inquiries.create.path,
    upload.single("attachment"), // parses the file field named "attachment"
    async (req, res) => {
      try {
        // 1. Validate form fields
        const parsed = inquiryFormSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            message: parsed.error.errors[0].message,
            field: parsed.error.errors[0].path.join("."),
          });
        }

        const { name, email, phone, company, projectType, message } = parsed.data;
        const file = req.file; // multer-provided file (Buffer in memory)

        // 2. Build subject & enriched message for DB storage
        const subject = projectType
          ? `[${projectType}] Inquiry from ${name}`
          : `Inquiry from ${name}`;

        const dbMessage = [
          message,
          phone ? `Phone: ${phone}` : null,
          company ? `Company: ${company}` : null,
          projectType ? `Project Type: ${projectType}` : null,
          file ? `Attachment: ${file.originalname}` : null,
        ]
          .filter(Boolean)
          .join("\n");

        // 3. Save to DB (best-effort — doesn't fail the response if DB is down)
        try {
          await storage.createInquiry({ name, email, subject, message: dbMessage });
        } catch (dbErr: any) {
          console.warn("⚠️  Could not save inquiry to DB:", dbErr.message);
        }

        // 4. Build email content
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

        const senderAddress =
          process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@pp5mediasolutions.com";

        // 5. Send email (with attachment if provided)
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
