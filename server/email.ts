import nodemailer from "nodemailer";

export interface Attachment {
    filename: string;
    content: Buffer;
    contentType: string;
}

export interface SendEmailOptions {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    html: string;
    text: string;
    attachments?: Attachment[];
}

/**
 * Sends an email using the SMTP credentials configured in .env
 * Compatible with any SMTP provider (cPanel, Zoho, Outlook, etc.)
 */
export async function sendEmail(options: SendEmailOptions): Promise<void> {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "465", 10);
    // Automatically determine 'secure' based on port if not explicitly set
    // Port 465 is usually SSL (secure: true), Port 587 is STARTTLS (secure: false)
    const secure = process.env.SMTP_SECURE
        ? process.env.SMTP_SECURE !== "false"
        : port === 465;

    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        const missing = [
            !host && "SMTP_HOST",
            !user && "SMTP_USER",
            !pass && "SMTP_PASS",
        ]
            .filter(Boolean)
            .join(", ");
        throw new Error(
            `Email not configured. Missing environment variables: ${missing}`
        );
    }

    const transporterOptions: any = {
        host,
        port,
        secure,
        requireTLS: port === 587,
        auth: { user, pass },
        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 30000,
        family: 4, // Force IPv4 to avoid ENETUNREACH on IPv6
        tls: {
            rejectUnauthorized: false,
        },
    };

    // Use built-in 'gmail' service if host is Gmail
    // This is often more reliable on cloud providers
    if (host.includes("gmail.com")) {
        delete transporterOptions.host;
        delete transporterOptions.port;
        delete transporterOptions.secure;
        delete transporterOptions.requireTLS; // Not needed for service
        transporterOptions.service = "gmail";
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    await transporter.sendMail({
        from: options.from,
        to: options.to,
        replyTo: options.replyTo,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments?.map((a) => ({
            filename: a.filename,
            content: a.content,
            contentType: a.contentType,
        })),
    });

    console.log(`✅ Email sent → ${options.to} | Subject: ${options.subject}`);
}

/**
 * Builds the HTML body for a contact form inquiry email
 */
export function buildInquiryEmail(fields: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    projectType?: string;
    message: string;
    hasAttachment: boolean;
    attachmentName?: string;
}): { html: string; text: string } {
    const rows = [
        { label: "Name", value: fields.name },
        { label: "Email", value: `<a href="mailto:${fields.email}" style="color:#16a34a;">${fields.email}</a>` },
        ...(fields.phone ? [{ label: "Phone", value: fields.phone }] : []),
        ...(fields.company ? [{ label: "Company", value: fields.company }] : []),
        ...(fields.projectType ? [{ label: "Project Type", value: fields.projectType }] : []),
        ...(fields.hasAttachment && fields.attachmentName
            ? [{ label: "Attachment", value: `📎 ${fields.attachmentName}` }]
            : []),
    ];

    const tableRows = rows
        .map(
            (r, i) => `
      <tr style="background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};">
        <td style="padding:10px 14px;font-weight:bold;color:#6b7280;width:140px;font-size:13px;">${r.label}</td>
        <td style="padding:10px 14px;color:#111827;font-size:13px;">${r.value}</td>
      </tr>`
        )
        .join("");

    const html = `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
  <!-- Header -->
  <div style="background:#000000;padding:24px 28px;display:flex;align-items:center;gap:12px;">
    <div style="width:4px;height:40px;background:#16a34a;border-radius:2px;"></div>
    <div>
      <h1 style="color:#ffffff;margin:0;font-size:18px;font-weight:700;">📬 New Inquiry — PP5 Media Solutions</h1>
      <p style="color:#9ca3af;margin:4px 0 0;font-size:12px;">Submitted via pp5mediasolutions.com</p>
    </div>
  </div>

  <!-- Details Table -->
  <table style="width:100%;border-collapse:collapse;">
    ${tableRows}
  </table>

  <!-- Message -->
  <div style="padding:20px 28px;">
    <p style="font-size:13px;font-weight:bold;color:#6b7280;margin:0 0 10px;text-transform:uppercase;letter-spacing:.5px;">Message</p>
    <div style="background:#f9fafb;border-left:4px solid #16a34a;border-radius:8px;padding:16px;font-size:14px;line-height:1.7;color:#1f2937;white-space:pre-wrap;">${fields.message}</div>
  </div>

  <!-- Footer -->
  <div style="background:#f3f4f6;padding:14px 28px;border-top:1px solid #e5e7eb;">
    <p style="color:#9ca3af;font-size:11px;margin:0;">Reply directly to this email to respond to <strong>${fields.name}</strong> at <strong>${fields.email}</strong>.</p>
  </div>
</div>`;

    const text = [
        `New Inquiry — PP5 Media Solutions`,
        `─────────────────────────────────`,
        `Name:         ${fields.name}`,
        `Email:        ${fields.email}`,
        fields.phone ? `Phone:        ${fields.phone}` : null,
        fields.company ? `Company:      ${fields.company}` : null,
        fields.projectType ? `Project Type: ${fields.projectType}` : null,
        fields.hasAttachment ? `Attachment:   ${fields.attachmentName}` : null,
        ``,
        `Message:`,
        fields.message,
    ]
        .filter((line) => line !== null)
        .join("\n");

    return { html, text };
}
