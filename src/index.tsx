// import open from 'open'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { serve } from 'bun'
import cors from 'cors'
import index from './index.html'
import { appRouter } from './trpc'
const server = serve({
  routes: {
    '/*': index,
    '/file/:filePath': (req) => {
      const rangeHeader = req.headers.get('Range')
      console.log('req path - ', decodeURIComponent(req.params.filePath))
      const file = Bun.file(decodeURIComponent(req.params.filePath))
      console.log('hit file route - ', file.name)

      if (rangeHeader) {
        const parts = rangeHeader.split('=')[1].split('-')
        const start = parseInt(parts[0], 10)
        // if no end specified, we set it to the end of the file
        const end = parts[1] ? parseInt(parts[1], 10) : file.size - 1

        return new Response(file.slice(start, end + 1), {
          status: 206,
          headers: {
            'Content-Range': `bytes ${start}-${end}/${file.size}`,
            'Accept-Ranges': 'bytes',
          },
        })
      } else {
        // If no Range header, serve the full file
        console.log('Serving full file')
        return new Response(file, {
          headers: {
            'Accept-Ranges': 'bytes',
          },
        })
      }
    },
  },

  development: process.env.NODE_ENV !== 'production' && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
})
const trpcServer = createHTTPServer({
  middleware: cors(),
  router: appRouter,
})

trpcServer.listen(3001)
console.log('🚀 Trpc running at ', 3001)
console.log(`🚀 Server running at ${server.url}`)
// void open('http://localhost:3000').then(() => {
//   console.log('Browser opened')
// })
