import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Use 'dist' folder (Vite default build output)
const distPath = path.join(__dirname, 'dist');

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from the dist directory
app.use(express.static(distPath));

// Health check endpoint
app.get('/health', (req, res) => {
    res.send('OK');
});

// Handle SPA routing: redirect all other requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
