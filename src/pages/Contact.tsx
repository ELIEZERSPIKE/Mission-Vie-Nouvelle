import React, { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import { MapPin, Mail, Phone, Send } from "lucide-react";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", subject: "", message: "" });

  const update = (k: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <PageHeader
        eyebrow="Nous contacter"
        title="Parlons de votre engagement."
        intro="Une question, un projet, une envie de soutenir ? Écrivez-nous, nous vous répondrons rapidement."
        image="/images/contact-hero.jpg"
      />

      <section className="bg-background py-20 sm:py-28 grain">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-12">
          {/* Info */}
          <div className="lg:col-span-4">
            <h2 className="font-heading text-2xl mb-8">Nos coordonnées</h2>
            <ul className="space-y-6 text-foreground/70">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Togoville(Petit Paradis)</p>
                  <p className="text-sm">Région Maritime, Togo</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Mail size={20} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm">info@missionvienouvelle.org</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={20} className="text-accent mt-1 shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Téléphone</p>
                  <p className="text-sm">+228 99 48 54 55</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 lg:col-start-6">
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-secondary/40 border border-border p-12 text-center"
              >
                <h3 className="font-heading text-2xl mb-3">Message envoyé</h3>
                <p className="text-foreground/60">Merci {form.name || ""}. Nous vous répondrons dans les plus brefs délais.</p>
              </motion.div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom complet</label>
                    <input required value={form.name} onChange={update("name")} className="w-full bg-background border border-border px-4 py-3 focus:border-accent focus:outline-none transition-colors" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input required type="email" value={form.email} onChange={update("email")} className="w-full bg-background border border-border px-4 py-3 focus:border-accent focus:outline-none transition-colors" placeholder="vous@exemple.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sujet</label>
                  <input value={form.subject} onChange={update("subject")} className="w-full bg-background border border-border px-4 py-3 focus:border-accent focus:outline-none transition-colors" placeholder="Objet de votre message" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea required rows={6} value={form.message} onChange={update("message")} className="w-full bg-background border border-border px-4 py-3 focus:border-accent focus:outline-none transition-colors resize-none" placeholder="Votre message..." />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 font-medium hover:bg-primary/90 transition-colors">
                  Envoyer le message <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}