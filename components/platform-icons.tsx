import Image from "next/image";

// Map platform keys to icon image paths (add more as needed)
const PLATFORM_ICON_MAP: Record<string, string> = {
  leetcode: "/images/icons/icons8-leetcode-100.png",
  gfg: "/images/icons/icons8-geeksforgeeks-100.png",
  geeksforgeeks: "/images/icons/icons8-geeksforgeeks-100.png",
  codeforces: "/images/icons/icons8-codeforces-100.png",
  codechef: "/images/icons/icons8-codechef-100.png",
  default: "/globe.svg",
};

export function getPlatformKey(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host.includes("leetcode")) return "leetcode";
    if (host.includes("geeksforgeeks") || host.includes("gfg")) return "gfg";
    if (host.includes("codeforces")) return "codeforces";
    if (host.includes("codechef")) return "codechef";
    return "default";
  } catch {
    return "default";
  }
}

export function PlatformIcon({
  url,
  alt = "Platform",
}: {
  url: string;
  alt?: string;
}) {
  const key = getPlatformKey(url);
  const src = PLATFORM_ICON_MAP[key] || PLATFORM_ICON_MAP.default;
  return (
    <Image
      src={src}
      alt={alt}
      width={24}
      height={24}
      style={{ display: "inline-block" }}
    />
  );
}
