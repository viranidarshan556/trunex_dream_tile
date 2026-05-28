import { useRef, useState } from "react";
import { Camera, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
}

export function RoomImagePicker({ value, onChange }: Props) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(f: File | null) {
    onChange(f);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  if (value && preview) {
    return (
      <div className="relative overflow-hidden rounded-xl border gold-border">
        <img src={preview} alt="Room" className="aspect-[4/3] w-full object-cover" />
        <button
          type="button"
          onClick={() => handleFile(null)}
          className="absolute right-2 top-2 rounded-full bg-background/80 p-2 backdrop-blur hover:bg-background"
          aria-label="Remove"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      <Button
        type="button"
        variant="outline"
        className="h-32 flex-col gap-2 gold-border"
        onClick={() => cameraRef.current?.click()}
      >
        <Camera className="h-6 w-6 text-gold" />
        <span className="text-xs">Take photo</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        className="h-32 flex-col gap-2 gold-border"
        onClick={() => galleryRef.current?.click()}
      >
        <ImageIcon className="h-6 w-6 text-gold" />
        <span className="text-xs">From gallery</span>
      </Button>
    </div>
  );
}
