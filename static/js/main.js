// ===== Configuration =====
const API_ENDPOINT = "/predict";

// ===== State Management =====
let currentStep = 1;
const totalSteps = 3;

// ===== Sprite Data =====
const retroSkin = {
  base: "#f8d9c3",
  shade: "#e7bda4",
};

function createRetroSprite({
  gender,
  hairBase,
  hairHighlight,
  outfitPrimary,
  outfitSecondary,
  accent = "#fbbf24",
  trim = "#0f172a",
  bottomAccent = "#111827",
  accessory = "",
  bottomStyle = "pants",
}) {
  const hairBack =
    gender === "female"
      ? `<rect x="14" y="18" width="36" height="30" fill="${hairBase}" />
         <rect x="12" y="22" width="40" height="24" fill="${hairHighlight}" opacity="0.6" />`
      : `<rect x="18" y="16" width="28" height="14" fill="${hairBase}" />
         <rect x="18" y="28" width="28" height="6" fill="${hairHighlight}" opacity="0.6" />`;

  const bottomMarkup =
    bottomStyle === "skirt"
      ? `<rect x="18" y="64" width="28" height="12" fill="${outfitSecondary}" />
         <rect x="20" y="76" width="8" height="14" fill="${bottomAccent}" />
         <rect x="36" y="76" width="8" height="14" fill="${bottomAccent}" />`
      : `<rect x="20" y="68" width="10" height="18" fill="${outfitSecondary}" />
         <rect x="34" y="68" width="10" height="18" fill="${outfitSecondary}" />
         <rect x="20" y="86" width="10" height="4" fill="${bottomAccent}" />
         <rect x="34" y="86" width="10" height="4" fill="${bottomAccent}" />`;

  return `<svg class="retro-sprite" width="100%" height="100%" viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
    <ellipse cx="32" cy="90" rx="18" ry="6" fill="rgba(0,0,0,0.3)" />
    ${hairBack}
    <rect x="20" y="12" width="24" height="12" fill="${hairBase}" />
    <rect x="20" y="12" width="24" height="4" fill="${hairHighlight}" />
    <rect x="22" y="18" width="20" height="22" fill="${retroSkin.base}" />
    <rect x="22" y="18" width="8" height="22" fill="${retroSkin.shade}" opacity="0.8" />
    <rect x="24" y="26" width="4" height="4" fill="#07080d" />
    <rect x="36" y="26" width="4" height="4" fill="#07080d" />
    <rect x="25" y="27" width="1" height="2" fill="#ffffff" />
    <rect x="37" y="27" width="1" height="2" fill="#ffffff" />
    <rect x="28" y="34" width="8" height="2" fill="#7a324f" />
    <rect x="12" y="44" width="8" height="22" fill="${retroSkin.base}" />
    <rect x="44" y="44" width="8" height="22" fill="${retroSkin.base}" />
    <rect x="18" y="40" width="28" height="32" fill="${outfitPrimary}" />
    <rect x="18" y="40" width="12" height="32" fill="${outfitSecondary}" />
    <rect x="34" y="40" width="12" height="32" fill="${accent}" opacity="0.35" />
    <rect x="18" y="66" width="28" height="4" fill="${trim}" />
    ${bottomMarkup}
    ${accessory}
  </svg>`;
}

const spriteConfigs = {
  male: {
    "First Year": {
      hairBase: "#1d3b8b",
      hairHighlight: "#60a5fa",
      outfitPrimary: "#2563eb",
      outfitSecondary: "#1e3a8a",
      accent: "#93c5fd",
      accessory: `<rect x="6" y="60" width="10" height="16" fill="#fef3c7" /><rect x="6" y="60" width="10" height="2" fill="#fcd34d" />`,
    },
    "Second Year": {
      hairBase: "#065f46",
      hairHighlight: "#34d399",
      outfitPrimary: "#10b981",
      outfitSecondary: "#047857",
      accent: "#6ee7b7",
      accessory: `<rect x="48" y="60" width="10" height="18" fill="#0f172a" /><rect x="49" y="62" width="8" height="6" fill="#38bdf8" />`,
    },
    "Third Year": {
      hairBase: "#312e81",
      hairHighlight: "#a5b4fc",
      outfitPrimary: "#475569",
      outfitSecondary: "#1f2937",
      accent: "#94a3b8",
      accessory: `<rect x="6" y="50" width="12" height="10" fill="#94a3b8" /><rect x="6" y="60" width="12" height="4" fill="#475569" />`,
    },
    "Fourth Year": {
      hairBase: "#111827",
      hairHighlight: "#4c1d95",
      outfitPrimary: "#4c1d95",
      outfitSecondary: "#2e1065",
      accent: "#c084fc",
      trim: "#fbbf24",
      accessory: `<rect x="44" y="30" width="14" height="6" fill="#fbbf24" /><rect x="44" y="36" width="14" height="2" fill="#78350f" />`,
    },
  },
  female: {
    "First Year": {
      hairBase: "#be185d",
      hairHighlight: "#f472b6",
      outfitPrimary: "#ec4899",
      outfitSecondary: "#be185d",
      accent: "#fecdd3",
      bottomStyle: "skirt",
      accessory: `<rect x="6" y="64" width="12" height="12" fill="#fde68a" />`,
    },
    "Second Year": {
      hairBase: "#a16207",
      hairHighlight: "#facc15",
      outfitPrimary: "#fbbf24",
      outfitSecondary: "#d97706",
      accent: "#fed7aa",
      bottomStyle: "skirt",
      accessory: `<rect x="46" y="54" width="10" height="20" fill="#111827" /><rect x="47" y="56" width="8" height="6" fill="#22d3ee" />`,
    },
    "Third Year": {
      hairBase: "#312e81",
      hairHighlight: "#a78bfa",
      outfitPrimary: "#4b5563",
      outfitSecondary: "#1f2937",
      accent: "#9ca3af",
      bottomStyle: "pants",
      accessory: `<rect x="10" y="34" width="12" height="6" fill="#6366f1" /><rect x="11" y="35" width="10" height="4" fill="#c7d2fe" />`,
    },
    "Fourth Year": {
      hairBase: "#6b21a8",
      hairHighlight: "#c084fc",
      outfitPrimary: "#7c3aed",
      outfitSecondary: "#5b21b6",
      accent: "#c4b5fd",
      trim: "#fef3c7",
      bottomStyle: "skirt",
      accessory: `<rect x="6" y="30" width="16" height="4" fill="#fef3c7" /><rect x="6" y="26" width="16" height="4" fill="#1e1b4b" />`,
    },
  },
};

