import http from "http";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const port = 1000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIME_TYPES = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".png": "image/png",
	".jpg": "image/jpeg"
};

const server = http.createServer(async (req, res) => {
	// ROTA POST: Recebe os dados do formulário e grava no banco.json da pasta local
	if (req.method === "POST" && req.url === "/salvar") {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", async () => {
			try {
				const dados = JSON.parse(body);
				const caminhoBanco = path.join(__dirname, "banco.json");

				// Salva o JSON diretamente no diretório do projeto
				await fs.writeFile(caminhoBanco, JSON.stringify(dados, null, 2), "utf-8");

				res.statusCode = 200;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify({ message: "Salvo diretamente no projeto!" }));
			} catch (error) {
				res.statusCode = 500;
				res.setHeader("Content-Type", "application/json; charset=utf-8");
				res.end(JSON.stringify({ error: "Erro ao salvar o arquivo." }));
			}
		});

		return;
	}

	// Servidor de arquivos estáticos (site.html, index.js, style.css, etc.)
	let reqUrl = req.url === "/" ? "/site.html" : req.url;
	const filePath = path.join(__dirname, reqUrl);
	const extname = String(path.extname(filePath)).toLowerCase();

	const contentType = MIME_TYPES[extname] || "application/octet-stream";

	try {
		const content = await fs.readFile(filePath);
		res.statusCode = 200;
		res.setHeader("Content-Type", contentType);
		res.end(content);
	} catch (error) {
		if (error.code === "ENOENT") {
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Arquivo não encontrado");
		} else {
			res.statusCode = 500;
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Erro interno do servidor");
		}
	}
});

server.listen(port, () => {
	console.log(`Servidor rodando em: http://localhost:${port}/site.html`);
});