/**
 * *** NOTE ON IMPORTING FROM ANGULAR AND NGUNIVERSAL IN THIS FILE ***
 *
 * If your application uses third-party dependencies, you'll need to
 * either use Webpack or the Angular CLI's `bundleDependencies` feature
 * in order to adequately package them for use on the server without a
 * node_modules directory.
 *
 * However, due to the nature of the CLI's `bundleDependencies`, importing
 * Angular in this file will create a different instance of Angular than
 * the version in the compiled application code. This leads to unavoidable
 * conflicts. Therefore, please do not explicitly import from @angular or
 * @nguniversal in this file. You can export any needed resources
 * from your application's main.server.ts file, as seen below with the
 * import for `ngExpressEngine`.
 */

import "zone.js/dist/zone-node";
const domino = require("domino");
import * as express from "express";
import { join } from "path";

import "localstorage-polyfill";

global["localStorage"] = localStorage;
if (typeof btoa === "undefined") {
  global["btoa"] = function (str) {
    return new Buffer(str, "binary").toString("base64");
  };
}

if (typeof atob === "undefined") {
  global["atob"] = function (b64Encoded) {
    return new Buffer(b64Encoded, "base64").toString("binary");
  };
}
const fs = require("fs");
const path = require("path");
const templateA = fs
  .readFileSync(path.join("dist/browser", "index.html"))
  .toString();
const win = domino.createWindow(templateA);
win.Object = Object;
win.Math = Math;
global["window"] = win;
global["document"] = win.document;
global["branch"] = null;
global["object"] = win.object;

// const cookieonsent = require("cookieconsent");
// global["cookieconsent"] = cookieonsent;
// Express server
const app = express();

var httpsOn = require("https");

//  https ssl configuration start

var privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/devnode.devtechnosys.tech/privkey.pem",
  "utf8"
);
var certificate = fs.readFileSync(
  "/etc/letsencrypt/live/devnode.devtechnosys.tech/cert.pem",
  "utf8"
);
var ca = fs.readFileSync(
  "/etc/letsencrypt/live/devnode.devtechnosys.tech/chain.pem",
  "utf8"
);
var credentials = { key: privateKey, cert: certificate, ca: ca };
var https = httpsOn.createServer(credentials, app);

// end
const PORT = process.env.PORT || 17334;

const DIST_FOLDER = join(process.cwd(), "dist/browser");

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP,
  ngExpressEngine,
  provideModuleMap,
} = require("./dist/server/main");

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine(
  "html",
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)],
  })
);

app.set("view engine", "html");
app.set("views", DIST_FOLDER);

// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Serve static files from /browser
app.get(
  "*.*",
  express.static(DIST_FOLDER, {
    maxAge: "1y",
  })
);

// All regular routes use the Universal engine
app.get("*", (req, res) => {
  res.render("index", { req });
});

// Start up the Node server

var server = https.listen(PORT, () => {
  console.log("Well done, now I am listening on ", PORT);
});

// app.listen(PORT, () => {
//   console.log(`Node Express server listening on http://localhost:${PORT}`);
// });
