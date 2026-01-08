import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('Server is running properly via Node.js!');
});

const distPath = path.join(__dirname, 'dist');

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Check if verification is needed
if (!fs.existsSync(distPath)) {
    console.error('CRITICAL: DIST folder not found at:', distPath);
}

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle SPA routing: redirect all other requests to index.html
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error('CRITICAL: index.html not found at:', indexPath);
        res.status(500).type('text/html').send(`
          <div style="font-family: sans-serif; padding: 2rem; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; border-radius: 8px; background: #fff0f0; color: #d00;">
              <h1>Erro de Implantação</h1>
              <p>O servidor Node.js está rodando, mas não encontrou o site compilado.</p>
              <hr style="border: 0; border-top: 1px solid #faa;">
              <p><strong>Caminho esperado:</strong> ${indexPath}</p>
              <p><strong>Diretório atual:</strong> ${__dirname}</p>
              <p><strong>Diagnóstico:</strong> O comando <code>npm run build</code> provavelmente falhou ou não foi executado.</p>
              <p><a href="/health">Teste de Saúde do Servidor (/health)</a></p>
          </div>
      `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Looking for build in: ${distPath}`);
});
