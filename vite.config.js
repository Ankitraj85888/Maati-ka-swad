import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// Custom plugin to copy static HTML pages & assets into dist/
function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const distDir  = resolve(__dirname, 'dist');
      const srcDir   = resolve(__dirname);

      // Static HTML pages to copy
      const htmlPages = ['about.html','shop.html','cart.html','contact.html','login.html','product.html','admin.html'];
      htmlPages.forEach(file => {
        const src  = path.join(srcDir, file);
        const dest = path.join(distDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`✅ Copied ${file}`);
        }
      });

      // Copy static asset folders
      const folders = ['css', 'js', 'assets', 'public'];
      folders.forEach(folder => {
        const src  = path.join(srcDir, folder);
        const dest = path.join(distDir, folder);
        if (fs.existsSync(src)) {
          copyDirRecursive(src, dest);
          console.log(`✅ Copied ${folder}/`);
        }
      });
    }
  };
}

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath  = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export default defineConfig({
  plugins: [react(), copyStaticFiles()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'https://maati-ka-swad-backend.onrender.com'
    }
  },
  build: {
    outDir: 'dist',
  }
});
