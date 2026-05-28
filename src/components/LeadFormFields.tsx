import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LeadInput } from "@/lib/validation";

interface Props {
  values: Partial<LeadInput>;
  errors: Partial<Record<keyof LeadInput, string>>;
  onChange: (v: Partial<LeadInput>) => void;
}

export function LeadFormFields({ values, errors, onChange }: Props) {
  return (
    <div className="space-y-4">
      <Field label="Full name" error={errors.full_name}>
        <Input
          value={values.full_name ?? ""}
          onChange={(e) => onChange({ full_name: e.target.value })}
          placeholder="Your name"
        />
      </Field>
      <Field label="Mobile number" error={errors.contact_number}>
        <div className="flex">
          <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm">+91</span>
          <Input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            className="rounded-l-none"
            value={values.contact_number ?? ""}
            onChange={(e) => onChange({ contact_number: e.target.value.replace(/\D/g, "") })}
            placeholder="10-digit number"
          />
        </div>
      </Field>
      <Field label="Town / City" error={errors.city}>
        <Input
          value={values.city ?? ""}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="e.g. Agartala"
        />
      </Field>
      <Field label="Area to tile (sqft)" error={errors.sqft}>
        <Input
          type="number"
          inputMode="numeric"
          min={1}
          value={values.sqft ?? ""}
          onChange={(e) => onChange({ sqft: e.target.value ? Number(e.target.value) : (undefined as any) })}
          placeholder="e.g. 800"
        />
      </Field>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
