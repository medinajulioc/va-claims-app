import { format } from "date-fns";

/**
 * Format a date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

/**
 * Format a date with time for display
 * @param date Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date): string {
  return format(date, "MMM d, yyyy h:mm a");
}

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const time = new Date(date);
  const diff = now.getTime() - time.getTime();

  // Convert milliseconds to seconds
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) {
    return "just now";
  }

  // Convert seconds to minutes
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  // Convert minutes to hours
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  // Convert hours to days
  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  // Convert days to weeks
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  }

  // Convert weeks to months
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? "" : "s"} ago`;
  }

  // Convert months to years
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

/**
 * Truncate text to a specific length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Generate a slug from text
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

/**
 * Get initials from a name
 * @param name Full name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Format a number for display (e.g., 1000 -> 1k)
 * @param num Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

/**
 * Helper to generate a placeholder image URL or fallback
 * @param type Type of placeholder
 * @param id Optional ID for generating a consistent color
 * @returns Placeholder image URL
 */
export function getPlaceholderImage(type: "post" | "community" | "profile", id?: string): string {
  // Default fallback
  const fallback = "/images/community/placeholder.svg";

  if (!id) return fallback;

  // Generate a consistent color based on the ID
  const colorIndex = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 6;
  const colors = ["blue", "green", "red", "purple", "orange", "teal"];
  const color = colors[colorIndex];

  // Return a placeholder based on the type
  switch (type) {
    case "post":
      return `/images/community/post-placeholder-${color}.svg`;
    case "community":
      return `/images/community/community-placeholder-${color}.svg`;
    case "profile":
      return `/images/community/profile-placeholder-${color}.svg`;
    default:
      return fallback;
  }
}

/**
 * Get a CSS class string for card background based on environment
 * @param isDarkMode Whether the environment is in dark mode
 * @returns CSS class string
 */
export function getCardBackgroundClass(isDarkMode: boolean): string {
  return isDarkMode ? "bg-black/25 hover:bg-black/35" : "bg-white/95 hover:bg-white";
}
