"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Plus, Pencil, Trash2, X, Save } from "lucide-react";
import { formatNGN } from "@/lib/pricing";
import type { Product, ProductCategory } from "@/lib/types";

const CATEGORIES: ProductCategory[] = [
  "sneakers", "formal", "boots", "loafers", "sandals", "athletic",
];

const EMPTY: Product = {
  id: "",
  slug: "",
  name: "",
  brand: "ADISA Select",
  description: "",
  imagePath: "",
  extraImages: [],
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
  products: Product[];
  loading: boolean;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function save(p: Product) {
    const path = editing?.slug
      ? `/api/admin/products/${encodeURIComponent(editing.slug)}`
      : "/api/admin/products";
    const method = editing?.slug ? "PATCH" : "POST";
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "Save failed");
    setEditing(null);
    onSaved();
  }

  async function remove(slug: string) {
    if (!confirm(`Delete "${slug}"? This cannot be undone.`)) return;
    setDeleting(slug);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Delete failed");
      onSaved();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY })}
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
        <p className="rounded border-2 border-black bg-white px-4 py-8 text-center text-sm text-muted-foreground">
          No products. Add your first.
        </p>
      ) : (
        <div className="overflow-x-auto border-2 border-black bg-white shadow-[6px_6px_0_#000]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--adisa-ink)] text-[var(--adisa-bone)]">
              <tr>
                <th className="px-3 py-2 text-left font-head uppercase tracking-widest text-xs">Image</th>
                <th className="px-3 py-2 text-left font-head uppercase tracking-widest text-xs">Name</th>
                <th className="hidden px-3 py-2 text-left font-head uppercase tracking-widest text-xs md:table-cell">Slug</th>
                <th className="px-3 py-2 text-left font-head uppercase tracking-widest text-xs">Category</th>
                <th className="px-3 py-2 text-right font-head uppercase tracking-widest text-xs">Source</th>
                <th className="px-3 py-2 text-right font-head uppercase tracking-widest text-xs">Sale</th>
                <th className="px-3 py-2 text-center font-head uppercase tracking-widest text-xs">Stock</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {products.map((p) => (
                <tr key={p.slug} className="odd:bg-white even:bg-zinc-50">
                  <td className="px-3 py-2">
                    {p.imagePath ? (
                      <div className="relative h-12 w-12 overflow-hidden border border-black bg-zinc-100">
                        <Image src={p.imagePath} alt={p.name} fill sizes="48px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 border border-black bg-zinc-100" />
                    )}
                  </td>
                  <td className="px-3 py-2 font-semibold">{p.name}</td>
                  <td className="hidden px-3 py-2 font-mono text-xs md:table-cell">{p.slug}</td>
                  <td className="px-3 py-2 capitalize">{p.category}</td>
                  <td className="px-3 py-2 text-right">{formatNGN(p.sourcePrice)}</td>
                  <td className="px-3 py-2 text-right font-bold">{formatNGN(p.salePrice)}</td>
                  <td className="px-3 py-2 text-center">
                    {p.inStock ? (
                      <span className="inline-block h-2 w-2 rounded-full bg-[var(--adisa-green)]" />
                    ) : (
                      <span className="inline-block h-2 w-2 rounded-full bg-[var(--adisa-clay)]" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-right whitespace-nowrap">
                    <button
                      type="button"
                      aria-label="Edit"
                      onClick={() => setEditing(p)}
                      className="inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#000] hover:bg-zinc-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete"
                      onClick={() => remove(p.slug)}
                      disabled={deleting === p.slug}
                      className="ml-1 inline-flex h-8 w-8 items-center justify-center border-2 border-black bg-white text-[var(--adisa-clay)] shadow-[2px_2px_0_#000] hover:bg-zinc-100 disabled:opacity-60"
                    >
                      {deleting === p.slug ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
          isNew={!editing.slug || editing.slug === ""}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

// ----------------- editor modal -----------------

function ProductEditor({
  initial, isNew, onClose, onSave,
}: {
  initial: Product;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Product) => Promise<void>;
}) {
  const [p, setP] = useState<Product>(initial);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function set<K extends keyof Product>(key: K, value: Product[K]) {
    setP((prev) => ({ ...prev, [key]: value }));
  }

  async function submit() {
    if (!p.slug.trim() || !p.name.trim()) {
      setErr("Slug and name are required");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await onSave(p);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border-2 border-black bg-[var(--adisa-bone)] p-6 shadow-[8px_8px_0_#000]">
        <div className="flex items-center justify-between">
          <h3 className="font-head text-xl font-extrabold">
            {isNew ? "Add product" : `Edit · ${p.slug}`}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close" className="border-2 border-black bg-white p-2 shadow-[3px_3px_0_#000]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Name *</span>
            <input value={p.name} onChange={(e) => set("name", e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Slug *</span>
            <input
              value={p.slug}
              onChange={(e) => set("slug", e.target.value.replace(/\s+/g, "-").toLowerCase())}
              disabled={!isNew}
              className={`${inputCls} mt-1 disabled:bg-zinc-100`}
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Description</span>
            <textarea rows={3} value={p.description} onChange={(e) => set("description", e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Image path</span>
            <input value={p.imagePath} onChange={(e) => set("imagePath", e.target.value)} placeholder="/shoes/file.png" className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Category</span>
            <select value={p.category} onChange={(e) => set("category", e.target.value as ProductCategory)} className={`${inputCls} mt-1`}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Brand</span>
            <input value={p.brand} onChange={(e) => set("brand", e.target.value)} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Source price ₦</span>
            <input type="number" min={0} value={p.sourcePrice} onChange={(e) => set("sourcePrice", Number(e.target.value))} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Sale price ₦</span>
            <input type="number" min={0} value={p.salePrice} onChange={(e) => set("salePrice", Number(e.target.value))} className={`${inputCls} mt-1`} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">UK sizes (comma list)</span>
            <input
              value={p.sizesUk.join(",")}
              onChange={(e) => set("sizesUk", e.target.value.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n)))}
              className={`${inputCls} mt-1`}
              placeholder="6,7,8,9,10,11"
            />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">Colours (comma list)</span>
            <input
              value={p.colors.join(",")}
              onChange={(e) => set("colors", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className={`${inputCls} mt-1`}
              placeholder="Black,White"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={p.inStock} onChange={(e) => set("inStock", e.target.checked)} />
            In stock
          </label>
        </div>

        {err && <p className="mt-4 text-sm text-[var(--adisa-clay)]">{err}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="border-2 border-black bg-white px-4 py-2 text-sm font-semibold shadow-[3px_3px_0_#000]">
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={busy}
            className="inline-flex items-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-5 py-2 text-sm font-semibold text-white shadow-[3px_3px_0_#000] disabled:opacity-70"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isNew ? "Create" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
