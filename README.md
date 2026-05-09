# Rick and Morty Explorer

Aplicación web desarrollada con React + TypeScript + Vite que consume la [API de Rick and Morty](https://rickandmortyapi.com/) para explorar personajes, episodios y localizaciones de la serie.

## Funcionalidades

- **Explorar personajes**: listado completo con búsqueda por nombre y filtros por estado (Alive, Dead, Unknown) y especie.
- **Detalle de personaje**: información completa (imagen, estado, especie, género, tipo, origen, localización) y lista de episodios en los que aparece.
- **Explorar episodios**: listado de episodios con búsqueda por nombre, código del episodio y fecha de emisión.
- **Detalle de episodio**: información del episodio y personajes que participan en él, con enlaces a sus fichas.
- **Carga dinámica**: botón "Cargar más" para ir acumulando resultados de la API paginada.
- **Favoritos**: marca personajes y episodios como favoritos. Los datos se guardan en `localStorage` y persisten entre sesiones.
- **Página de favoritos**: vista independiente con pestañas para personajes y episodios guardados.
- **Diseño responsive**: adaptado a móvil, tablet y escritorio con un tema visual inspirado en la serie.
- **Manejo de estados**: spinners de carga, mensajes de error y estados vacíos con feedback al usuario.

## Tecnologías

- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) (HashRouter)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide React](https://lucide.dev/)

## Cómo ejecutar en local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación se abrirá en `http://localhost:3000`.

## Cómo compilar para producción

```bash
npm run build
```

Se generará la carpeta `dist/` con los archivos estáticos listos para desplegar.

## Estructura del proyecto

```
src/
  components/     # Componentes reutilizables (tarjetas, navbar, layout, spinner...)
  components/ui/  # Componentes de shadcn/ui
  hooks/          # Custom hooks (useCharacters, useEpisodes, useFavorites)
  lib/            # Utilidades y llamadas a la API
  pages/          # Páginas principales (Home, Characters, Episodes, Favorites, detalles)
```

## Autor

**Ismael Alfaro Marin**

Proyecto académico para la entrega de ReactJS.
