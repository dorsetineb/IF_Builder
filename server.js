import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Pasta de build do Vite exportada (padrão é 'dist')
const distPath = path.join(__dirname, 'dist');

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(distPath));

// Rotas de diagnóstico
app.get('/health', (req, res) => {
    res.send('OK');
});

// Qualquer outra rota entrega o index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
