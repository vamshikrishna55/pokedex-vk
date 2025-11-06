import React, { useEffect, useMemo, useRef, useState } from "react";

// ---- Lightweight UI primitives (no shadcn, no aliases) ----
function clsx(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "ghost";
};
function Button({ className = "", variant = "solid", ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-3 py-2 rounded-lg text-sm font-semibold border transition",
        variant === "solid"
          ? "bg-slate-800 text-white border-white/10 hover:bg-slate-700"
          : "bg-transparent border-slate-300 hover:bg-slate-100",
        className,
      )}
      {...rest}
    />
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
function Input({ className = "", ...rest }: InputProps) {
  return (
    <input
      className={clsx(
        "h-10 w-full rounded-lg border px-3 text-sm outline-none",
        "bg-white/90 border-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-400",
        className,
      )}
      {...rest}
    />
  );
}

function Card({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("rounded-2xl border", className)} {...rest} />;
}
function CardContent({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("p-4", className)} {...rest} />;
}

function Badge({ className = "", ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
        className,
      )}
      {...rest}
    />
  );
}

// Minimal Dialog
function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (v: boolean) => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={() => onOpenChange(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
function DialogContent({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("w-full max-w-3xl rounded-2xl", className)} {...rest} />;
}
function DialogHeader({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx("mb-3", className)} {...rest} />;
}
function DialogTitle({ className = "", ...rest }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx("text-xl font-bold", className)} {...rest} />;
}

// ---- Icons (inline SVG so no external packages) ----
const IconSearch = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IconX = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// Spinner
function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <span className={clsx("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", className)} />;
}

// ---- Utility helpers ----
const POKE_API = "https://pokeapi.co/api/v2";
const isDev: boolean = Boolean((import.meta as any)?.env?.DEV);

