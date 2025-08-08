import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repositoryName = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : ''
const isGithubActions = Boolean(process.env.GITHUB_ACTIONS)
const isUserSite = repositoryName.endsWith('.github.io')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGithubActions ? (isUserSite ? '/' : `/${repositoryName}/`) : '/',
})
