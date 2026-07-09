/** 拼接带 Vite base 的静态资源路径（兼容 GitHub Pages 子路径） */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  const normalized = path.replace(/^\//, '');
  return `${base}${normalized}`;
}

/** 用于 CSS backgroundImage 等 */
export function assetUrl(path: string): string {
  return `url('${asset(path)}')`;
}
