import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import cake136 from "@/assets/cake-136.png.asset.json";
import cake137 from "@/assets/cake-137.png.asset.json";
import cake138 from "@/assets/cake-138.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bake and Bouffees | Order Luxury Cakes Online" },
      {
        name: "description",
        content:
          "Order custom cakes, cupcakes and baking hampers from Bake and Bouffees. Choose flavour, size and get it delivered fresh.",
      },
      { property: "og:title", content: "Bake and Bouffees | Order Luxury Cakes Online" },
      {
        property: "og:description",
        content:
          "Handcrafted custom cakes, cupcakes and baking hampers. Pick your flavour and size, and place your order in minutes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Category = "Custom Cakes" | "Cupcakes" | "Baking Hampers";

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
};

const FLAVORS = ["Vanilla", "Chocolate", "Red Velvet"];
const SIZES = ["0.5 Kg", "1 Kg", "2 Kg"];
const DEFAULT_FLAVOR = "Vanilla";
const DEFAULT_SIZE = "0.5 Kg";
const CATEGORIES: Category[] = ["Custom Cakes", "Cupcakes", "Baking Hampers"];

const ITEMS: Item[] = [
  {
    id: "tiered-blush",
    name: "Blush Tiered Celebration",
    description: "Two-tier buttercream petals with silver pearls on a gold board.",
    price: 4500,
    image: cake136.url,
    category: "Custom Cakes",
  },
  {
    id: "gold-leaf-heart",
    name: "Rose & Gold Leaf",
    description: "Hand-painted pink marble finish, edible gold leaf and fresh roses.",
    price: 2800,
    image: cake137.url,
    category: "Custom Cakes",
  },
  {
    id: "rosette-cream",
    name: "Classic Rosette Cream",
    description: "Vanilla sponge, whipped rosettes, roasted nuts and rose petals.",
    price: 1500,
    image: cake138.url,
    category: "Custom Cakes",
  },
  {
    id: "petal-cupcakes",
    name: "Petal Swirl Cupcakes (Box of 6)",
    description: "Soft pastel swirls finished with pearl sprinkles.",
    price: 750,
    image: cake136.url,
    category: "Cupcakes",
  },
  {
    id: "gold-cupcakes",
    name: "Gold Dust Cupcakes (Box of 12)",
    description: "Rich cocoa base with gold-dusted buttercream crowns.",
    price: 1400,
    image: cake137.url,
    category: "Cupcakes",
  },
  {
    id: "hamper-signature",
    name: "Signature Baking Hamper",
    description: "Mini cake, brownies, cookies and a bloom box, gift wrapped.",
    price: 2200,
    image: cake138.url,
    category: "Baking Hampers",
  },
  {
    id: "hamper-celebration",
    name: "Celebration Grand Hamper",
    description: "Tiered mini cake, macarons, truffles and candles in a gold trunk.",
    price: 3500,
    image: cake136.url,
    category: "Baking Hampers",
  },
];

type CartLine = {
  key: string;
  name: string;
  flavor: string;
  size: string;
  price: number;
  qty: number;
};

const SIZE_MULTIPLIER: Record<string, number> = { "0.5 Kg": 1, "1 Kg": 1.6, "2 Kg": 2.8 };

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

