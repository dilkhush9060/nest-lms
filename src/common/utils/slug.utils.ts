export function generateSlug(
  value: string,
  options?: { unique?: boolean; replacement?: string },
): string {
  if (!value) return '';
  const replacement = options?.replacement ?? '-';
  let slug = value.trim().toLowerCase();
  slug = slug.replace(/[^a-z0-9]+/g, replacement);
  slug = slug.replace(new RegExp(`^${replacement}+|${replacement}+$`, 'g'), '');

  if (options?.unique) {
    slug = `${slug}-${Date.now()}`;
  }

  return slug;
}