const sprites = { male: {}, female: {} };

Object.keys(spriteConfigs).forEach((gender) => {
  Object.entries(spriteConfigs[gender]).forEach(([level, config]) => {
    sprites[gender][level] = createRetroSprite({ gender, ...config });
  });
});

// Sleep State Sprites (Good Sleep)
// ===== Enhanced Sleep State Sprites =====
const sleepSpritesGood = {
  "First Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="6" y="14" width="6" height="2" fill="#5c4033"/>
      <rect x="5" y="15" width="1" height="3" fill="#5c4033"/>
      <rect x="12" y="15" width="1" height="3" fill="#5c4033"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#7a4d45"/>
      
      <!-- Smile -->
      <rect x="8" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#3b82f6"/>
      <rect x="4" y="20" width="10" height="8" fill="#2f6ccc"/>
      <rect x="18" y="20" width="10" height="8" fill="#4d96ff"/>
      
      <!-- Zzz bubbles -->
      <rect x="14" y="12" width="2" height="1" fill="#fbbf24" opacity="0.8"/>
      <rect x="16" y="10" width="3" height="1" fill="#fbbf24" opacity="0.6"/>
      <rect x="20" y="8" width="4" height="1" fill="#fbbf24" opacity="0.4"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="5" y="14" width="8" height="3" fill="#3f2e26"/>
      <rect x="4" y="15" width="1" height="3" fill="#3f2e26"/>
      <rect x="13" y="15" width="1" height="3" fill="#3f2e26"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#7a4d45"/>
      
      <!-- Blush -->
      <rect x="6" y="18" width="1" height="1" fill="#ff99cc" opacity="0.7"/>
      <rect x="11" y="18" width="1" height="1" fill="#ff99cc" opacity="0.7"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#ec4899"/>
      <rect x="4" y="20" width="10" height="8" fill="#db2777"/>
      <rect x="18" y="20" width="10" height="8" fill="#f472b6"/>
      
      <!-- Zzz bubbles -->
      <rect x="14" y="12" width="2" height="1" fill="#fbbf24" opacity="0.8"/>
      <rect x="16" y="10" width="3" height="1" fill="#fbbf24" opacity="0.6"/>
      <rect x="20" y="8" width="4" height="1" fill="#fbbf24" opacity="0.4"/>
    </svg>`,
  },
  "Second Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="6" y="14" width="6" height="2" fill="#3f2e26"/>
      <rect x="5" y="15" width="1" height="3" fill="#3f2e26"/>
      <rect x="12" y="15" width="1" height="3" fill="#3f2e26"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#7a4d45"/>
      
      <!-- Smile -->
      <rect x="8" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#10b981"/>
      <rect x="4" y="20" width="10" height="8" fill="#0c8667"/>
      <rect x="18" y="20" width="10" height="8" fill="#15d49a"/>
      
      <!-- Sleep mask -->
      <rect x="5" y="15" width="8" height="2" fill="#1e293b"/>
      <rect x="6" y="15" width="6" height="1" fill="#334155"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="5" y="13" width="8" height="4" fill="#3f2e26"/>
      <rect x="4" y="15" width="1" height="3" fill="#3f2e26"/>
      <rect x="13" y="15" width="1" height="3" fill="#3f2e26"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#7a4d45"/>
      
      <!-- Smile -->
      <rect x="8" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#10b981"/>
      <rect x="4" y="20" width="10" height="8" fill="#0c8667"/>
      <rect x="18" y="20" width="10" height="8" fill="#15d49a"/>
      
      <!-- Teddy bear -->
      <rect x="20" y="14" width="4" height="3" fill="#92400e"/>
      <rect x="21" y="14" width="2" height="1" fill="#000"/>
    </svg>`,
  },
  "Third Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#eddcd2"/>
      <!-- Hair -->
      <rect x="6" y="14" width="6" height="2" fill="#2d221e"/>
      <rect x="5" y="15" width="1" height="3" fill="#2d221e"/>
      <rect x="12" y="15" width="1" height="3" fill="#2d221e"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#754c47"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#4b5563"/>
      <rect x="4" y="20" width="10" height="8" fill="#354556"/>
      <rect x="18" y="20" width="10" height="8" fill="#566374"/>
      
      <!-- Glasses on nightstand -->
      <rect x="22" y="16" width="6" height="2" fill="none" stroke="#4b5563" stroke-width="1"/>
      <rect x="28" y="16" width="1" height="1" fill="#4b5563"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#eddcd2"/>
      <!-- Hair -->
      <rect x="5" y="13" width="8" height="4" fill="#2d221e"/>
      <rect x="4" y="15" width="1" height="3" fill="#2d221e"/>
      <rect x="13" y="15" width="1" height="3" fill="#2d221e"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#754c47"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#4b5563"/>
      <rect x="4" y="20" width="10" height="8" fill="#354556"/>
      <rect x="18" y="20" width="10" height="8" fill="#566374"/>
      
      <!-- Book on nightstand -->
      <rect x="22" y="16" width="4" height="5" fill="#7f1d1d"/>
      <rect x="23" y="16" width="2" height="1" fill="#fef3c7"/>
    </svg>`,
  },
  "Fourth Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="6" y="14" width="6" height="2" fill="#1a1839"/>
      <rect x="5" y="15" width="1" height="3" fill="#1a1839"/>
      <rect x="12" y="15" width="1" height="3" fill="#1a1839"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#7a4d45"/>
      
      <!-- Smile -->
      <rect x="8" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#4c1d95"/>
      <rect x="4" y="20" width="10" height="8" fill="#3c1878"/>
      <rect x="18" y="20" width="10" height="8" fill="#5d25b0"/>
      
      <!-- Graduation cap on chair -->
      <rect x="22" y="14" width="8" height="2" fill="#1e1b4b"/>
      <rect x="24" y="12" width="4" height="2" fill="#1e1b4b"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Pillow -->
      <rect x="4" y="16" width="8" height="4" fill="#f1f5f9"/>
      <rect x="5" y="16" width="6" height="1" fill="#cbd5e1"/>
      
      <!-- Head -->
      <rect x="6" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="5" y="13" width="8" height="4" fill="#5c4033"/>
      <rect x="4" y="15" width="1" height="3" fill="#5c4033"/>
      <rect x="13" y="15" width="1" height="3" fill="#5c4033"/>
      
      <!-- Headband -->
      <rect x="5" y="15" width="8" height="1" fill="#1e1b4b"/>
      
      <!-- Closed eyes -->
      <rect x="7" y="16" width="4" height="1" fill="#7a4d45"/>
      
      <!-- Smile -->
      <rect x="8" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (blanket) -->
      <rect x="4" y="20" width="24" height="8" fill="#4c1d95"/>
      <rect x="4" y="20" width="10" height="8" fill="#3c1878"/>
      <rect x="18" y="20" width="10" height="8" fill="#5d25b0"/>
      
      <!-- Alarm clock -->
      <rect x="22" y="14" width="6" height="4" fill="#1e293b"/>
      <rect x="24" y="15" width="2" height="2" fill="#22c55e"/>
    </svg>`,
  },
};

