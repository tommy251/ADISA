"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Loader2, Plus, Pencil, Trash2, X, Save, Upload, Image as ImageIcon } from "lucide-react";
import { formatNGN } from "@/lib/pricing";
import type { ProductCategory } from "@/lib/types";
import { getPublicSupabase, isSupabaseConfigured } from "@/lib/supabase";

const CATEGORIES: ProductCategory[] = [
  "sneakers", "formal", "boots", "loafers", "sandals", "athletic",
];

const EMPTY = {
  slug: "",
  name: "",
  brand: "ADISA Select",
  description: "",
  imagePath: "",
  extraImages: [] as string[],
  sourcePrice: 0,
  salePrice: 0,
  currency: "NGN",
  sizesUk: [7, 8, 9, 10, 11],
  colors: ["Black"],
  category: "sneakers",
  rating: 4.6,
  reviews: 0,
  isFeatured: false,
  inStock: true,
};

export function ProductsAdmin({
  products, loading, onSaved,
}: {
  products: any[];
  loading: boolean;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function save(p: any, newImageUrls: string[]) {
    if (!isSupabaseConfigured()) throw new Error("Supabase not configured");
    const supabase = getPublicSupabase();

    // Combine existing images with newly uploaded ones
    const allImages = [...(p.extraImages || []), ...newImageUrls];
    const mainImage = allImages.length > 0 ? allImages[0] : p.imagePath;

    const payload: any = {
      name: p.name,
      brand: p.brand,
      description: p.description,
      imagePath: mainImage,
      extraImages: allImages,
      sourcePrice: Number(p.sourcePrice) || 0,
      salePrice: Number(p.salePrice) || 0,
      currency: p.currency,
      sizesUk: p.sizesUk,
      colors: p.colors,
      category: p.category,
      isFeatured: p.isFeatured,
      inStock: p.inStock,
    };

    let error;
    if (p.slug && p.slug !== "") {
      const res = await supabase.from("products").update(payload).eq("slug", p.slug);
      error = res.error;
    } else {
      payload.slug = p.slug || p.name.toLowerCase().replace(/\s+/g, "-");
      const res = await supabase.from("products").insert(payload);
      error = res.error;
    }

    if (error) throw new Error(error.message);
    setEditing(null);
    onSaved();
  }

  async function remove(slug: string) {
    if (!confirm(`Delete "${slug}"?`)) return;
    setDeleting(slug);
    try {
      const supabase = getPublicSupabase();
      const { error } = await supabase.from("products").delete().eq("slug", slug);
      if (error) throw error;
      onSaved();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setDeleting(null);
    }
  }

  function safeFormatNGN(value: any): string {
    return formatNGN(Number(value) || 0);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY, extraImages: [] })}
          className="inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-4 py-2 text-sm font-semibold text-white shadow-[4px_4px_0_#000]"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--adisa-clay)]" />
        </div>
      ) : products.length === 0 ? (
        <p className="rounded border-2 border-black bg-white px-4 py-8 text-center text-sm text-muted-foreground">No products yet.</p>
      ) : (
        <div className="overflow-x-auto border-2 border-black bg-white shadow-[6px_6px_0_#000]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--adisa-ink)] text-[var(--adisa-bone)]">
              <tr>
                <th className="px-3 py-2 text-left font-head uppercase tracking-widest text-xs">Image</th>
                <th className="px-3 py-2 text-left font-head uppercase tracking-widest text-xs">Name</th>
                <th className="px-3 py-2 text-left font-head uppercase tracking-widest text-xs">Category</th>
                <th className="px-3 py-2 text-right font-head uppercase tracking-widest text-xs">Price</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {products.map((p: any) => (
                <tr key={p.slug} className="odd:bg-white even:bg-zinc-50">
                  <td className="px-3 py-2">
                    {p.imagePath ? (
                      <div className="relative h-12 w-12 overflow-hidden border border-black bg-zinc-100">
                        <Image src={p.imagePath} alt={p.name} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : <div className="h-12 w-12 border border-black bg-zinc-100" />}
                  </td>
                  <td className="px-3 py-2 font-semibold">{p.name}</td>
                  <td className="px-3 py-2 capitalize">{p.category}</td>
                  <td className="px-3 py-2 text-right font-bold">{safeFormatNGN(p.salePrice)}</td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <button onClick={() => setEditing(p)} className="inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-zinc-100">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.slug)} disabled={deleting === p.slug} className="ml-1 inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white text-[var(--adisa-clay)] shadow-[2px_2px_0_#000] hover:bg-zinc-100 disabled:opacity-60">
                      {deleting === p.slug ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <ProductEditor
          initial={editing}
          isNew={!editing.slug}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

// ----------------- editor modal with image upload -----------------

function ProductEditor({ initial, isNew, onClose, onSave }: { initial: any; isNew: boolean; onClose: () => void; onSave: (p: any, urls: string[]) => Promise<void>; }) {
  const [p, setP] = useState<any>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set(key: string, value: any) {
    setP((prev: any) => ({ ...prev, [key]: value }));
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      // Limit to 8 images total (including existing)
      const maxFiles = 8 - (p.extraImages?.length || 0);
      const toAdd = files.slice(0, maxFiles);
      
      setSelectedFiles(toAdd);
      
      // Create local previews
      const newPreviews = toAdd.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  }

  function removePreview(index: number) {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    setPreviews(newPreviews);
  }

  async function submit() {
    if (!p.name.trim()) {
      setErr("Product name is required");
      return;
    }
    setBusy(true);
    setErr("");
    setUploadProgress("Uploading images...");

    try {
      const supabase = getPublicSupabase();
      const uploadedUrls: string[] = [];

      // Upload new files to Supabase Storage
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setUploadProgress(`Uploading image ${i + 1} of ${selectedFiles.length}...`);
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${p.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) throw new Error(`Upload failed: ${error.message}`);

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedUrls.push(data.publicUrl);
      }

      setUploadProgress("Saving product details...");
      await onSave(p, uploadedUrls);
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setBusy(false);
      setUploadProgress("");
    }
  }

  const inputCls = "w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-2 border-black bg-[var(--adisa-bone)] p-6 shadow-[8px_8px_0_#000]">
        <div className="flex items-center justify-between">
          <h3 className="font-head text-xl font-extrabold">{isNew ? "Add product" : `Edit · ${p.slug}`}</h3>
          <button type="button" onClick={onClose} className="border-2 border-black bg-white p-2 shadow-[3px_3px_0_#000]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Upload Section */}
        <div className="mt-5 border-2 border-dashed border-black/30 bg-white p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
              Product Images (Max 8)
            </span>
            <span className="text-xs text-muted-foreground">
              {(p.extraImages?.length || 0) + selectedFiles.length} / 8
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            {/* Show existing images */}
            {p.extraImages?.map((url: string, idx: number) => (
              <div key={idx} className="relative h-20 w-full border-2 border-black bg-zinc-100">
                <Image src={url} alt={`Existing ${idx}`} fill className="object-cover" />
              </div>
            ))}
            {/* Show new previews */}
            {previews.map((url, idx) => (
              <div key={`new-${idx}`} className="relative h-20 w-full border-2 border-[var(--adisa-gold)] bg-zinc-100">
                <Image src={url} alt={`Preview ${idx}`} fill className="object-cover" />
                <button 
                  type="button" 
                  onClick={() => removePreview(idx)}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={busy}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy || (p.extraImages?.length || 0) + selectedFiles.length >= 8}
            className="w-full border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_#000] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" /> Select Images
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Name *</span>
            <input value={p.name} onChange={(e) => set("name", e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Slug (auto-generated if new)</span>
            <input value={p.slug} onChange={(e) => set("slug", e.target.value.replace(/\s+/g, "-").toLowerCase())} disabled={!isNew} className={`${inputCls} mt-1 disabled:bg-zinc-100`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Category</span>
            <select value={p.category} onChange={(e) => set("category", e.target.value)} className={`${inputCls} mt-1`}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Source price ₦</span>
            <input type="number" min={0} value={p.sourcePrice || 0} onChange={(e) => set("sourcePrice", Number(e.target.value))} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Sale price ₦</span>
            <input type="number" min={0} value={p.salePrice || 0} onChange={(e) => set("salePrice", Number(e.target.value))} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Description</span>
            <textarea rows={2} value={p.description} onChange={(e) => set("description", e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.inStock} onChange={(e) => set("inStock", e.target.checked)} /> In stock
          </label>
        </div>

        {err && <p className="mt-4 text-sm text-[var(--adisa-clay)]">{err}</p>}
        {uploadProgress && <p className="mt-2 text-sm text-[var(--adisa-gold)] flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> {uploadProgress}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_#000]">Cancel</button>
          <button type="button" onClick={submit} disabled={busy} className="inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-5 py-2 text-sm font-semibold text-white shadow-[3px_3px_0_#000] disabled:opacity-70">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}