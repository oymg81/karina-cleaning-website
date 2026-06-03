import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID': JSON.stringify(env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''),
      'process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID': JSON.stringify(env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''),
      'process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY': JSON.stringify(env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''),
    }
  }
})