const sleepSpritesPoor = {
  "First Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Tossed pillow -->
      <rect x="18" y="14" width="8" height="4" fill="#f1f5f9" transform="rotate(15 22 16)"/>
      
      <!-- Head - restless -->
      <rect x="8" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="8" y="14" width="6" height="2" fill="#5c4033"/>
      <rect x="7" y="15" width="1" height="3" fill="#5c4033"/>
      <rect x="14" y="15" width="1" height="3" fill="#5c4033"/>
      
      <!-- Worried eyes -->
      <rect x="9" y="16" width="1" height="1" fill="#000"/>
      <rect x="12" y="16" width="1" height="1" fill="#000"/>
      
      <!-- Frown -->
      <rect x="10" y="18" width="3" height="1" fill="#7a4d45"/>
      
      <!-- Body (tangled blanket) -->
      <rect x="4" y="20" width="20" height="8" fill="#3b82f6"/>
      <rect x="4" y="20" width="8" height="8" fill="#2f6ccc"/>
      <rect x="16" y="20" width="8" height="8" fill="#4d96ff"/>
      
      <!-- Sweat drops -->
      <rect x="10" y="13" width="1" height="2" fill="#60a5fa"/>
      <rect x="13" y="12" width="1" height="2" fill="#60a5fa"/>
      
      <!-- Phone glowing -->
      <rect x="24" y="16" width="4" height="6" fill="#1e293b"/>
      <rect x="25" y="17" width="2" height="4" fill="#3b82f6" opacity="0.7"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Tossed pillow -->
      <rect x="18" y="14" width="8" height="4" fill="#f1f5f9" transform="rotate(15 22 16)"/>
      
      <!-- Head - restless -->
      <rect x="8" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="7" y="14" width="8" height="3" fill="#3f2e26"/>
      <rect x="6" y="15" width="1" height="3" fill="#3f2e26"/>
      <rect x="15" y="15" width="1" height="3" fill="#3f2e26"/>
      
      <!-- Worried eyes -->
      <rect x="9" y="16" width="1" height="1" fill="#000"/>
      <rect x="12" y="16" width="1" height="1" fill="#000"/>
      
      <!-- Frown -->
      <rect x="10" y="18" width="3" height="1" fill="#7a4d45"/>
      
      <!-- Body (tangled blanket) -->
      <rect x="4" y="20" width="20" height="8" fill="#ec4899"/>
      <rect x="4" y="20" width="8" height="8" fill="#db2777"/>
      <rect x="16" y="20" width="8" height="8" fill="#f472b6"/>
      
      <!-- Sweat drops -->
      <rect x="10" y="13" width="1" height="2" fill="#60a5fa"/>
      <rect x="13" y="12" width="1" height="2" fill="#60a5fa"/>
      
      <!-- Laptop glowing -->
      <rect x="22" y="16" width="8" height="4" fill="#1e293b"/>
      <rect x="23" y="17" width="6" height="2" fill="#3b82f6" opacity="0.7"/>
    </svg>`,
  },
  "Second Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Head - half awake -->
      <rect x="10" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="10" y="14" width="6" height="2" fill="#3f2e26"/>
      <rect x="9" y="15" width="1" height="3" fill="#3f2e26"/>
      <rect x="16" y="15" width="1" height="3" fill="#3f2e26"/>
      
      <!-- Tired eyes (one open, one closed) -->
      <rect x="11" y="16" width="1" height="1" fill="#000"/>
      <rect x="13" y="16" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (sitting up) -->
      <rect x="8" y="20" width="16" height="8" fill="#10b981"/>
      <rect x="8" y="20" width="6" height="8" fill="#0c8667"/>
      <rect x="18" y="20" width="6" height="8" fill="#15d49a"/>
      
      <!-- Coffee cup -->
      <rect x="24" y="16" width="3" height="4" fill="#78350f"/>
      <rect x="25" y="15" width="1" height="1" fill="#fbbf24"/>
      
      <!-- Dark circles -->
      <rect x="10" y="16" width="1" height="1" fill="#4b5563" opacity="0.5"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Head - half awake -->
      <rect x="10" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="9" y="13" width="8" height="4" fill="#3f2e26"/>
      <rect x="8" y="15" width="1" height="3" fill="#3f2e26"/>
      <rect x="17" y="15" width="1" height="3" fill="#3f2e26"/>
      
      <!-- Tired eyes (one open, one closed) -->
      <rect x="11" y="16" width="1" height="1" fill="#000"/>
      <rect x="13" y="16" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (sitting up) -->
      <rect x="8" y="20" width="16" height="8" fill="#10b981"/>
      <rect x="8" y="20" width="6" height="8" fill="#0c8667"/>
      <rect x="18" y="20" width="6" height="8" fill="#15d49a"/>
      
      <!-- Textbook -->
      <rect x="22" y="16" width="6" height="4" fill="#7f1d1d"/>
      <rect x="23" y="17" width="4" height="2" fill="#fef3c7"/>
      
      <!-- Dark circles -->
      <rect x="10" y="16" width="1" height="1" fill="#4b5563" opacity="0.5"/>
    </svg>`,
  },
  "Third Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Head - exhausted -->
      <rect x="12" y="14" width="6" height="6" fill="#eddcd2"/>
      <!-- Hair -->
      <rect x="12" y="14" width="6" height="2" fill="#2d221e"/>
      <rect x="11" y="15" width="1" height="3" fill="#2d221e"/>
      <rect x="18" y="15" width="1" height="3" fill="#2d221e"/>
      
      <!-- Dark circles under eyes -->
      <rect x="13" y="17" width="4" height="1" fill="#4b5563" opacity="0.7"/>
      
      <!-- Open tired eyes -->
      <rect x="13" y="16" width="1" height="1" fill="#000"/>
      <rect x="16" y="16" width="1" height="1" fill="#000"/>
      
      <!-- Body (blanket half off) -->
      <rect x="8" y="20" width="18" height="8" fill="#4b5563"/>
      <rect x="8" y="20" width="8" height="8" fill="#354556"/>
      <rect x="20" y="20" width="6" height="8" fill="#566374"/>
      
      <!-- Coffee pot -->
      <rect x="24" y="14" width="4" height="6" fill="#78350f"/>
      <rect x="25" y="13" width="2" height="1" fill="#fbbf24"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Head - exhausted with glasses -->
      <rect x="12" y="14" width="6" height="6" fill="#eddcd2"/>
      <!-- Hair -->
      <rect x="11" y="13" width="8" height="4" fill="#2d221e"/>
      <rect x="10" y="15" width="1" height="3" fill="#2d221e"/>
      <rect x="19" y="15" width="1" height="3" fill="#2d221e"/>
      
      <!-- Glasses -->
      <rect x="12" y="16" width="2" height="1" fill="none" stroke="#4b5563" stroke-width="1"/>
      <rect x="15" y="16" width="2" height="1" fill="none" stroke="#4b5563" stroke-width="1"/>
      <rect x="14" y="16" width="1" height="1" fill="#4b5563"/>
      
      <!-- Dark circles -->
      <rect x="12" y="17" width="1" height="1" fill="#4b5563" opacity="0.7"/>
      <rect x="17" y="17" width="1" height="1" fill="#4b5563" opacity="0.7"/>
      
      <!-- Body (blanket half off) -->
      <rect x="8" y="20" width="18" height="8" fill="#4b5563"/>
      <rect x="8" y="20" width="8" height="8" fill="#354556"/>
      <rect x="20" y="20" width="6" height="8" fill="#566374"/>
      
      <!-- Multiple books -->
      <rect x="22" y="14" width="3" height="4" fill="#7f1d1d"/>
      <rect x="26" y="15" width="3" height="4" fill="#1e3a8a"/>
    </svg>`,
  },
  "Fourth Year": {
    male: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Head - stressed -->
      <rect x="14" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="14" y="14" width="6" height="2" fill="#1a1839"/>
      <rect x="13" y="15" width="1" height="3" fill="#1a1839"/>
      <rect x="20" y="15" width="1" height="3" fill="#1a1839"/>
      
      <!-- Wide awake stressed eyes -->
      <rect x="15" y="16" width="1" height="1" fill="#000"/>
      <rect x="18" y="16" width="1" height="1" fill="#000"/>
      
      <!-- Open mouth -->
      <rect x="16" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (sitting up stressed) -->
      <rect x="10" y="20" width="14" height="8" fill="#4c1d95"/>
      <rect x="10" y="20" width="6" height="8" fill="#3c1878"/>
      <rect x="20" y="20" width="4" height="8" fill="#5d25b0"/>
      
      <!-- Thesis papers everywhere -->
      <rect x="4" y="14" width="6" height="4" fill="#f8fafc"/>
      <rect x="24" y="12" width="4" height="6" fill="#f8fafc"/>
      <rect x="5" y="15" width="4" height="2" fill="#cbd5e1"/>
    </svg>`,
    female: `<svg width="100%" height="100%" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Messy bed -->
      <rect x="2" y="20" width="28" height="10" fill="#334155"/>
      <rect x="2" y="18" width="28" height="2" fill="#475569"/>
      
      <!-- Head - stressed with headband -->
      <rect x="14" y="14" width="6" height="6" fill="#ffccaa"/>
      <!-- Hair -->
      <rect x="13" y="13" width="8" height="4" fill="#5c4033"/>
      <rect x="12" y="15" width="1" height="3" fill="#5c4033"/>
      <rect x="21" y="15" width="1" height="3" fill="#5c4033"/>
      
      <!-- Headband -->
      <rect x="13" y="15" width="8" height="1" fill="#1e1b4b"/>
      
      <!-- Wide awake stressed eyes -->
      <rect x="15" y="16" width="1" height="1" fill="#000"/>
      <rect x="18" y="16" width="1" height="1" fill="#000"/>
      
      <!-- Open mouth -->
      <rect x="16" y="18" width="2" height="1" fill="#7a4d45"/>
      
      <!-- Body (sitting up stressed) -->
      <rect x="10" y="20" width="14" height="8" fill="#4c1d95"/>
      <rect x="10" y="20" width="6" height="8" fill="#3c1878"/>
      <rect x="20" y="20" width="4" height="8" fill="#5d25b0"/>
      
      <!-- Alarm clock showing late hour -->
      <rect x="24" y="14" width="6" height="4" fill="#1e293b"/>
      <rect x="26" y="15" width="2" height="2" fill="#ef4444"/>
      
      <!-- Graduation cap thrown aside -->
      <rect x="4" y="12" width="8" height="2" fill="#1e1b4b" transform="rotate(-15 8 13)"/>
    </svg>`,
  },
};

