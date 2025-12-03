# Carrera de Algoritmos de Ordenamiento - Paralelo

Aplicación web interactiva que ejecuta una carrera entre 5 algoritmos de ordenamiento diferentes usando **Web Workers** para lograr verdadero paralelismo multi-hilo.

## Algoritmos Implementados

1. **Ordenamiento Burbuja** (Bubble Sort) - O(n²)
2. **Quick Sort** - O(n log n) promedio
3. **Método de Inserción** (Insertion Sort) - O(n²)
4. **Búsqueda Secuencial** - O(n²)
5. **Búsqueda Binaria** - O(n² log n)

## Características

- **Ejecución paralela real**: Cada algoritmo se ejecuta en su propio hilo usando Web Workers
- **Multi-núcleo**: Aprovecha múltiples núcleos del CPU para ejecutar algoritmos simultáneamente
- **Interfaz interactiva**: Visualización en tiempo real del progreso y resultados
- **Medición precisa**: Utiliza `performance.now()` para mediciones de alta precisión
- **Tamaños variables**: Prueba con arrays de 100 a 50,000 elementos

## Requisitos

Para que Web Workers funcione correctamente, la aplicación **debe ser servida desde un servidor web**. No funcionará abriendo el archivo HTML directamente (file://) debido a restricciones de seguridad del navegador.

## Cómo Ejecutar

### Opción 1: Usar http-server (Node.js)

Si tienes Node.js instalado:

```bash
# Instalar http-server globalmente (solo una vez)
npm install -g http-server

# En el directorio del proyecto, ejecutar:
http-server

# Abrir en el navegador:
# http://localhost:8080
```

### Opción 2: Usar Python

Si tienes Python instalado:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Abrir en el navegador:
# http://localhost:8000
```

### Opción 3: Usar Visual Studio Code

Si usas VS Code:

1. Instalar la extensión **Live Server**
2. Abrir el proyecto en VS Code
3. Click derecho en `index.html` → "Open with Live Server"

### Opción 4: Usar extensión de navegador

Para Chrome/Edge:
1. Instalar la extensión **Web Server for Chrome**
2. Configurar el directorio del proyecto
3. Iniciar el servidor

## Uso de la Aplicación

1. **Configurar tamaño del array**: Selecciona entre 100 y 50,000 elementos
2. **Iniciar carrera**: Click en el botón "Iniciar Carrera"
3. **Ver progreso**: Observa en tiempo real cómo cada algoritmo avanza
4. **Analizar resultados**:
   - Podio con los 3 mejores tiempos
   - Tabla completa de resultados ordenados
   - Tiempos de ejecución en milisegundos

## Arquitectura Técnica

### Web Workers

Cada algoritmo se ejecuta en su propio Worker (hilo independiente):

```
Main Thread (UI)
    ├─ Worker 1: Bubble Sort
    ├─ Worker 2: Quick Sort
    ├─ Worker 3: Insertion Sort
    ├─ Worker 4: Sequential Search
    └─ Worker 5: Binary Search
```

### Ventajas del Paralelismo

- **No bloquea la UI**: La interfaz permanece responsiva
- **Aprovecha múltiples núcleos**: Los algoritmos corren simultáneamente en diferentes núcleos del CPU
- **Tiempos reales**: Los tiempos de ejecución reflejan el rendimiento real de cada algoritmo
- **Escalabilidad**: Puede manejar arrays grandes sin congelar el navegador

## Estructura del Proyecto

```
proyecto-final-paralelos/
├── index.html              # Interfaz de usuario
├── main.js                 # Lógica principal y control de workers
├── worker.js               # Web Worker con algoritmos de ordenamiento
├── algorithms.js           # (Opcional) Algoritmos para referencia
├── styles.css              # Estilos de la aplicación
├── PSEUDOCODIGOS.md        # Pseudocódigos de los algoritmos
├── GUIA_DOCUMENTACION.md   # Guía de documentación
└── README.md               # Este archivo
```

## Comparación: Async vs Web Workers

### Versión Anterior (Async/Await)
- ❌ Ejecución secuencial en un solo hilo
- ❌ Un solo núcleo del CPU
- ✅ Funciona con file://
- ✅ Más simple de implementar

### Versión Actual (Web Workers)
- ✅ Ejecución paralela real
- ✅ Múltiples núcleos del CPU
- ✅ Mejor rendimiento en hardware multi-núcleo
- ⚠️ Requiere servidor web (no file://)

## Notas Técnicas

- **Timeout**: Los workers tienen un timeout de 5 minutos para prevenir ejecuciones infinitas
- **Terminación**: Cada worker se termina automáticamente al completar su tarea
- **Manejo de errores**: Errores de workers son capturados y reportados
- **Verificación**: Cada resultado es verificado para confirmar que está correctamente ordenado

## Documentación Adicional

- **PSEUDOCODIGOS.md**: Contiene el pseudocódigo detallado de cada algoritmo
- **GUIA_DOCUMENTACION.md**: Guía completa para documentar el proyecto

## Troubleshooting

### Error: "Worker construction failed"
- **Causa**: Intentando abrir con file://
- **Solución**: Usar un servidor web (ver sección "Cómo Ejecutar")

### Error: CORS policy
- **Causa**: Configuración incorrecta del servidor
- **Solución**: Verificar que el servidor permita acceso a .js files

### Los algoritmos no inician
- **Causa**: Web Workers no soportados o bloqueados
- **Solución**:
  - Usar navegador moderno (Chrome, Firefox, Edge, Safari)
  - Verificar que JavaScript esté habilitado
  - Revisar consola del navegador para errores

## Navegadores Soportados

- ✅ Chrome 4+
- ✅ Firefox 3.5+
- ✅ Safari 4+
- ✅ Edge (todas las versiones)
- ✅ Opera 10.6+

## Licencia

Proyecto educativo para el curso de Programación Paralela.
