import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const distPath = path.join(__dirname, 'dist');

// Middleware to log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.send('Server is running properly via Node.js!');
});

// Diagnostics endpoint to inspect server state
app.get('/diagnostics', (req, res) => {
    let output = `<h1>Diagnostics</h1>`;
    output += `<p><strong>Current Directory:</strong> ${__dirname}</p>`;
    output += `<p><strong>Dist Path:</strong> ${distPath}</p>`;

    // Check dist existence
    if (fs.existsSync(distPath)) {
        output += `<p style="color:green">DIST folder exists.</p>`;

        // List files in dist
        try {
            const files = fs.readdirSync(distPath);
            output += `<h3>Files in dist:</h3><ul>`;
            files.forEach(file => {
                const stat = fs.statSync(path.join(distPath, file));
                output += `<li>${file} (${stat.isDirectory() ? 'DIR' : stat.size + ' bytes'})</li>`;
            });
            output += `</ul>`;

            // Inspect index.html content
            const indexPath = path.join(distPath, 'index.html');
            if (fs.existsSync(indexPath)) {
                const content = fs.readFileSync(indexPath, 'utf8');
                output += `<h3>dist/index.html First 500 chars:</h3>`;
                output += `<pre style="background:#f0f0f0; padding:10px; border:1px solid #ccc;">${content.slice(0, 500).replace(/</g, '&lt;')}</pre>`;

                if (content.includes('src="/src/index.tsx"')) {
                    output += `<h2 style="color:red">DETECTED SOURCE FILE REFERENCE! Build failed or copied wrong file.</h2>`;
                } else if (content.includes('/assets/index')) {
                    output += `<h2 style="color:green">DETECTED BUNDLED ASSETS. Build looks correct.</h2>`;
                }
            } else {
                output += `<h2 style="color:red">index.html NOT found in dist!</h2>`;
            }

        } catch (e) {
            output += `<p style="color:red">Error reading dist: ${e.message}</p>`;
        }
    } else {
        output += `<p style="color:red">CRITICAL: DIST folder does NOT exist.</p>`;
    }

    res.send(output);
});

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle SPA routing
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');

    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(500).send('Application not built. Check /diagnostics');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
