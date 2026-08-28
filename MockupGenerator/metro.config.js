const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Prevent Metro from resolving Node built-in modules (stream, events)
// that are deep dependencies of @supabase/supabase-js
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
