/**
 * Environment variable configuration with validation
 */

// Validate required environment variables
const requiredEnvVars: Record<string, string> = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
};

// Check for missing environment variables in production
if (process.env.NODE_ENV === 'production') {
  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

// Feature flags
const featureFlags = {
  claims: process.env.NEXT_PUBLIC_FEATURE_CLAIMS === 'true',
  appeals: process.env.NEXT_PUBLIC_FEATURE_APPEALS === 'true',
  forum: process.env.NEXT_PUBLIC_FEATURE_FORUM === 'true',
};

// Export typed environment variables
export const env = {
  ...requiredEnvVars,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  features: featureFlags,
}; 