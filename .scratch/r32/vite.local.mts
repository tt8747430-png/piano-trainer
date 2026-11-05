// The app's own config for this worktree: it serves the shared node_modules the worktree links to
// (fonts) and watches no files.
import base from '../../vite.config.ts'
const root = process.cwd()
export default {
  ...base,
  root,
  server: {
    ...base.server,
    fs: { allow: [root, '/home/user/piano-trainer/node_modules'] },
    // Other checkouts' edits reached this server as reloads; it is restarted after a change instead.
    watch: null,
  },
}