// ===== DOM Elements =====
const elements = {
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  predictBtn: document.getElementById("predictBtn"),
  resultOverlay: document.getElementById("resultOverlay"),
  loadingOverlay: document.getElementById("loadingOverlay"),
  resetBtn: document.getElementById("resetBtn"),
  avatarMale: document.getElementById("avatar-male"),
  avatarFemale: document.getElementById("avatar-female"),
  avatarContainer: document.getElementById("avatarContainer"),
  avatarText: document.getElementById("avatarText"),
  avatarDialogue: document.getElementById("avatarDialogue"),
  healthBar: document.getElementById("healthBar"),
  stressDisplay: document.getElementById("stressDisplay"),
  caffeineDisplay: document.getElementById("caffeineDisplay"),
  screenDisplay: document.getElementById("screenDisplay"),
  predictionResult: document.getElementById("predictionResult"),
  confidenceBar: document.getElementById("confidenceBar"),
  confidenceText: document.getElementById("confidenceText"),
  stepDots: [
    document.getElementById("step1Dot"),
    document.getElementById("step2Dot"),
    document.getElementById("step3Dot"),
  ],
};

// Form inputs
const inputs = {
  sex: document.getElementById("sex"),
  academic_level: document.getElementById("academic_level"),
  living_arrangement: document.getElementById("living_arrangement"),
  Caffeine_Intake_Frequency: document.getElementById(
    "Caffeine_Intake_Frequency"
  ),
  screen_time_before_sleep: document.getElementById("screen_time_before_sleep"),
  smoking_Frequency: document.getElementById("smoking_Frequency"),
  physical_activity_frequency: document.getElementById(
    "physical_activity_frequency"
  ),
  alcohol_consumption_frequency: document.getElementById(
    "alcohol_consumption_frequency"
  ),
  stress_level: document.getElementById("stress_level"),
  daytime_nap_duration: document.getElementById("daytime_nap_duration"),
  study_start_time: document.getElementById("study_start_time"),
  study_end_time: document.getElementById("study_end_time"),
};

