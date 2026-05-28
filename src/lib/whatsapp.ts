import { TRUNEX_WHATSAPP, BRAND } from "./constants";

export function buildExpertWhatsAppUrl(opts: {
  name: string;
  city: string;
  sqft: number;
  imageUrl?: string;
}) {
  const lines = [
    `Hi ${BRAND.name}, I'd like an expert tile recommendation.`,
    `Name: ${opts.name}`,
    `City: ${opts.city}`,
    `Area: ${opts.sqft} sqft`,
    opts.imageUrl ? `Room photo: ${opts.imageUrl}` : "",
  ].filter(Boolean);
  return `https://wa.me/${TRUNEX_WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildLeadFollowupUrl(opts: {
  contact_number: string;
  name: string;
  tileName?: string;
}) {
  const phone = opts.contact_number.replace(/\D/g, "");
  const full = phone.length === 10 ? `91${phone}` : phone;
  const msg = `Hi ${opts.name}, this is ${BRAND.name}. Thanks for trying our AI Tile Visualizer${opts.tileName ? ` with ${opts.tileName}` : ""}. Can we help you finalize your tiles?`;
  return `https://wa.me/${full}?text=${encodeURIComponent(msg)}`;
}
