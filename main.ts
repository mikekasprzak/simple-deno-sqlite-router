import { Application, Router } from "@oak/oak";   // Router: handles URL requests
import { Eta } from "@eta-dev/eta";               // Eta: HTML template engine (i.e. <%= data %>, <% javascript code %>) 
import { DB } from "@sqlite";                     // DB: SQLite database access
//import * as XML from "@xml";                      // XML parsing

const router = new Router();
const eta = new Eta({ views: import.meta.dirname });
const db = new DB("test.db");
const port = 8080;

// Testing XML parsing
//using file = await Deno.open("hello.xml");
//console.log(XML.parse(file));


// Handle GET requests for the root URL
router.get("/", (ctx) => {
  ctx.response.body = eta.render("./index", { 
    "data": db.query("SELECT * FROM people"), 
    "pathParams": ctx.params,                       // /:var1/:var2
    "searchParams": ctx.request.url.searchParams    // ?var1=value1&var2=value2
  });
});

// Handle GET requests for the /dog URL
router.get("/dog", (ctx) => {
  ctx.response.body = eta.render("./index", { 
    "data": db.query("SELECT name, upper(name) FROM people"), 
    "pathParams": ctx.params,                       // /:var1/:var2
    "searchParams": ctx.request.url.searchParams    // ?var1=value1&var2=value2
  });
});

// Setup and start the server
const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Server listening on http://localhost:${port}`);
app.listen({ port: port });