// ===== Avatar Dialogue Messages =====
const dialogues = {
  welcome: "Ready when you are!",
  stress: {
    "Low stress": "Feeling pretty relaxed!",
    "Moderate stress": "A bit stressed, but managing.",
    "High stress": "Help! Too much stress...",
  },
  caffeine: {
    Never: "No coffee for me!",
    "Almost Never": "Rarely drink caffeine.",
    Sometimes: "Coffee time!",
    "Fairly Often": "I love my coffee!",
    "Very Often": "Caffeine is life!",
    Always: "Running on coffee!",
  },
  prediction_loading: "Analyzing your data...",
  good_sleep: "Great news ahead!",
  poor_sleep: "Hmm, concerning...",
};

// ===== Sprite Switching Function =====
function updateSprite() {
  const sex = inputs.sex.value;
  const level = inputs.academic_level.value;

  // Get the appropriate sprite
  const gender = sex === "Male" ? "male" : "female";
  const spriteHTML = sprites[gender][level];

  // Update the visible avatar
  if (sex === "Male") {
    elements.avatarMale.innerHTML = spriteHTML;
    elements.avatarMale.classList.remove("hidden");
    elements.avatarFemale.classList.add("hidden");
  } else {
    elements.avatarFemale.innerHTML = spriteHTML;
    elements.avatarFemale.classList.remove("hidden");
    elements.avatarMale.classList.add("hidden");
  }

  console.log(`Sprite updated: ${gender} - ${level}`);
}

