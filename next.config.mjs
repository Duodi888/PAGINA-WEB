import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'api.dicebear.com' }],
  },
  webpack: (config, { webpack: wp }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
      'react-router-dom': path.resolve(__dirname, 'src/stubs/react-router-dom.js'),
    }
    // Replace Vite supabase client with Next.js-compatible version
    config.plugins.push(
      new wp.NormalModuleReplacementPlugin(
        /[/\\]lib[/\\]supabase(\.ts)?$/,
        path.resolve(__dirname, 'src/lib/supabase.next.ts')
      )
    )
    return config
  },
}

export default nextConfig
