import { FilterDto } from 'src/common/dto/filter.dto';

/**
 * Escape regex special characters in strings
 */
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts a dynamic FilterDto into a Mongoose filter object
 * - Boolean strings ("true"/"false") → boolean
 * - Numeric strings → number
 * - JSON strings → parsed object
 * - Other strings → regex (case-insensitive, escaped)
 */
export function buildMongoFilter(filterDto?: FilterDto): Record<string, any> {
  const filter: Record<string, any> = {};

  if (!filterDto) return filter;

  for (const [key, value] of Object.entries(filterDto)) {
    if (value === undefined) continue;

    // If value is a string
    if (typeof value === 'string') {
      const trimmed = value.trim();

      // Boolean conversion
      if (trimmed.toLowerCase() === 'true') {
        filter[key] = true;
        continue;
      } else if (trimmed.toLowerCase() === 'false') {
        filter[key] = false;
        continue;
      }

      // Numeric conversion
      const num = Number(trimmed);
      if (!isNaN(num)) {
        filter[key] = num;
        continue;
      }

      // Try JSON parse for objects/arrays
      try {
        const parsed: unknown = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed !== null) {
          filter[key] = parsed;
          continue;
        }
      } catch {
        // ignore
      }

      // Default: regex for strings (escaped)
      filter[key] = { $regex: escapeRegex(trimmed), $options: 'i' };
    }
    // Direct assignment if already number, boolean, or object
    else if (
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      (typeof value === 'object' && value !== null)
    ) {
      filter[key] = value;
    }
  }

  return filter;
}
