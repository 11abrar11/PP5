/**
 * Storage Layer Module
 * - Defines the interface for data access
 * - Implements the DatabaseStorage class using Drizzle ORM
 * - Handles initial data seeding for a fresh environment
 */
import { db } from "./db";
import {
  services,
  caseStudies,
  inquiries,
  type InsertService,
  type InsertCaseStudy,
  type InsertInquiry,
  type Service,
  type CaseStudy,
  type Inquiry,
} from "@shared/schema";

/**
 * Storage Interface
 * Defines all required data operations for the application.
 * This abstraction allows for easier testing and potential future storage swaps.
 */
export interface IStorage {
  getServices(): Promise<Service[]>;
  getCaseStudies(): Promise<CaseStudy[]>;
  createInquiry(inquiry: InsertInquiry): Promise<void>;
  seedInitialData(): Promise<void>;
}

/**
 * Database Storage Implementation
 * Interacts with the PostgreSQL database via Drizzle ORM.
 */
export class DatabaseStorage implements IStorage {
  /**
   * Retrieves all service cards from the 'services' table.
   */
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  /**
   * Retrieves all case study items from the 'case_studies' table.
   */
  async getCaseStudies(): Promise<CaseStudy[]> {
    return await db.select().from(caseStudies);
  }

  /**
   * Persists a new contact inquiry to the 'inquiries' table.
   */
  async createInquiry(inquiry: InsertInquiry): Promise<void> {
    await db.insert(inquiries).values(inquiry);
  }

  /**
   * Data Seeding Logic
   * Checks if the tables are empty and populates them with default content
   * to ensure the website has immediate visual content on first deployment.
   */
  async seedInitialData(): Promise<void> {
    // 1. Seed Services if the table is empty
    const existingServices = await this.getServices();
    if (existingServices.length === 0) {
      await db.insert(services).values([
        {
          title: "Design Retainership",
          description: "Reliable, high-quality creative support on an ongoing basis — perfect for businesses that need consistent design excellence without managing an in-house team.",
          icon: "Palette",
          category: "Design"
        },
        {
          title: "Brand Identity Design",
          description: "Memorable, strategic brand identities that connect with your audience — from logo creation to full brand guidelines that are consistent, distinct, and impactful.",
          icon: "Fingerprint",
          category: "Branding"
        },
        {
          title: "Print & Digital Graphic Design",
          description: "Stunning print and digital creative assets across every touchpoint — from flyers and hoarding to HTML5 ads, e-blasts, and e-commerce websites.",
          icon: "Monitor",
          category: "Graphics"
        },
        {
          title: "Animation",
          description: "Dynamic, engaging animations for campaigns, presentations, and brand storytelling — 2D, 3D, logo animation, HTML5, and explainer videos.",
          icon: "Film",
          category: "Animation"
        },
        {
          title: "Digitization",
          description: "Securely convert physical documents, images, and media into digital formats for easy storage, retrieval, and sharing.",
          icon: "ScanLine",
          category: "Data"
        },
        {
          title: "BPO Service",
          description: "Cost-effective BPO solutions to streamline your operations, reduce overhead, and free up resources for your core business tasks.",
          icon: "Headphones",
          category: "BPO"
        }
      ]);
    }

    // 2. Seed Case Studies if the table is empty
    const existingCases = await this.getCaseStudies();
    if (existingCases.length === 0) {
      await db.insert(caseStudies).values([
        {
          client: "DFW Airport Parking",
          title: "Creative Marketing Collateral",
          description: "Highly engaging marketing collateral including static and animated digital banners for one of the largest US airport parking facilities.",
          solution: "Produced over 400+ creative assets, achieving significant CTR boost with animated HTML5 banners.",
          impact: "Client praised turnaround time and visual creativity, leading to ongoing retainership."
        },
        {
          client: "Goodwill Dallas",
          title: "Empowering Social Impact",
          description: "Creative campaigns to support social impact initiatives.",
          solution: "Developed comprehensive visual identity and campaign materials.",
          impact: "Increased engagement and community awareness."
        }
      ]);
    }
  }
}

// Export a singleton instance of the storage layer.
// We use DatabaseStorage exclusively for production-ready persistence.
export const storage = new DatabaseStorage();
