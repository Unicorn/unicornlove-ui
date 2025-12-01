#!/usr/bin/env node
import { build } from 'esbuild'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

// Collect all packages to mark as external
const external = [
  'react',
  'react-dom',
  'react-native',
  'tamagui',
  '@tamagui/core',
  'mapbox-gl',
]

// Add all dependencies and peerDependencies
const allDeps = {
  ...(pkg.dependencies || {}),
  ...(pkg.peerDependencies || {}),
}

// Add specific React Native and Expo packages that might be imported
const rnPackages = [
  'react-native-safe-area-context',
  'react-native-gesture-handler',
  'react-native-svg',
  'react-native-web',
  'react-native-gifted-charts',
  'expo-linking',
  'expo-router',
]

// Add other packages that might be imported but not in dependencies
const otherPackages = [
  'fuse.js',
  'react-window',
  '@tamagui/config',
  '@tamagui/config/v4',
]

// Add all dependency keys, RN packages, and other packages
external.push(...Object.keys(allDeps))
external.push(...rnPackages)
external.push(...otherPackages)

await build({
  entryPoints: [
    'src/index.tsx',
    'src/types/geographic.ts',
    'src/types/phone.ts',
  ],
  bundle: true,
  format: 'esm',
  outdir: 'dist',
  external,
  sourcemap: true,
  platform: 'neutral',
  target: 'es2020',
  outExtension: {
    '.js': '.mjs',
  },
}).catch((error) => {
  console.error('Build failed:', error.message)
  process.exit(1)
})

console.log('✅ Build complete!')

