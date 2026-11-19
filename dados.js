// dados.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let baseDados = [];

try {
	const caminhoArquivo = path.join(__dirname, "banco.json");
	const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
	baseDados = JSON.parse(conteudo);
	console.log("--- DADOS LIDOS DO BANCO.JSON LOCAL ---");
} catch (error) {
	console.error("Erro ao ler o arquivo banco.json:", error.message);
	console.log("Faça o cadastro no formulário do navegador primeiro para criar o arquivo.");
}

// O export DEVE ficar no nível raiz do módulo (fora do try/catch)
export default baseDados;