import jsonServer from "json-server";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

const routes = { "/api/*": "/$1" };

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Helpers
const makeToken = (u) => "mock-jwt-" + u.id;
const publicUser = (u) => { const { password, ...rest } = u; return rest; };

server.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: "Email y contraseña son obligatorios" });

  const db = router.db;
  const user = db.get("users").find({ email }).value();
  if (!user || user.password !== password) return res.status(401).json({ message: "Credenciales inválidas" });

  res.json({ token: makeToken(user), user: publicUser(user) });
});

server.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body || {};
  if (!name || !email || !password || !role) return res.status(400).json({ message: "Faltan campos" });

  const db = router.db;
  const exists = db.get("users").find({ email }).value();
  if (exists) return res.status(409).json({ message: "Email ya registrado" });

  const id = Math.random().toString(36).slice(2, 8);
  const user = { id, name, email, password, roles: [role] };
  db.get("users").push(user).write();
  res.status(201).json({ ok: true });
});

server.use(jsonServer.rewriter(routes));
server.use(router);

const PORT = process.env.MOCK_PORT || 4000;
server.listen(PORT, () => {
  console.log(`Mock API corriendo en http://localhost:${PORT}`);
});