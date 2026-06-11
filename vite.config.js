import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'pages/home.html'),
        login: resolve(__dirname, 'pages/login.html'),
        register: resolve(__dirname, 'pages/register.html'),
        perfil: resolve(__dirname, 'pages/perfil.html'),
        carrito: resolve(__dirname, 'pages/carrito.html'),
        search: resolve(__dirname, 'pages/search.html'),
        vender: resolve(__dirname, 'pages/vender.html'),
      }
    }
  }
});
