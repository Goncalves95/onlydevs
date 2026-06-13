"use client";

import { useState, useTransition } from "react";
import Cookies from "js-cookie";
import { CURRENCY_COOKIE, formatPrice } from "@/lib/currency";
import {
  getCurrencyForCountry,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
  EUROPEAN_COUNTRIES,
} from "@/lib/shipping";

export interface AddressData {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

interface Props {
  onSave: (formData: FormData) => Promise<void>;
  editAddress?: AddressData;
  onCancel: () => void;
}

const inputCls =
  "w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-zinc-600";

export default function AddressForm({ onSave, editAddress, onCancel }: Props) {
  const [country, setCountry] = useState(editAddress?.country ?? "");
  const [isPending, startTransition] = useTransition();

  const detectedCurrency = country ? getCurrencyForCountry(country) : null;
  const shippingFee = detectedCurrency ? STANDARD_SHIPPING_FEE[detectedCurrency] : null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await onSave(formData);
      // Switch site currency to match the saved country
      if (detectedCurrency) {
        Cookies.set(CURRENCY_COOKIE, detectedCurrency, {
          expires: 365,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      }
      window.location.reload();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-zinc-700 rounded-lg p-6 space-y-4 bg-zinc-900/20"
    >
      {editAddress && <input type="hidden" name="id" value={editAddress.id} />}

      {/* Country — first, drives currency detection */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Country <span className="text-red-400">*</span>
        </label>
        <select
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className={inputCls}
        >
          <option value="">Select country…</option>
          {EUROPEAN_COUNTRIES.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Live shipping / currency info panel */}
      {detectedCurrency && shippingFee !== null && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 space-y-2.5 font-mono text-sm">
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest">// shipping.info</p>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Currency</span>
            <span className="font-semibold text-green-400">
              {detectedCurrency === "CHF" ? "🇨🇭" : "🇪🇺"} {detectedCurrency}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-zinc-400">Standard shipping</span>
            <span className="text-zinc-300">{formatPrice(shippingFee, detectedCurrency)}</span>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
            <span className="text-zinc-400">Free shipping from</span>
            <span className="text-green-400 font-semibold">
              {formatPrice(FREE_SHIPPING_THRESHOLD, detectedCurrency)}
            </span>
          </div>
        </div>
      )}

      {/* Address line 1 */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Address line 1 <span className="text-red-400">*</span>
        </label>
        <input
          name="line1"
          type="text"
          defaultValue={editAddress?.line1 ?? ""}
          required
          placeholder="Street and number"
          className={inputCls}
        />
      </div>

      {/* Address line 2 */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
          Address line 2
        </label>
        <input
          name="line2"
          type="text"
          defaultValue={editAddress?.line2 ?? ""}
          placeholder="Apartment, floor, etc. (optional)"
          className={inputCls}
        />
      </div>

      {/* City + Postal code */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
            City <span className="text-red-400">*</span>
          </label>
          <input
            name="city"
            type="text"
            defaultValue={editAddress?.city ?? ""}
            required
            className={inputCls}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Postal code <span className="text-red-400">*</span>
          </label>
          <input
            name="postalCode"
            type="text"
            defaultValue={editAddress?.postalCode ?? ""}
            required
            className={inputCls}
          />
        </div>
      </div>

      {/* State / Region */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
          State / Region
        </label>
        <input
          name="state"
          type="text"
          defaultValue={editAddress?.state ?? ""}
          placeholder="Optional"
          className={inputCls}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold px-5 py-2.5 rounded-md text-sm transition-colors"
        >
          {isPending ? "…" : "Save address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white font-medium px-5 py-2.5 rounded-md text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
