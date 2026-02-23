import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageHeader } from "@/components/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  X,
  ArrowRight,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ─── Validation Schema ────────────────────────────────────────────────────────
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const PROJECT_TYPES = [
  "Branding",
  "Website / UI",
  "Marketing",
  "Video",
  "Other",
];

// ─── Contact Info items ───────────────────────────────────────────────────────
const contactInfo = [
  {
    icon: MapPin,
    label: "Visit Us",
    content: "1st Floor, No 62, HC Srikantiah Layout,\nAC Post, Bangalore 560045",
    href: null,
  },
  {
    icon: Mail,
    label: "Email Us",
    content: "support@pp5mediasolutions.com",
    href: "mailto:support@pp5mediasolutions.com",
  },
  {
    icon: Phone,
    label: "Call Us",
    content: "+91 93433 85042",
    href: "tel:+919343385042",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "",
      message: "",
    },
    mode: "onTouched",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setAttachedFile(file);
  };

  const removeFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: ContactFormData) => {
    setStatus("sending");
    try {
      // Use FormData so the file attachment is sent as multipart/form-data
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.company) formData.append("company", data.company);
      if (data.projectType) formData.append("projectType", data.projectType);
      formData.append("message", data.message);
      if (attachedFile) formData.append("attachment", attachedFile);

      // No Content-Type header — browser sets it automatically with the correct boundary
      const res = await fetch("/api/inquiries", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || "Failed to send message");
      }

      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out. We'll get back to you shortly.",
        duration: 6000,
      });
      setStatus("idle");
      form.reset();
      setAttachedFile(null);
    } catch (err: any) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHeader
        title="Let's Create Something Extraordinary"
        subtitle="Have a project in mind? We'd love to hear about it."
        bgImage="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80"
      />

      {/* ── Intro ── */}
      <section className="pt-20 pb-4">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            Whether you're looking to launch a new brand, refresh your website,
            or create a campaign that turns heads, we're ready to make it
            happen. Drop us a message, and let's start shaping your next big
            success story.
          </motion.p>
        </div>
      </section>

      {/* ── Main Section ── */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* ── Left: Contact Info ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:w-1/3 space-y-8"
            >
              <div>
                <span className="inline-block text-xs font-semibold tracking-widest text-primary uppercase mb-3">
                  Reach Out
                </span>
                <h2 className="text-3xl font-bold font-display text-gray-900 mb-4 leading-tight">
                  Get in Touch
                </h2>
                <p className="text-gray-500 leading-relaxed">
                  Our team is available 24/5 to assist you with any inquiries.
                  Drop us a line or visit our office in Bangalore.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50 hover:border-primary/20 hover:bg-white hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-0.5 text-sm">
                        {item.label}
                      </h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-gray-500 hover:text-primary transition-colors text-sm"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-500 text-sm whitespace-pre-line">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ── Right: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:w-2/3 bg-gray-50 border border-gray-100 p-8 md:p-12 rounded-3xl shadow-sm"
            >
              <h3 className="text-2xl font-bold font-display text-gray-900 mb-8">
                Send a Message
              </h3>


              {/* Error */}
              {status === "error" && (
                <div className="flex items-start gap-4 p-6 bg-red-50 border border-red-200 rounded-2xl mb-8">
                  <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={22} />
                  <div>
                    <p className="font-bold text-red-800">Something went wrong</p>
                    <p className="text-red-700 text-sm mt-1">
                      Please try again or email us at{" "}
                      <a
                        href="mailto:support@pp5mediasolutions.com"
                        className="underline"
                      >
                        support@pp5mediasolutions.com
                      </a>
                    </p>
                  </div>
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  noValidate
                >
                  {/* Row 1: Name + Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="bg-white h-12 rounded-xl border-gray-200 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Email Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              className="bg-white h-12 rounded-xl border-gray-200 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Phone + Company */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Phone Number{" "}
                            <span className="text-gray-400 font-normal text-xs">
                              (Optional)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+91 98765 43210"
                              className="bg-white h-12 rounded-xl border-gray-200 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company / Brand Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Acme Corp"
                              className="bg-white h-12 rounded-xl border-gray-200 focus:border-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 3: Project Type */}
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-sm"
                          >
                            <option value="">Select a project type…</option>
                            {PROJECT_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Row 4: Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Message <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project, timeline, and goals…"
                            className="bg-white min-h-[150px] rounded-xl resize-none border-gray-200 focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Row 5: File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attachment{" "}
                      <span className="text-gray-400 font-normal text-xs">
                        (Brief, references or documents)
                      </span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                      onChange={handleFileChange}
                    />

                    {attachedFile ? (
                      <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-primary/30 text-sm">
                        <Paperclip size={16} className="text-primary shrink-0" />
                        <span className="text-gray-700 flex-1 truncate">
                          {attachedFile.name}
                        </span>
                        <span className="text-gray-400 shrink-0">
                          ({(attachedFile.size / 1024).toFixed(0)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 px-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Paperclip size={16} />
                        Click to attach a file
                      </button>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              </Form>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
