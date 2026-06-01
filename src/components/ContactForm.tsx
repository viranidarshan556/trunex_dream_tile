import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { submitContact } from "@/lib/contact.functions";

export function ContactForm() {
  const submit = useServerFn(submitContact);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ full_name: "", contact_number: "", email: "", message: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await submit({ data: form });
      toast.success("Thank you! We'll get back to you shortly.");
      setForm({ full_name: "", contact_number: "", email: "", message: "" });
    } catch (err: any) {
      let errorMessage = "Failed to send. Please try again.";
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].message) {
            errorMessage = parsed[0].message;
          } else {
            errorMessage = err.message;
          }
        } catch {
          errorMessage = err.message;
        }
      }
      toast.error(errorMessage);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="contact" className="container mx-auto max-w-xl px-4 py-16">
      <div className="mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">Get in touch</p>
        <h2 className="mt-1 font-display text-3xl text-primary">Contact us</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Have questions about tiles, doors, or bulk orders? Send us a message — our team will reach out.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Full name</label>
          <Input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Mobile number</label>
            <Input required value={form.contact_number} onChange={(e) => setForm({ ...form, contact_number: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit mobile" inputMode="numeric" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Email (optional)</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
          <Textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" rows={4} />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : <><Send className="mr-2 h-4 w-4" />Send Message</>}
        </Button>
      </form>
    </section>
  );
}
