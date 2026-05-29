import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listContacts, updateContactStatus, deleteContact } from "@/lib/contact.functions";

export const Route = createFileRoute("/_authenticated/admin/contacts")({
  component: ContactsPage,
});

function ContactsPage() {
  const listFn = useServerFn(listContacts);
  const updateFn = useServerFn(updateContactStatus);
  const deleteFn = useServerFn(deleteContact);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["admin-contacts"], queryFn: () => listFn() });

  async function setStatus(id: string, status: string) {
    await updateFn({ data: { id, status } });
    qc.invalidateQueries({ queryKey: ["admin-contacts"] });
  }
  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    await deleteFn({ data: { id } });
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin-contacts"] });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-primary">Contact messages ({data?.length ?? 0})</h1>
      {(!data || data.length === 0) ? (
        <p className="text-sm text-muted-foreground">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {data.map((m: any) => (
            <div key={m.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-primary">{m.full_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.contact_number}{m.email ? ` · ${m.email}` : ""} · {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
                <Badge variant={m.status === "new" ? "default" : "outline"}>{m.status}</Badge>
              </div>
              <p className="mt-3 text-sm whitespace-pre-wrap">{m.message}</p>
              <div className="mt-3 flex gap-2">
                {m.status !== "contacted" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(m.id, "contacted")}>Mark contacted</Button>
                )}
                <a href={`https://wa.me/91${m.contact_number}`} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="outline">WhatsApp</Button>
                </a>
                <Button size="sm" variant="ghost" onClick={() => remove(m.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
