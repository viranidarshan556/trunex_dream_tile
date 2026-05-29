import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Rahul Sharma", city: "Delhi", lang: "Hindi", text: "TRUNEX के tiles मेरे घर में लगवाए, finish बहुत premium है और AI preview से colour चुनना बहुत आसान हो गया।" },
  { name: "Subrata Das", city: "Kolkata", lang: "Bengali", text: "আমার নতুন বাড়ির জন্য TRUNEX এর টাইলস নিয়েছি, কোয়ালিটি অসাধারণ এবং ডেলিভারি খুব দ্রুত হয়েছে।" },
  { name: "Pranab Borah", city: "Guwahati", lang: "Assamese", text: "TRUNEX-ৰ টাইল আৰু দুৱাৰ দুয়োটা অতি উচ্চ মানৰ। গ্ৰাহক সেৱা অতি ভাল আৰু দাম যুক্তিযুক্ত।" },
  { name: "Anita Verma", city: "Lucknow", lang: "Hindi", text: "Bathroom के लिए anti-skid tile choose किया, AI में पहले देखा फिर order किया — exactly वैसा ही मिला!" },
  { name: "Mithun Roy", city: "Siliguri", lang: "Bengali", text: "১২ বছরের অভিজ্ঞ ব্র্যান্ড, বিশ্বাস করা যায়। দরজা গুলোর কাঠের কাজ দারুণ সুন্দর।" },
  { name: "Hiren Saikia", city: "Dibrugarh", lang: "Assamese", text: "Pan India ত সকলো ঠাইতে delivery কৰে, আমাৰ বাবে এইটো ডাঙৰ সুবিধা। TRUNEX best brand!" },
  { name: "Priya Singh", city: "Patna", lang: "Hindi", text: "Builder हूँ, पिछले 3 साल से TRUNEX से tiles ले रहा हूँ — quality consistent है और pricing competitive।" },
  { name: "Sayan Ghosh", city: "Howrah", lang: "Bengali", text: "Living room এ marble finish tile বসিয়েছি, অতিথিরা সবাই প্রশংসা করেছে। ধন্যবাদ TRUNEX!" },
];

export function ReviewsMarquee() {
  const loop = [...REVIEWS, ...REVIEWS];
  return (
    <section id="reviews" className="border-y border-border bg-secondary/40 py-12 overflow-hidden">
      <div className="container mx-auto px-4 mb-6 text-center">
        <p className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">Trusted by 10,000+ families</p>
        <h2 className="mt-1 font-display text-3xl text-primary">What our customers say</h2>
      </div>
      <div className="relative">
        <div className="flex w-max gap-4 animate-marquee">
          {loop.map((r, i) => (
            <article key={i} className="w-[320px] shrink-0 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">"{r.text}"</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-semibold text-primary">{r.name}</span>
                <span className="text-muted-foreground">{r.city} · {r.lang}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