// ===== Navigation Functions =====
function updateStepVisibility() {
  // Hide all steps
  for (let i = 1; i <= totalSteps; i++) {
    document.getElementById(`step-${i}`).classList.remove("active");
  }

  // Show current step
  document.getElementById(`step-${currentStep}`).classList.add("active");

  // Update step dots
  elements.stepDots.forEach((dot, index) => {
    if (index < currentStep) {
      dot.className = "w-3 h-3 bg-rpg-gold";
    } else {
      dot.className = "w-3 h-3 bg-gray-600";
    }
  });

  // Button visibility
  elements.prevBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";

  if (currentStep === totalSteps) {
    elements.nextBtn.classList.add("hidden");
    elements.predictBtn.classList.remove("hidden");
  } else {
    elements.nextBtn.classList.remove("hidden");
    elements.predictBtn.classList.add("hidden");
  }

  // Update avatar dialogue based on step
  updateAvatarForStep();
}

function updateAvatarForStep() {
  switch (currentStep) {
    case 1:
      updateAvatarDialogue("Tell me about yourself!");
      break;
    case 2:
      updateAvatarDialogue("What are your habits?");
      break;
    case 3:
      updateAvatarDialogue("Almost done! Final stats!");
      break;
  }
}

// ===== Avatar Functions =====
function updateAvatar() {
  const sex = inputs.sex.value;
  const level = inputs.academic_level.value;
  const stress = inputs.stress_level.value;

  // Update sprite based on selections
  updateSprite();

  const currentAvatar =
    sex === "Male" ? elements.avatarMale : elements.avatarFemale;

  // Stress animations
  if (stress === "High stress") {
    currentAvatar.style.animation = "wiggle 0.5s ease-in-out infinite";
  } else {
    currentAvatar.style.animation = "none";
  }

  updateStats();
}

function updateAvatarDialogue(message) {
  elements.avatarText.innerText = message;
}

function animateAvatarReaction() {
  const container = elements.avatarContainer;
  if (!container) return;
  container.classList.remove("sprite-react");
  // trigger reflow so animation can restart
  void container.offsetWidth;
  container.classList.add("sprite-react");
  setTimeout(() => container.classList.remove("sprite-react"), 550);
}

function updateStats() {
  const stress = inputs.stress_level.value;
  const caffeine = inputs.Caffeine_Intake_Frequency.value;
  const screen = inputs.screen_time_before_sleep.value;

  // Update stat displays
  elements.stressDisplay.innerText = stress
    .replace(" stress", "")
    .toUpperCase();
  elements.caffeineDisplay.innerText = caffeine.toUpperCase();
  elements.screenDisplay.innerText = screen.toUpperCase();

  // Update health bar based on negative factors
  let healthPercentage = 100;

  if (stress === "High stress") healthPercentage -= 30;
  else if (stress === "Moderate stress") healthPercentage -= 15;

  if (caffeine === "Very Often" || caffeine === "Always")
    healthPercentage -= 20;
  else if (caffeine === "Fairly Often") healthPercentage -= 10;

  if (screen === "More than 2 hours") healthPercentage -= 25;
  else if (screen === "1 - 2 hours") healthPercentage -= 15;

  healthPercentage = Math.max(0, healthPercentage);
  elements.healthBar.style.width = healthPercentage + "%";

  // Change health bar color based on level
  if (healthPercentage > 70) {
    elements.healthBar.style.background =
      "linear-gradient(90deg, #22c55e 0%, #84cc16 100%)";
  } else if (healthPercentage > 40) {
    elements.healthBar.style.background =
      "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)";
  } else {
    elements.healthBar.style.background =
      "linear-gradient(90deg, #ef4444 0%, #dc2626 100%)";
  }
}

// ===== Time Display Helper =====
function formatTimeToAMPM(time24) {
  // Convert 24-hour format (HH:MM) to 12-hour format with am/pm
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "pm" : "am";
  const hours12 = hours % 12 || 12; // Convert 0 to 12
  return `${hours12}:${minutes.toString().padStart(2, "0")}${period}`;
}

function updateStudyTimeDisplay() {
  const startTime = inputs.study_start_time.value;
  const endTime = inputs.study_end_time.value;

  const startFormatted = formatTimeToAMPM(startTime);
  const endFormatted = formatTimeToAMPM(endTime);

  const displayElement = document.getElementById("studyTimeDisplay");
  displayElement.textContent = `Time range: ${startFormatted} - ${endFormatted}`;

  if (
    document.activeElement === inputs.study_start_time ||
    document.activeElement === inputs.study_end_time
  ) {
    handleDialogueUpdate("study_window", `${startFormatted} - ${endFormatted}`);
  }
}

function formatStudyTimeForAPI(startTime, endTime) {
  // Format as "10:00pm - 1:00am" for your preprocessing.py
  const startFormatted = formatTimeToAMPM(startTime);
  const endFormatted = formatTimeToAMPM(endTime);
  return `${startFormatted} - ${endFormatted}`;
}

const dynamicDialogues = {
  sex: (value) =>
    value === "Male"
      ? "Captain REM reporting for duty!"
      : "Captain REM ready to roll!",
  academic_level: (value) => `Scholar rank: ${value}.`,
  living_arrangement: (value) => `Base camp set to ${value}.`,
  Caffeine_Intake_Frequency: (value) =>
    dialogues.caffeine[value] || `Caffeine habit: ${value}.`,
  screen_time_before_sleep: (value) => `Screen glow: ${value}.`,
  smoking_Frequency: (value) => `Smoke meter: ${value}.`,
  physical_activity_frequency: (value) => `Training log: ${value}.`,
  alcohol_consumption_frequency: (value) => `Potion intake: ${value}.`,
  stress_level: (value) => dialogues.stress[value],
  daytime_nap_duration: (value) =>
    Number(value) === 0
      ? "No naps logged today."
      : `${value} min nap power-up ready.`,
  study_start_time: (value) => `Study begins ${formatTimeToAMPM(value)}.`,
  study_end_time: (value) => `Study wraps ${formatTimeToAMPM(value)}.`,
  study_window: (value) => `Late grind scheduled: ${value}.`,
};

