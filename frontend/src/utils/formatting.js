
// Capitalize the first letter of the string
export function capitalizeFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Convert to title case
export function toTitleCase(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}
