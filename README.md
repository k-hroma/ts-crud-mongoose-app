# 🥘 Recipes API - TypeScript + MongoDB + Mongoose 

Este proyecto es una API backend construida con TypeScript y Mongoose para gestionar recetas de cocina almacenadas en MongoDB. Permite crear, obtener, actualizar y eliminar recetas mediante funciones CRUD.

## 🚀 Tecnologías

- Node.js
- TypeScript
- Mongoose (ODM para MongoDB)
- MongoDB

## 📁 Estructura del Proyecto

```
app/
├── .env                # Variables de entorno (no versionado)
├── .env.example        # Ejemplo de archivo de entorno
├── .gitignore          # Archivos y carpetas ignoradas por git
├── package.json        # Dependencias y scripts del proyecto
├── tsconfig.json       # Configuración de TypeScript
├── node_modules/       # Dependencias instaladas (autogenerado)
└── src/
    ├── index.ts        # Punto de entrada principal (CRUD + tests manuales)
    └── config/
        └── mongo.ts    # Conexión a MongoDB
```

## 📦 Dependencias principales

Estas son algunas de las dependencias clave que se usan en el proyecto:

- **mongoose**: ODM para interactuar con MongoDB
- **dotenv**: Carga variables de entorno desde `.env`
- **typescript**: Superset de JavaScript tipado
- **ts-node**: Permite ejecutar archivos `.ts` sin compilarlos manualmente

> ⚙️ Asegurate de tener `ts-node` y `typescript` instalados globalmente o como devDependencies.

## 📋 Tipado

El código utiliza interfaces TypeScript para garantizar seguridad de tipos:

- `IRecipe`: estructura del documento de receta
- `IIngredients`: ingredientes de una receta
- `RecipeInput` / `RecipeUpdateInput`: entrada para crear o actualizar
- `QueryResponse`: formato estándar de respuesta

## ⚙️ Funcionalidades

- ✅ Crear una receta
- 📖 Obtener todas las recetas
- 🔍 Buscar receta por ID
- ✏️ Actualizar receta por ID
- ❌ Eliminar receta por ID

## 🔧 Configuración

1. Copiar el archivo `.env.example` a `.env` y completar la URI de conexión a MongoDB:

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/tu-db
```

2. Instalar dependencias:

```bash
npm install
```

3. Ejecutar el proyecto:

```bash
ts-node src/index.ts
```

## ✅ Ejemplo de respuesta

```json
{
  "success": true,
  "message": "Recipe created successfully",
  "data": {
    "title": "Spinach Pie",
    "ingredients": [...],
    "preparationTime": 45,
    "isVegetarian": true
  }
}
```

## 🧪 Tests manuales

El archivo `src/index.ts` incluye llamadas a funciones CRUD con ejemplos listos para ejecutar.

---

## 📝 Licencia

MIT

---

Desarrollado por [[khroma](https://github.com/k-hroma)]