function handleDialogueUpdate(field, overrideValue) {
  const value = overrideValue ?? inputs[field]?.value;
  if (value === undefined || value === null) return;

  const handler = dynamicDialogues[field];
  const message = handler
    ? handler(value)
    : `Noted: ${formatFieldLabel(field)} set to ${value}.`;

  if (message) {
    updateAvatarDialogue(message);
  }
}

function formatFieldLabel(field) {
  return field.replace(/_/g, " ").toUpperCase();
}

function reactToInput(field, overrideValue) {
  animateAvatarReaction();
  handleDialogueUpdate(field, overrideValue);
}

Object.entries(inputs).forEach(([key, element]) => {
  if (!element) return;
  const eventType = element.tagName === "INPUT" ? "input" : "change";
  element.addEventListener(eventType, () => {
    reactToInput(key);
  });
});

// ===== Prediction Function =====
async function makePrediction() {
  // Show loading overlay
  elements.loadingOverlay.classList.remove("hidden");
  elements.loadingOverlay.classList.add("flex");
  updateAvatarDialogue(dialogues.prediction_loading);

  // Format study time as "10:00pm - 1:00am" for preprocessing.py
  const studyTimeString = formatStudyTimeForAPI(
    inputs.study_start_time.value,
    inputs.study_end_time.value
  );

  // Gather form data - send raw time string to backend
  const formData = {
    sex: inputs.sex.value,
    academic_level: inputs.academic_level.value,
    living_arrangement: inputs.living_arrangement.value,
    Caffeine_Intake_Frequency: inputs.Caffeine_Intake_Frequency.value,
    screen_time_before_sleep: inputs.screen_time_before_sleep.value,
    smoking_Frequency: inputs.smoking_Frequency.value,
    physical_activity_frequency: inputs.physical_activity_frequency.value,
    alcohol_consumption_frequency: inputs.alcohol_consumption_frequency.value,
    daytime_nap_duration: inputs.daytime_nap_duration.value,
    latenight_study_hours: studyTimeString, // Send as string like "10:00pm - 1:00am"
    stress_level: inputs.stress_level.value,
  };

  console.log("Sending prediction request with data:", formData);

  try {
    // Make API call to your Flask backend
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Prediction result from API:", result);

    // Simulate delay for effect
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Hide loading, show result
    elements.loadingOverlay.classList.add("hidden");
    elements.loadingOverlay.classList.remove("flex");

    // Display the REAL model prediction
    displayResult(result);
  } catch (error) {
    console.error("Error making prediction:", error);
    console.error("Error details:", error.message);

    // Hide loading
    elements.loadingOverlay.classList.add("hidden");
    elements.loadingOverlay.classList.remove("flex");

    // Show error message to user
    alert(
      "Failed to get prediction from server. Please make sure:\n" +
        "1. Flask server is running\n" +
        "2. API endpoint is correct: " +
        API_ENDPOINT +
        "\n" +
        "3. Check browser console for details\n\n" +
        "Error: " +
        error.message
    );
  }
}

function displayResult(result) {
  const isGoodSleep = result.prediction === 1;
  const confidence = Math.round(result.confidence * 100);
  const level = inputs.academic_level.value;
  const sex = inputs.sex.value;

  // Update result text
  elements.predictionResult.innerText = result.prediction_text.toUpperCase();
  elements.predictionResult.className = isGoodSleep
    ? "text-green-400 text-base sm:text-xl mb-4 animate-pulse"
    : "text-red-400 text-base sm:text-xl mb-4 animate-pulse";

  // Update confidence
  elements.confidenceText.innerText = confidence + "%";
  elements.confidenceBar.style.width = "0%";

  // Animate confidence bar
  setTimeout(() => {
    elements.confidenceBar.style.width = confidence + "%";
  }, 100);

  // Update avatar dialogue
  updateAvatarDialogue(
    isGoodSleep ? dialogues.good_sleep : dialogues.poor_sleep
  );

  // Show sleep state sprite in result
  showSleepSprite(isGoodSleep, level, sex);

  // Show result overlay
  elements.resultOverlay.classList.remove("hidden");
  elements.resultOverlay.classList.add("flex");

  // Play success sound (optional)
  playSound(isGoodSleep ? "success" : "warning");
}

function showSleepSprite(isGoodSleep, level, sex) {
  // Get the appropriate sleep sprite
  let sleepSpriteHTML;

  const gender = sex === "Male" ? "male" : "female";

  if (isGoodSleep) {
    // Good sleep sprites - all levels now have gender-specific sprites
    sleepSpriteHTML = sleepSpritesGood[level][gender];
  } else {
    // Poor sleep sprites - all levels now have gender-specific sprites
    sleepSpriteHTML = sleepSpritesPoor[level][gender];
  }

  // Update dedicated sleep sprite container in result overlay
  const sleepSpriteContainer = document.getElementById("resultSpriteSlot");
  if (!sleepSpriteContainer) {
    console.warn("Result sprite slot not found in DOM.");
    return;
  }

  sleepSpriteContainer.innerHTML =
    sleepSpriteHTML ||
    '<div class="text-red-500 text-[10px] text-center px-2">Sprite not found</div>';
}

// ===== Rocket Visuals =====
let rocketLayerEl = null;
let rocketIntervalId = null;

function ensureRocketLayer() {
  if (rocketLayerEl && document.body.contains(rocketLayerEl)) {
    return rocketLayerEl;
  }

  rocketLayerEl = document.getElementById("rocketLayer");

  if (!rocketLayerEl) {
    rocketLayerEl = document.createElement("div");
    rocketLayerEl.id = "rocketLayer";
    rocketLayerEl.className = "rocket-layer";
    document.body.insertBefore(rocketLayerEl, document.body.firstChild);
  }

  return rocketLayerEl;
}

