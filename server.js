import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// pasta onde o build é gerado: dist ou build
const distPath = path.join(__dirname, 'dist');

// serve arquivos estáticos (JS/CSS/imagens) do build
app.use(express.static(distPath));

// rota de health opcional
app.get('/health', (_req, res) => {
    res.send('OK');
});

// rota de diagnostics opcional (se quiser manter)
app.get('/diagnostics', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// TODAS as outras rotas, incluindo "/", devolvem o index.html compilado
app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
