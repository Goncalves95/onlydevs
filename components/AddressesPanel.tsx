"use client";

import { useState } from "react";
import AddressForm, { type AddressData } from "@/components/AddressForm";

interface Props {
  addresses: AddressData[];
  onSave: (formData: FormData) => Promise<void>;
  onDelete: (formData: FormData) => Promise<void>;
  onSetDefault: (formData: FormData) => Promise<void>;
  labels: {
    emptyNote: string;
    defaultBadge: string;
    setDefault: string;
    deleteLabel: string;
    checkoutNote: string;
  };
}

export default function AddressesPanel({
  addresses,
  onSave,
  onDelete,
  onSetDefault,
  labels,
}: Props) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);

  function openAdd() {
    setEditingAddress(null);
    setShowForm(true);
  }

  function openEdit(addr: AddressData) {
    setEditingAddress(addr);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingAddress(null);
  }

  return (
    <div className="space-y-6">
      {/* Address list */}
      {addresses.length === 0 && !showForm && (
        <div className="border border-zinc-800 rounded-lg p-8 text-center">
          <p className="font-mono text-xs text-green-600 mb-2">// no.addresses.saved</p>
          <p className="text-zinc-400 text-sm leading-relaxed">{labels.emptyNote}</p>
        </div>
      )}

      {addresses.length > 0 && (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li key={addr.id} className="border border-zinc-800 rounded-lg p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-zinc-300 leading-relaxed">
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""} {addr.postalCode}
                  </p>
                  <p className="uppercase text-xs text-zinc-500 mt-0.5">{addr.country}</p>
                </div>
                {addr.isDefault && (
                  <span className="shrink-0 text-[10px] font-mono border border-green-500/40 text-green-400 rounded px-2 py-0.5">
                    {labels.defaultBadge}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 pt-1 border-t border-zinc-800">
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs text-zinc-400 hover:text-green-400 transition-colors"
                >
                  Edit
                </button>

                {!addr.isDefault && (
                  <form action={onSetDefault}>
                    <input type="hidden" name="id" value={addr.id} />
                    <button
                      type="submit"
                      className="text-xs text-zinc-400 hover:text-green-400 transition-colors"
                    >
                      {labels.setDefault}
                    </button>
                  </form>
                )}

                <form action={onDelete}>
                  <input type="hidden" name="id" value={addr.id} />
                  <button
                    type="submit"
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    {labels.deleteLabel}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit form */}
      {showForm ? (
        <AddressForm
          onSave={onSave}
          editAddress={editingAddress ?? undefined}
          onCancel={closeForm}
        />
      ) : (
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 w-full border border-dashed border-zinc-700 hover:border-green-500/50 hover:text-green-400 text-zinc-500 rounded-lg px-5 py-3 text-sm font-mono transition-colors"
        >
          + add.new.address
        </button>
      )}

      <p className="text-xs text-zinc-600 font-mono leading-relaxed">{labels.checkoutNote}</p>
    </div>
  );
}