function spawnRocket() {
  const layer = ensureRocketLayer();
  if (!layer) return;

  const rocket = document.createElement("div");
  rocket.className = "retro-rocket";
  rocket.style.left = `${Math.random() * 100}vw`;
  rocket.style.setProperty("--rocket-speed", `${6 + Math.random() * 5}s`);
  rocket.style.setProperty("--rocket-drift", `${Math.random() * 40 - 20}vw`);
  rocket.style.setProperty("--rocket-tilt", `${-18 + Math.random() * 12}deg`);

  layer.appendChild(rocket);
  rocket.addEventListener("animationend", () => rocket.remove());
}

function startRocketShow() {
  ensureRocketLayer();
  spawnRocket();
  if (rocketIntervalId) clearInterval(rocketIntervalId);
  rocketIntervalId = setInterval(spawnRocket, 4200);
}

// ===== Sound Effects =====
function playSound(type) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === "success") {
    // Happy ascending tones
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
  } else if (type === "warning") {
    // Descending tones
    oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
    oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime + 0.1); // E4
    oscillator.frequency.setValueAtTime(261.63, audioContext.currentTime + 0.2); // C4
  } else if (type === "click") {
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  }

  oscillator.type = "square"; // Retro square wave
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + 0.3
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// ===== Background Music System =====
let backgroundMusic = null;
let musicPlaying = false;
let musicEnabled = false;

function initBackgroundMusic() {
  if (!backgroundMusic) {
    try {
      backgroundMusic = new Audio();

      // Use Flask's built-in static folder
      backgroundMusic.src = "/static/sound/retro-arcade-game-music-297305.mp3";
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3; // Set to 30% volume (adjust as needed)

      // Handle loading errors
      backgroundMusic.addEventListener("error", (e) => {
        console.error("Error loading music file from:", backgroundMusic.src);
        console.error(
          "Make sure the file is in: static/sound/retro-arcade-game-music-297305.mp3"
        );
        console.error("Error details:", e);

        const musicIcon = document.getElementById("musicIcon");
        const musicText = document.getElementById("musicText");
        musicIcon.innerText = "❌";
        musicText.innerText = "FILE NOT FOUND";
      });

      // Log when music is ready
      backgroundMusic.addEventListener("canplaythrough", () => {
        console.log("✓ Background music loaded successfully!");
      });

      console.log("Attempting to load music from:", backgroundMusic.src);
    } catch (error) {
      console.error("Failed to create Audio element:", error);
      return false;
    }
  }
  return true;
}

async function playBackgroundMusic() {
  if (!initBackgroundMusic()) {
    console.error("Failed to initialize music");
    return;
  }

  try {
    // Reset to beginning if needed
    backgroundMusic.currentTime = 0;

    // Play the audio
    await backgroundMusic.play();

    musicPlaying = true;
    musicEnabled = true;
    console.log("Music started playing");
  } catch (error) {
    console.error("Failed to play music:", error);
    // Show error in UI
    const musicIcon = document.getElementById("musicIcon");
    const musicText = document.getElementById("musicText");
    musicIcon.innerText = "❌";
    musicText.innerText = "PLAY FAILED";
  }
}

function stopBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    musicPlaying = false;
    console.log("Music stopped");
  }
}

async function toggleMusic() {
  const musicToggle = document.getElementById("musicToggle");
  const musicIcon = document.getElementById("musicIcon");
  const musicText = document.getElementById("musicText");

  if (musicPlaying) {
    stopBackgroundMusic();
    musicEnabled = false;
    musicIcon.innerText = "🔇";
    musicText.innerText = "MUSIC OFF";
    musicToggle.classList.remove("animate-pulse");
  } else {
    await playBackgroundMusic();
    if (musicPlaying) {
      musicIcon.innerText = "🔊";
      musicText.innerText = "MUSIC ON";
      musicToggle.classList.add("animate-pulse");
    }
  }
}

// ===== Event Listeners =====
document.getElementById("musicToggle").addEventListener("click", toggleMusic);

elements.nextBtn.addEventListener("click", () => {
  if (currentStep < totalSteps) {
    currentStep++;
    updateStepVisibility();
    playSound("click");
  }
});

elements.prevBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStepVisibility();
    playSound("click");
  }
});

elements.predictBtn.addEventListener("click", () => {
  makePrediction();
  playSound("click");
});

elements.resetBtn.addEventListener("click", () => {
  elements.resultOverlay.classList.add("hidden");
  elements.resultOverlay.classList.remove("flex");
  currentStep = 1;
  updateStepVisibility();
  updateAvatar();
  playSound("click");
});

// Input change listeners
inputs.sex.addEventListener("change", updateAvatar);
inputs.academic_level.addEventListener("change", updateAvatar);
inputs.stress_level.addEventListener("change", updateAvatar);
inputs.Caffeine_Intake_Frequency.addEventListener("change", updateStats);
inputs.screen_time_before_sleep.addEventListener("change", updateStats);
inputs.smoking_Frequency.addEventListener("change", updateStats);
["change", "input"].forEach((evt) => {
  inputs.study_start_time.addEventListener(evt, updateStudyTimeDisplay);
  inputs.study_end_time.addEventListener(evt, updateStudyTimeDisplay);
});

// ===== Initialize =====
updateStepVisibility();
updateSprite(); // Initialize sprite on page load
updateAvatar();
updateStudyTimeDisplay(); // Initialize time display
startRocketShow(); // launch retro rockets

// Music starts OFF by default (user must click to enable)
console.log("DreamWell initialized. Click music button to start audio.");