function App() {
  const [category, setCategory] = useState<Category>("Custom Cakes");
  const [options, setOptions] = useState<Record<string, { flavor: string; size: string }>>({});
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", address: "" });

  const count = cart.reduce((s, l) => s + l.qty, 0);
  const total = cart.reduce((s, l) => s + l.qty * l.price, 0);
  const visible = useMemo(() => ITEMS.filter((i) => i.category === category), [category]);

  const optFor = (id: string) => options[id] ?? { flavor: DEFAULT_FLAVOR, size: DEFAULT_SIZE };

  const setOpt = (id: string, patch: Partial<{ flavor: string; size: string }>) =>
    setOptions((prev) => ({ ...prev, [id]: { ...optFor(id), ...patch } }));

  const addToCart = (item: Item) => {
    const { flavor, size } = optFor(item.id);
    const price = item.price * (SIZE_MULTIPLIER[size] ?? 1);
    const key = `${item.id}-${flavor}-${size}`;
    setCart((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { key, name: item.name, flavor, size, price, qty: 1 }];
    });
    setOrderPlaced(null);
  };

  const changeQty = (key: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );

  const placeOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(form.name.trim().split(" ")[0] || "there");
    setCart([]);
    setForm({ name: "", phone: "", date: "", address: "" });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto grid max-w-3xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-semibold leading-tight">
              Bake and <span className="gold-text">Bouffees</span>
            </p>
            <p className="truncate text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Patisserie & Gifting
            </p>
          </div>
          <a
            href="#cart"
            className="relative shrink-0 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
          >
            Cart
            <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
              {count}
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4">
        <section className="relative mt-4 overflow-hidden rounded-3xl">
          <img
            src={cake136.url}
            alt="Two-tier blush pink celebration cake with buttercream petals"
            className="h-[380px] w-full object-cover sm:h-[460px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">
              Baked fresh, made to order
            </p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-background sm:text-5xl">
              Celebrations that taste as good as they look
            </h1>
            <a href="#catalog" className="btn-luxe mt-5 inline-block px-6 py-3 text-sm">
              EXPLORE THE MENU
            </a>
          </div>
        </section>

        <section id="catalog" className="mt-10 scroll-mt-20">
          <h2 className="text-center font-display text-3xl">Our Catalog</h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Choose your flavour and size — we bake it fresh for your date.
          </p>

          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  category === c
                    ? "btn-blush"
                    : "border border-border bg-card text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {visible.map((item) => {
              const o = optFor(item.id);
              return (
                <article key={item.id} className="surface-card overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-52 w-full object-cover"
                  />
                  <div className="p-4">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <h3 className="min-w-0 font-display text-xl leading-snug">{item.name}</h3>
                      <span className="shrink-0 font-semibold text-primary">{inr(item.price)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Select Flavor
                        <select
                          className="field mt-1"
                          value={o.flavor}
                          onChange={(e) => setOpt(item.id, { flavor: e.target.value })}
                        >
                          {FLAVORS.map((f) => (
                            <option key={f}>{f}</option>
                          ))}
                        </select>
                      </label>
                      <label className="text-xs font-medium text-muted-foreground">
                        Select Size
                        <select
                          className="field mt-1"
                          value={o.size}
                          onChange={(e) => setOpt(item.id, { size: e.target.value })}
                        >
                          {SIZES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <button
                      onClick={() => addToCart(item)}
                      className="btn-luxe mt-4 w-full py-3 text-sm"
                    >
                      ADD TO CART · {inr(item.price * (SIZE_MULTIPLIER[o.size] ?? 1))}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="cart" className="mt-12 scroll-mt-20">
          <h2 className="font-display text-3xl">Your Cart</h2>
          {cart.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing added yet — pick something sweet above.
            </p>
          ) : (
            <div className="surface-card mt-4 divide-y divide-border p-4">
              {cart.map((l) => (
                <div
                  key={l.key}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{l.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {l.flavor} · {l.size} · {inr(l.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => changeQty(l.key, -1)}
                      aria-label="Decrease quantity"
                      className="h-8 w-8 rounded-full border border-border"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{l.qty}</span>
                    <button
                      onClick={() => changeQty(l.key, 1)}
                      aria-label="Increase quantity"
                      className="h-8 w-8 rounded-full border border-border"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 font-display text-xl">
                <span>Total</span>
                <span className="gold-text font-semibold">{inr(total)}</span>
              </div>
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-3xl">Checkout</h2>
          {orderPlaced ? (
            <div className="surface-card mt-4 p-6 text-center">
              <p className="font-display text-2xl">Thank you, {orderPlaced}! 🎂</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your order has been placed successfully. Our team will call you shortly to confirm
                the details and delivery slot.
              </p>
              <button
                onClick={() => setOrderPlaced(null)}
                className="btn-blush mt-5 px-6 py-2.5 text-sm"
              >
                Place another order
              </button>
            </div>
          ) : (
            <form onSubmit={placeOrder} className="surface-card mt-4 grid gap-4 p-5">
              <label className="text-sm font-medium">
                Name
                <input
                  required
                  className="field mt-1"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                />
              </label>
              <label className="text-sm font-medium">
                Phone Number
                <input
                  required
                  type="tel"
                  pattern="[0-9+\s-]{8,15}"
                  className="field mt-1"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="98765 43210"
                />
              </label>
              <label className="text-sm font-medium">
                Delivery Date
                <input
                  required
                  type="date"
                  className="field mt-1"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </label>
              <label className="text-sm font-medium">
                Address
                <textarea
                  required
                  rows={3}
                  className="field mt-1"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Flat, street, landmark, city, pincode"
                />
              </label>
              <button
                type="submit"
                disabled={cart.length === 0}
                className="btn-luxe w-full py-4 text-sm"
              >
                PLACE ORDER {cart.length > 0 ? `· ${inr(total)}` : ""}
              </button>
              {cart.length === 0 && (
                <p className="text-center text-xs text-muted-foreground">
                  Add at least one item to your cart to place an order.
                </p>
              )}
            </form>
          )}
        </section>

        <footer className="mt-14 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <p className="font-display text-base text-foreground">Bake and Bouffees</p>
          <p className="mt-1">Freshly baked in small batches · Orders 48 hrs in advance</p>
        </footer>
      </main>
    </div>
  );
}
