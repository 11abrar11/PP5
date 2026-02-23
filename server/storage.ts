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

export interface IStorage {
  getServices(): Promise<Service[]>;
  getCaseStudies(): Promise<CaseStudy[]>;
  createInquiry(inquiry: InsertInquiry): Promise<void>;
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getCaseStudies(): Promise<CaseStudy[]> {
    return await db.select().from(caseStudies);
  }

  async createInquiry(inquiry: InsertInquiry): Promise<void> {
    await db.insert(inquiries).values(inquiry);
  }

  async seedInitialData(): Promise<void> {
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


export class MemoryStorage implements IStorage {
  private services: Service[] = [];
  private caseStudies: CaseStudy[] = [];
  private inquiries: Inquiry[] = [];
  private idCounter = { services: 1, caseStudies: 1, inquiries: 1 };

  async getServices(): Promise<Service[]> {
    return this.services;
  }

  async getCaseStudies(): Promise<CaseStudy[]> {
    return this.caseStudies;
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<void> {
    const inquiry: Inquiry = {
      ...insertInquiry,
      id: this.idCounter.inquiries++,
      createdAt: new Date(),
      subject: insertInquiry.subject ?? null,
    };
    this.inquiries.push(inquiry);
  }

  async seedInitialData(): Promise<void> {
    if (this.services.length === 0) {
      this.services = [
        {
          id: this.idCounter.services++,
          title: "Design Retainership",
          description: "Reliable, high-quality creative support on an ongoing basis — perfect for businesses that need consistent design excellence without managing an in-house team.",
          icon: "Palette",
          category: "Design"
        },
        {
          id: this.idCounter.services++,
          title: "Brand Identity Design",
          description: "Memorable, strategic brand identities that connect with your audience — from logo creation to full brand guidelines that are consistent, distinct, and impactful.",
          icon: "Fingerprint",
          category: "Branding"
        },
        {
          id: this.idCounter.services++,
          title: "Print & Digital Graphic Design",
          description: "Stunning print and digital creative assets across every touchpoint — from flyers and hoarding to HTML5 ads, e-blasts, and e-commerce websites.",
          icon: "Monitor",
          category: "Graphics"
        },
        {
          id: this.idCounter.services++,
          title: "Animation",
          description: "Dynamic, engaging animations for campaigns, presentations, and brand storytelling — 2D, 3D, logo animation, HTML5, and explainer videos.",
          icon: "Film",
          category: "Animation"
        },
        {
          id: this.idCounter.services++,
          title: "Digitization",
          description: "Securely convert physical documents, images, and media into digital formats for easy storage, retrieval, and sharing.",
          icon: "ScanLine",
          category: "Data"
        },
        {
          id: this.idCounter.services++,
          title: "BPO Service",
          description: "Cost-effective BPO solutions to streamline your operations, reduce overhead, and free up resources for your core business tasks.",
          icon: "Headphones",
          category: "BPO"
        }
      ];
    }

    if (this.caseStudies.length === 0) {
      this.caseStudies = [
        {
          id: this.idCounter.caseStudies++,
          client: "DFW Airport Parking",
          title: "Creative Marketing Collateral",
          description: "Highly engaging marketing collateral including static and animated digital banners for one of the largest US airport parking facilities.",
          solution: "Produced over 400+ creative assets, achieving significant CTR boost with animated HTML5 banners.",
          impact: "Client praised turnaround time and visual creativity, leading to ongoing retainership.",
          imageUrl: null
        },
        {
          id: this.idCounter.caseStudies++,
          client: "Goodwill Dallas",
          title: "Empowering Social Impact",
          description: "Creative campaigns to support social impact initiatives.",
          solution: "Developed comprehensive visual identity and campaign materials.",
          impact: "Increased engagement and community awareness.",
          imageUrl: null
        }
      ];
    }
  }
}

export const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemoryStorage();
