import { serve } from "bun";
import index from "./index.html";

const server = serve({
  routes: {
    "/": index,
    "/file": async (req) => {
      const rangeHeader = req.headers.get("Range");
      const file = Bun.file(
        "/Users/antoni-ostrowski/Library/Mobile Documents/com~apple~CloudDocs/Torë it apart_(feat. SeptembersRich) (prod. T99)_(WWE).mp3",
      );

      console.log("hit file route");

      if (rangeHeader) {
        const parts = rangeHeader.split("=")[1].split("-");
        const start = parseInt(parts[0], 10);
        // if no end specified, we set it to the end of the file
        const end = parts[1] ? parseInt(parts[1], 10) : file.size - 1;

        return new Response(file.slice(start, end + 1), {
          status: 206,
          headers: {
            "Content-Range": `bytes ${start}-${end}/${file.size}`,
            "Accept-Ranges": "bytes",
          },
        });
      } else {
        // If no Range header, serve the full file
        console.log("Serving full file");
        return new Response(file, {
          headers: {
            "Accept-Ranges": "bytes",
          },
        });
      }
    },
  },
  development: true,
});
console.log(`Server running at http://localhost:${server.port}`);
// const song = Bun.file(
//   "/Users/antoni-ostrowski/Library/Mobile Documents/com~apple~CloudDocs/Torë it apart_(feat. SeptembersRich) (prod. T99)_(WWE).mp3",
// );