function toTitle(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function uniqTruthy<T>(arr: (T | null | undefined)[]): T[] {
  return Array.from(new Set(arr.filter(Boolean) as T[]));
}
async function getJson(url: string, signal?: AbortSignal) {
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ---- Display filter groups (maps to multiple real types) ----
const TYPE_GROUPS: { id: string; label: string; members: string[] }[] = [
  { id: "normal", label: "Normal", members: ["normal", "fairy"] },
  { id: "fire", label: "Fire", members: ["fire", "steel"] },
  { id: "water", label: "Water", members: ["water", "ice"] },
  { id: "grass", label: "Grass", members: ["grass", "bug"] },
  { id: "electric", label: "Electric", members: ["electric"] },
  { id: "rock-ground", label: "Rock / Ground", members: ["rock", "ground", "fighting"] },
  { id: "psychic-dark", label: "Psychic / Dark", members: ["psychic", "ghost", "dark"] },
  { id: "flying-dragon", label: "Flying / Dragon", members: ["flying", "dragon", "poison"] },
];

const typeColors: Record<string, string> = {
  normal: "bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-800",
  fire: "bg-gradient-to-r from-orange-400 to-red-500 text-white",
  water: "bg-gradient-to-r from-sky-400 to-blue-600 text-white",
  grass: "bg-gradient-to-r from-emerald-400 to-green-600 text-white",
  electric: "bg-gradient-to-r from-yellow-300 to-amber-500 text-black",
  ice: "bg-gradient-to-r from-cyan-200 to-cyan-400 text-black",
  fighting: "bg-gradient-to-r from-rose-400 to-rose-600 text-white",
  poison: "bg-gradient-to-r from-fuchsia-500 to-purple-700 text-white",
  ground: "bg-gradient-to-r from-amber-300 to-yellow-600 text-black",
  flying: "bg-gradient-to-r from-indigo-300 to-indigo-500 text-white",
  psychic: "bg-gradient-to-r from-pink-400 to-pink-600 text-white",
  bug: "bg-gradient-to-r from-lime-300 to-lime-600 text-black",
  rock: "bg-gradient-to-r from-stone-400 to-stone-600 text-white",
  ghost: "bg-gradient-to-r from-violet-500 to-indigo-800 text-white",
  dark: "bg-gradient-to-r from-neutral-700 to-neutral-900 text-white",
  dragon: "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white",
  steel: "bg-gradient-to-r from-slate-300 to-slate-500 text-black",
  fairy: "bg-gradient-to-r from-rose-300 to-rose-500 text-white",
};

// ---- Types ----
interface BasicPokemon {
  name: string;
  id: number;
  sprite: string;
  types: string[];
}

interface FullPokemon extends BasicPokemon {
  height: number; // decimeters
  weight: number; // hectograms
  stats: { name: string; base: number }[];
  abilities: string[];
  evolution: BasicPokemon[]; // ordered from base -> final
  images: string[]; // additional gallery images
}

// ---- Simple caches ----
const TYPE_MEMBERS_CACHE = new Map<string, string[]>();
const SPECIES_BASE_CACHE = new Map<string, boolean>();

// ---- Animated GIF hover (optional, will fallback) ----
const GIF_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/";
const GIF_SUPPORT_CACHE = new Map<number, boolean>();
function getAnimatedGifUrl(id: number) {
  return `${GIF_BASE}${id}.gif`;
}

interface PokemonCardProps {
  p: BasicPokemon;
  isNight: boolean;
  isTypeSelected: (t: string) => boolean;
  onOpen: (p: BasicPokemon) => void;
}

function PokemonCard({ p, isNight, isTypeSelected, onOpen }: PokemonCardProps) {
  const [hover, setHover] = useState(false);
  const [gifReady, setGifReady] = useState(false);
  const [gifSupported, setGifSupported] = useState(
    GIF_SUPPORT_CACHE.has(p.id) ? !!GIF_SUPPORT_CACHE.get(p.id) : true,
  );

  useEffect(() => {
    if (!hover || !gifSupported) return;
    const url = getAnimatedGifUrl(p.id);
    const img = new Image();
    img.onload = () => {
      GIF_SUPPORT_CACHE.set(p.id, true);
      setGifReady(true);
    };
    img.onerror = () => {
      GIF_SUPPORT_CACHE.set(p.id, false);
      setGifSupported(false);
      setGifReady(false);
    };
    img.src = url;
    return () => {
      (img.onload as any) = null;
      (img.onerror as any) = null;
    };
  }, [hover, gifSupported, p.id]);

  const displaySrc = hover && gifReady && gifSupported ? getAnimatedGifUrl(p.id) : p.sprite;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="transition"
    >
      <Card
        className={clsx(
          "group cursor-pointer border shadow-sm transition transform hover:-translate-y-1 hover:scale-[1.04]",
          isNight
            ? "bg-slate-900/70 border-white/10 hover:border-white/30 hover:shadow-emerald-500/20"
            : "bg-white border-slate-300 hover:border-slate-400 hover:shadow-slate-400/30",
        )}
        onClick={() => onOpen(p)}
      >
        <CardContent className="pt-3 h-[300px] flex flex-col">
          <div className="h-[140px] grid place-items-center">
            <img
              src={displaySrc}
              alt={p.name}
              className="h-28 w-28 image-render-pixel"
              loading="lazy"
              onError={() => {
                setGifSupported(false);
                setGifReady(false);
              }}
            />
          </div>
          <div
            className={clsx(
              "mt-2 text-center font-semibold transition min-h-[28px]",
              isNight ? "group-hover:text-emerald-300 text-slate-100" : "group-hover:text-emerald-600 text-slate-800",
            )}
          >
            {toTitle(p.name)}
          </div>
          <div className="flex justify-center gap-1 mt-1 flex-wrap min-h-[44px]">
            {p.types.map((t) => (
              <Badge
                key={t}
                className={clsx(
                  isNight ? "border-white/10 bg-slate-900" : "border-slate-300 bg-white",
                  isTypeSelected(t) ? "opacity-100" : "opacity-80",
                )}
              >
                {toTitle(t)}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export function DayNightToggle({
  isNight,
  onToggle,
}: { isNight: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
      onClick={onToggle}
      className={`relative h-12 w-24 rounded-full overflow-hidden border border-white/10 outline-none transition-all duration-700
        ${isNight
          ? "bg-gradient-to-r from-sky-900 via-sky-700 to-blue-800 shadow-[inset_0_0_20px_rgba(0,0,0,.4)]"
          : "bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 shadow-lg"
        }`}
    >
      {/* background glow pulse */}
      <span
        className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-all duration-1000
          ${isNight ? "bg-blue-900/50 animate-pulse" : "bg-yellow-200/60 animate-pulse"}
        `}
      />

      {/* Twinkling stars (night mode only) */}
      {isNight && (
        <>
          <span className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-twinkle" />
          <span className="absolute top-6 left-16 w-1 h-1 bg-white rounded-full animate-twinkle delay-300" />
          <span className="absolute top-2 right-6 w-1 h-1 bg-white rounded-full animate-twinkle delay-700" />
        </>
      )}

      {/* Toggle knob */}
      <span
        className={`absolute top-1 h-10 w-10 rounded-full grid place-items-center transform transition-all duration-700
          ${isNight
            ? "translate-x-[3rem] bg-amber-200 shadow-[0_0_15px_rgba(255,200,0,0.6)] scale-110"
            : "translate-x-1 bg-sky-200 shadow-[0_0_10px_rgba(100,200,255,0.5)] scale-100"
          }`}
      >
        {isNight ? (
          // Moon icon 🌙
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-slate-900 transition-transform duration-700 rotate-180"
          >
            <path
              fill="currentColor"
              d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
            />
          </svg>
        ) : (
          // Sun icon ☀️
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-yellow-600 animate-spin-slow"
          >
            <circle cx="12" cy="12" r="4" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="12" y1="1.5" x2="12" y2="5" />
              <line x1="12" y1="19" x2="12" y2="22.5" />
              <line x1="1.5" y1="12" x2="5" y2="12" />
              <line x1="19" y1="12" x2="22.5" y2="12" />
              <line x1="4.22" y1="4.22" x2="6.7" y2="6.7" />
              <line x1="17.3" y1="17.3" x2="19.78" y2="19.78" />
              <line x1="17.3" y1="6.7" x2="19.78" y2="4.22" />
              <line x1="4.22" y1="19.78" x2="6.7" y2="17.3" />
            </g>
          </svg>
        )}
      </span>

      {/* Tailwind keyframe animations */}
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }
          .animate-twinkle {
            animation: twinkle 2s infinite ease-in-out;
          }
          .animate-spin-slow {
            animation: spin 10s linear infinite;
          }
        `}
      </style>
    </button>
  );
}


// ---- Main App ----
export default function PokedexApp() {
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set()); // group ids
  const [isNight, setIsNight] = useState(true);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [pokemons, setPokemons] = useState<BasicPokemon[]>([]);
  const [page, setPage] = useState(0);
  const pageSize = 24;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<FullPokemon | null>(null);
  const [slide, setSlide] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [search]);

  // Helper: does selected group set include a given raw type?
  const isTypeSelected = (t: string) => {
    if (selectedTypes.size === 0) return false;
    for (const gid of selectedTypes) {
      const g = TYPE_GROUPS.find((x) => x.id === gid);
      if (g && g.members.includes(t)) return true;
    }
    return false;
  };

  // Fetch pokemons when filters/search change (base forms only)
  useEffect(() => {
    (async () => {
      setLoading(true);
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const selected = Array.from(selectedTypes);
        let candidateNames: string[] = [];

        if (selected.length > 0) {
          for (const gid of selected) {
            const group = TYPE_GROUPS.find((g) => g.id === gid);
            const members = group ? group.members : [gid];
            for (const t of members) {
              const typeMembers = await getTypeMembers(t, ctrl.signal);
              candidateNames = Array.from(new Set([...candidateNames, ...typeMembers]));
            }
          }
        } else {
          const limit = 300;
          const data = await getJson(`${POKE_API}/pokemon?limit=${limit}`, ctrl.signal);
          candidateNames = (data?.results ?? []).map((r: any) => r.name);
        }

        if (debouncedSearch) {
          candidateNames = candidateNames.filter((n) => n.includes(debouncedSearch));
          // Bonus: if searching exact evolved name, resolve its base and include it
          const baseFromExact = await resolveBaseFromAny(debouncedSearch, ctrl.signal);
          if (baseFromExact) candidateNames = Array.from(new Set([...candidateNames, baseFromExact]));
        }

        let baseNames = await filterToBaseFormsCached(candidateNames, ctrl.signal);
        baseNames = baseNames.sort((a, b) => a.localeCompare(b));

        setPage(0);
        const slice = baseNames.slice(0, pageSize);
        const detailed = await fetchManyBasics(slice, ctrl.signal);
        setPokemons(detailed);
      } catch (e) {
        if ((e as any).name !== "AbortError") console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedTypes, debouncedSearch]);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);
    const ctrl = abortRef.current ?? new AbortController();
    try {
      const selected = Array.from(selectedTypes);
      let candidateNames: string[] = [];

      if (selected.length > 0) {
        for (const gid of selected) {
          const group = TYPE_GROUPS.find((g) => g.id === gid);
          const members = group ? group.members : [gid];
          for (const t of members) {
            const typeMembers = await getTypeMembers(t, ctrl.signal);
            candidateNames = Array.from(new Set([...candidateNames, ...typeMembers]));
          }
        }
      } else {
        const limit = 300;
        const data = await getJson(`${POKE_API}/pokemon?limit=${limit}`, ctrl.signal);
        candidateNames = (data?.results ?? []).map((r: any) => r.name);
      }

      if (debouncedSearch) {
        candidateNames = candidateNames.filter((n) => n.includes(debouncedSearch));
        const baseFromExact = await resolveBaseFromAny(debouncedSearch, ctrl.signal);
        if (baseFromExact) candidateNames = Array.from(new Set([...candidateNames, baseFromExact]));
      }

      let baseNames = await filterToBaseFormsCached(candidateNames, ctrl.signal);
      baseNames = baseNames.sort((a, b) => a.localeCompare(b));

      const nextPage = page + 1;
      const slice = baseNames.slice(nextPage * pageSize, (nextPage + 1) * pageSize);
      const detailed = await fetchManyBasics(slice, ctrl.signal);
      setPokemons((prev) => [...prev, ...detailed]);
      setPage(nextPage);
    } catch (e) {
      if ((e as any).name !== "AbortError") console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Active (modal) loader
  const openDetails = async (p: BasicPokemon) => {
    setOpen(true);
    setActive(null);
    setSlide(0);
    try {
      const [full, evo] = await Promise.all([fetchFull(p.name), fetchEvolutionChain(p.name)]);
      setActive({ ...full, evolution: evo });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleType = (id: string) => {
    setSelectedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const hasMore = useMemo(() => {
    return pokemons.length > 0 && pokemons.length % pageSize === 0;
  }, [pokemons]);

  function handleHomeClick() {
    setSelectedTypes(new Set());
    setSearch("");
    setPage(0);
  }

  return (
    <div
      className={clsx(
        "min-h-screen overscroll-none",
        isNight
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100"
          : "bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 text-slate-900",
      )}
    >
      {isNight && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-vector/ice-rink-night-empty-public-place-skating_107791-3103.jpg')",
          }}
        />
      )}

      <header
        className={clsx(
          "sticky top-0 z-40 backdrop-blur border-b",
          isNight ? "supports-[backdrop-filter]:bg-slate-900/70 border-white/10" : "supports-[backdrop-filter]:bg-white/70 border-slate-300",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={handleHomeClick}>
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="pokeball"
              className="h-8 w-8"
            />
            <div className="leading-none">
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,.35)]">
                Poƙedêx
              </h1>
              <div className="text-center text-xs mt-1 opacity-80">—— vk ——</div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">
              <IconSearch className={clsx("absolute left-3 top-2.5 h-5 w-5", isNight ? "text-slate-400" : "text-slate-500")} />
              <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pokemon Base"
              spellCheck={false}
              className={clsx(
                "w-full h-10 rounded-lg pl-10 outline-none transition border focus:ring-2",
                isNight
                  ? "bg-slate-800/80 border-white/10 text-slate-100 placeholder:text-slate-400 caret-emerald-400 focus:ring-emerald-500/60"
                  : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-500 caret-emerald-600 focus:ring-emerald-500/30",
              )}
            />
            </div>
            <DayNightToggle isNight={isNight} onToggle={() => setIsNight((n) => !n)} />

            {isDev && (
              <Button onClick={() => console.log("DEV mode")}>DEV</Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Type filters */}
        <section className="mb-4">
          <div className="flex flex-wrap gap-2">
            {TYPE_GROUPS.map((g) => (
              <button
                key={g.id}
                onClick={() => toggleType(g.id)}
                className={clsx(
                  "px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-transform active:scale-95",
                  isNight ? "border-white/10" : "border-slate-300",
                  selectedTypes.has(g.id)
                    ? "bg-emerald-600 text-white"
                    : isNight
                    ? "bg-slate-800 hover:bg-slate-700"
                    : "bg-white hover:bg-slate-100",
                )}
                title={`Filter group: ${g.label}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </section>

        {/* Grid */}
        <section>
          {loading && pokemons.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <Spinner className="h-6 w-6 mr-2" /> Loading Pokémon...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pokemons.map((p) => (
                <PokemonCard key={p.id} p={p} isNight={isNight} isTypeSelected={isTypeSelected} onOpen={openDetails} />
              ))}
            </div>
          )}
          <div className="flex items-center justify-center mt-6">
            {hasMore && (
              <Button
                onClick={loadMore}
                disabled={loading}
                className={clsx(
                  isNight ? "bg-slate-800 border-white/10 hover:bg-slate-700" : "bg-white border-slate-300 hover:bg-slate-100",
                )}
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" /> Loading...
                  </>
                ) : (
                  <>
                    Load more <IconChevronRight className="h-4 w-4 ml-1 inline" />
                  </>
                )}
              </Button>
            )}
          </div>
        </section>
      </main>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={clsx("border p-4", isNight ? "bg-slate-900 border-white/10" : "bg-white border-slate-300")}> 
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {active ? (
                <>
                  <img src={active.sprite} alt={active.name} className="h-10 w-10" />
                  <span>{toTitle(active.name)}</span>
                </>
              ) : (
                <span>Loading...</span>
              )}
            </DialogTitle>
          </DialogHeader>
          {!active ? (
            <div className="flex items-center justify-center py-10">
              <Spinner className="h-6 w-6 mr-2" /> Fetching details
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className={clsx("rounded-2xl p-4 border", isNight ? "bg-slate-800/60 border-white/10" : "bg-slate-100 border-slate-300")}> 
                  <div className="relative">
                    <div className={clsx("overflow-hidden rounded-2xl border", isNight ? "border-white/10" : "border-slate-300")}> 
                      {active.images && active.images.length > 0 ? (
                        <img key={active.images[slide]} src={active.images[slide]} alt={`${active.name}-image-${slide}`} className="h-40 w-40 object-contain" />
                      ) : (
                        <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${active.id}.png`} alt={active.name} className="h-40 w-40" />
                      )}
                    </div>
                    {active.images && active.images.length > 1 && (
                      <div className="absolute inset-0 flex items-center justify-between px-1">
                        <button
                          onClick={() => setSlide((s) => (s - 1 + active.images.length) % active.images.length)}
                          className="h-8 w-8 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white"
                          aria-label="Previous image"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => setSlide((s) => (s + 1) % active.images.length)}
                          className="h-8 w-8 grid place-items-center rounded-full bg-black/40 hover:bg-black/60 text-white"
                          aria-label="Next image"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                  {active.images && active.images.length > 1 && (
                    <div className="mt-3 flex gap-2 flex-wrap max-w-[280px]">
                      {active.images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSlide(i)}
                          className={clsx(
                            "h-10 w-10 rounded-lg border",
                            i === slide ? "border-emerald-400" : isNight ? "border-white/10 hover:border-white/30" : "border-slate-300 hover:border-slate-400",
                          )}
                        >
                          <img src={img} alt={active.name + " thumb " + i} className="h-10 w-10 object-contain" />
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {active.types.map((t) => (
                      <span key={t} className={clsx("px-3 py-1 rounded-full text-xs font-semibold", typeColors[t] ?? (isNight ? "bg-slate-700" : "bg-slate-200"))}> 
                        {toTitle(t)}
                      </span>
                    ))}
                  </div>
                  <div className={clsx("mt-4 text-sm", isNight ? "text-slate-300" : "text-slate-700")}> 
                    <div>
                      <strong>Height:</strong> {active.height / 10} m
                    </div>
                    <div>
                      <strong>Weight:</strong> {active.weight / 10} kg
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div className={clsx("rounded-2xl p-4 border", isNight ? "bg-slate-800/60 border-white/10" : "bg-slate-100 border-slate-300")}>
                  <h3 className="font-semibold mb-3">Base Stats</h3>
                  <div className="space-y-2">
                    {active.stats.map((s) => (
                      <div key={s.name} className="text-sm">
                        <div className="flex items-center justify-between">
                          <span className={clsx("w-28", isNight ? "text-slate-300" : "text-slate-700")}>{toTitle(s.name.replace("-", " "))}</span>
                          <span className={clsx("font-semibold", isNight ? "text-slate-200" : "text-slate-900")}>{s.base}</span>
                        </div>
                        <div className={clsx("h-2 rounded", isNight ? "bg-slate-700" : "bg-slate-200")}>
                          <div className="h-2 rounded bg-emerald-500" style={{ width: `${Math.min(100, (s.base / 180) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={clsx("rounded-2xl p-4 border", isNight ? "bg-slate-800/60 border-white/10" : "bg-slate-100 border-slate-300")}>
                  <h3 className="font-semibold mb-3">Abilities</h3>
                  <div className="flex flex-wrap gap-2">
                    {active.abilities.map((a) => (
                      <Badge key={a} className={clsx(isNight ? "bg-slate-900 border-white/10" : "bg-white border-slate-300")}>
                        {toTitle(a.replace("-", " "))}
                      </Badge>
                    ))}
                  </div>
                </div>
                {active.evolution && active.evolution.length > 0 && (
                  <div className={clsx("rounded-2xl p-4 border", isNight ? "bg-slate-800/60 border-white/10" : "bg-slate-100 border-slate-300")}>
                    <h3 className="font-semibold mb-3">Evolution Chain</h3>
                    <div className="flex items-stretch gap-3 overflow-x-auto pb-2">
                      {active.evolution.map((evo) => (
                        <button
                          key={evo.id}
                          onClick={() => openDetails(evo)}
                          className={clsx(
                            "min-w-[140px] border rounded-xl p-3 text-left transition",
                            isNight ? "bg-slate-900/60 border-white/10 hover:border-white/20" : "bg-white border-slate-300 hover:border-slate-400",
                            evo.id === active.id && "ring-2 ring-emerald-400/60",
                          )}
                          title={`Open ${toTitle(evo.name)}`}
                        >
                          <div className="grid place-items-center">
                            <img src={evo.sprite} alt={evo.name} className="h-20 w-20" />
                          </div>
                          <div className="mt-2 font-semibold">{toTitle(evo.name)}</div>
                          <div className="mt-1 flex gap-1 flex-wrap">
                            {evo.types.map((t) => (
                              <Badge key={t} className={clsx(isNight ? "bg-slate-950 border-white/10" : "bg-slate-100 border-slate-300")}>{toTitle(t)}</Badge>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <Button
            onClick={() => setOpen(false)}
            className={clsx("mt-4 w-full", isNight ? "bg-slate-800 hover:bg-slate-700 border-white/10" : "bg-white hover:bg-slate-100 border-slate-300")}
          >
            <IconX className="h-4 w-4 mr-2 inline" /> Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Data fetchers ----
async function fetchManyBasics(names: string[], signal?: AbortSignal): Promise<BasicPokemon[]> {
  const fetches = names.map(async (n) => {
    try {
      const d = await getJson(`${POKE_API}/pokemon/${n}`, signal);
      if (!d) return null;
      return {
        name: d.name,
        id: d.id,
        sprite: d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default,
        types: d.types?.map((t: any) => t.type.name) ?? [],
      } as BasicPokemon;
    } catch {
      return null;
    }
  });
  const results = await Promise.all(fetches);
  return results.filter((x): x is BasicPokemon => Boolean(x));
}

async function fetchFull(name: string): Promise<FullPokemon> {
  const d = await getJson(`${POKE_API}/pokemon/${name}`);
  if (!d) throw new Error(`Failed to fetch pokemon ${name}`);
  const imgList = uniqTruthy([
    d.sprites?.other?.["official-artwork"]?.front_default,
    d.sprites?.other?.home?.front_default,
    d.sprites?.other?.home?.front_shiny,
    d.sprites?.other?.dream_world?.front_default,
    d.sprites?.front_default,
    d.sprites?.back_default,
    d.sprites?.front_shiny,
    d.sprites?.back_shiny,
  ]);
  return {
    name: d.name,
    id: d.id,
    sprite: d.sprites?.other?.["official-artwork"]?.front_default || d.sprites?.front_default,
    types: d.types?.map((t: any) => t.type.name) ?? [],
    height: d.height,
    weight: d.weight,
    stats: d.stats?.map((s: any) => ({ name: s.stat.name, base: s.base_stat })) ?? [],
    abilities: d.abilities?.map((a: any) => a.ability.name) ?? [],
    evolution: [],
    images: imgList,
  };
}

// Fetch evolution chain (base -> final) as BasicPokemon[]
async function fetchEvolutionChain(name: string, signal?: AbortSignal): Promise<BasicPokemon[]> {
  try {
    const species = await getJson(`${POKE_API}/pokemon-species/${name}`, signal);
    const evoUrl: string | undefined = species?.evolution_chain?.url;
    if (!evoUrl) return [];
    const chain = await getJson(evoUrl, signal);
    if (!chain) return [];

    const names: string[] = [];
    function walk(node: any) {
      if (!node) return;
      names.push(node.species?.name);
      if (node.evolves_to && node.evolves_to.length > 0) {
        for (const child of node.evolves_to) walk(child);
      }
    }
    walk(chain.chain);

    const unique = Array.from(new Set(names.filter(Boolean)));
    const basics = await fetchManyBasics(unique, signal);
    return basics;
  } catch {
    return [];
  }
}

// ---- Base-form helpers ----
async function getTypeMembers(type: string, signal?: AbortSignal): Promise<string[]> {
  if (TYPE_MEMBERS_CACHE.has(type)) return TYPE_MEMBERS_CACHE.get(type)!;
  try {
    const data = await getJson(`${POKE_API}/type/${type}`, signal);
    const names: string[] = data?.pokemon?.map((p: any) => p.pokemon.name) ?? [];
    TYPE_MEMBERS_CACHE.set(type, names);
    return names;
  } catch {
    TYPE_MEMBERS_CACHE.set(type, []);
    return [];
  }
}

async function isBaseForm(name: string, signal?: AbortSignal): Promise<boolean> {
  if (SPECIES_BASE_CACHE.has(name)) return SPECIES_BASE_CACHE.get(name)!;
  try {
    const species = await getJson(`${POKE_API}/pokemon-species/${name}`, signal);
    const base = Boolean(species) && species!.evolves_from_species === null;
    SPECIES_BASE_CACHE.set(name, base);
    return base;
  } catch {
    SPECIES_BASE_CACHE.set(name, false);
    return false;
  }
}

async function filterToBaseForms(names: string[], signal?: AbortSignal): Promise<string[]> {
  const unique = Array.from(new Set((names || []).filter(Boolean).map((n) => n.toLowerCase())));
  if (unique.length === 0) return [];

  const checks = await Promise.all(unique.map(async (n) => ({ n, base: await isBaseForm(n, signal) })));
  return checks.filter((c) => c.base).map((c) => c.n);
}

async function filterToBaseFormsCached(names: string[], signal?: AbortSignal): Promise<string[]> {
  return filterToBaseForms(names, signal);
}

// resolve base for an exact species name if it exists
async function resolveBaseFromAny(name: string, signal?: AbortSignal): Promise<string | null> {
  try {
    let s = await getJson(`${POKE_API}/pokemon-species/${name}`, signal);
    if (!s) return null;
    let cur = s;
    while (cur && cur.evolves_from_species) {
      const parent = cur.evolves_from_species?.name as string | undefined;
      if (!parent) break;
      cur = await getJson(`${POKE_API}/pokemon-species/${parent}`, signal);
    }
    return cur?.name ?? null;
  } catch {
    return null;
  }
}
