#!/usr/bin/env node
import { build } from 'esbuild'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))

// Get all external dependencies - include all react-native, expo, and other optional deps
const external = [
  'react',
  'react-dom',
  'react-native',
  'tamagui',
  '@tamagui/core',
  'fuse.js',
  'mapbox-gl',
  'react-native-safe-area-context',
  'expo-linking',
  'react-native-gifted-charts',
  'react-native-svg',
  'react-window',
  'react-native-gesture-handler',
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.optionalDependencies || {}),
]

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
  loader: {
    '.css': 'empty',
  },
}).catch((error) => {
  console.error('Build failed:', error.message)
  process.exit(1)
})

console.log('✅ Build complete!')
