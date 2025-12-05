# Cómo Iniciar el Proyecto

## Proyecto con 2 Opciones

Este proyecto tiene **2 formas de ejecutarse**:

### 1️⃣ Versión Web (Interfaz Visual)
Ideal para demostraciones y visualización de resultados en tiempo real.

### 2️⃣ Versión Node.js (Medición Exacta)
Ideal para obtener mediciones precisas de memoria y tiempo de ejecución.

---

## 1️⃣ VERSIÓN WEB (Interfaz Visual)

### Requisitos
- Navegador web moderno (Chrome, Firefox, Edge, Safari)
- Servidor HTTP local

### Paso 1: Iniciar Servidor Local

Elige una de estas opciones:

**Opción A - Python 3:**
```bash
cd proyecto-final-paralelos
python3 -m http.server 8888
```

**Opción B - Python 2:**
```bash
cd proyecto-final-paralelos
python -m SimpleHTTPServer 8888
```

**Opción C - Node.js (si tienes instalado):**
```bash
cd proyecto-final-paralelos
npx http-server -p 8888
```

**Opción D - PHP:**
```bash
cd proyecto-final-paralelos
php -S localhost:8888
```

### Paso 2: Abrir en el Navegador

Abre tu navegador y ve a:
```
http://localhost:8888
```

### Uso de la Interfaz Web

1. **Ajustar tamaño del arreglo**: Usa el control numérico (100-50,000 elementos)

2. **Ejecutar Ordenamiento**:
   - Clic en "Iniciar Carrera de Ordenamiento"
   - Verás 3 algoritmos corriendo en paralelo
   - Se mostrará el podio con los resultados

3. **Ejecutar Búsqueda**:
   - Primero ejecuta ordenamiento (necesario para búsqueda binaria)
   - Ingresa un valor a buscar o usa "Generar Aleatorio"
   - Clic en "Iniciar Carrera de Búsqueda"
   - Se compararán búsqueda secuencial vs binaria

4. **Ver resultados**:
   - Tiempos en milisegundos
   - Uso de memoria (estimado o real según configuración)
   - Posiciones en el ranking

### Mediciones de Memoria en la Web

Por defecto, las mediciones web son **estimaciones** marcadas con "(est)".

**Para mediciones reales**, inicia Chrome con el flag especial:

**Mac:**
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --enable-precise-memory-info http://localhost:8888
```

**Windows:**
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" --enable-precise-memory-info http://localhost:8888
```

**Linux:**
```bash
google-chrome --enable-precise-memory-info http://localhost:8888
```

Más detalles: Ver `COMO_HABILITAR_MEDICION_MEMORIA.md`

---

## 2️⃣ VERSIÓN NODE.JS (Medición Exacta)

### Requisitos
- Node.js instalado (v14 o superior)

Verifica tu versión:
```bash
node --version
```

### Uso Básico

**Benchmark completo (ordenamiento + búsqueda):**
```bash
node --expose-gc measure-memory.js
```

**Solo ordenamiento:**
```bash
node --expose-gc measure-memory.js --sort
```

**Solo búsqueda:**
```bash
node --expose-gc measure-memory.js --search
```

**Cambiar tamaño del arreglo:**
```bash
node --expose-gc measure-memory.js --size 20000
```

**Exportar resultados a JSON:**
```bash
node --expose-gc measure-memory.js --export resultados.json
```

**Combinación:**
```bash
node --expose-gc measure-memory.js --sort --size 15000 --export
```

### ¿Por qué `--expose-gc`?

El flag `--expose-gc` permite forzar la recolección de basura antes de cada medición, lo que proporciona:
- Mediciones más precisas
- Estado limpio de memoria entre pruebas
- Menor variabilidad en resultados

**Sin `--expose-gc`:**
El script funcionará pero las mediciones serán menos precisas:
```bash
node measure-memory.js --no-gc
```

### Ejemplo de Salida

```
======================================================================
BENCHMARK: ALGORITMOS DE ORDENAMIENTO
Tamaño del arreglo: 10,000 elementos
======================================================================

⏳ Midiendo Bubble Sort...
✓ Bubble Sort:
  Tiempo (mediana): 234.5678 ms
  Memoria Heap (máx): 320.08 KB
  Resultado correcto: ✓

⏳ Midiendo Quick Sort...
✓ Quick Sort:
  Tiempo (mediana): 8.7654 ms
  Memoria Heap (máx): 400.12 KB
  Resultado correcto: ✓

======================================================================
RESULTADOS FINALES - ORDENAMIENTO
======================================================================
Pos | Algoritmo          | Tiempo (ms) | Memoria      | Correcto
----------------------------------------------------------------------
  1 | Quick Sort         |      8.7654 |   400.12 KB | ✓
  2 | Merge Sort         |     12.3456 |   640.00 KB | ✓
  3 | Heap Sort          |     15.6789 |   320.08 KB | ✓
  4 | Insertion Sort     |    123.4567 |   320.08 KB | ✓
  5 | Bubble Sort        |    234.5678 |   320.08 KB | ✓
======================================================================
```

Más detalles: Ver `README-MEDICION-EXACTA.md`

---

## Comparación: Web vs Node.js

| Característica | Versión Web | Versión Node.js |
|----------------|-------------|-----------------|
| **Interfaz** | Visual, interactiva | Terminal/consola |
| **Algoritmos Ordenamiento** | 3 (Bubble, Quick, Insertion) | 5 (+ Merge, Heap) |
| **Algoritmos Búsqueda** | 2 (Sequential, Binary) | 3 (+ Jump) |
| **Medición Memoria** | Estimada (o real con flag) | Exacta siempre |
| **Medición Tiempo** | ~5μs precisión | ~1ns precisión |
| **Paralelismo** | Sí (Web Workers) | No (secuencial) |
| **Exportar Datos** | No | Sí (JSON) |
| **Mejor para** | Demos, visualización | Análisis, reportes académicos |

---

## Estructura del Proyecto

```
proyecto-final-paralelos/
├── index.html              # Interfaz web principal
├── main.js                 # Lógica de control web
├── worker.js               # Workers paralelos (algoritmos web)
├── styles.css              # Estilos de la interfaz
├── measure-memory.js       # Script Node.js de medición
├── INICIO.md               # Este archivo
├── README.md               # Documentación general
├── README-MEDICION-EXACTA.md   # Detalles de medición Node.js
└── COMO_HABILITAR_MEDICION_MEMORIA.md  # Config Chrome
```

---

## Troubleshooting

### Problema: "No se puede abrir el archivo HTML directamente"

**Solución**: No uses `file://`, necesitas un servidor HTTP local. Ver Paso 1 de la Versión Web.

### Problema: "performance.memory is undefined"

**Solución**: Estás viendo estimaciones. Para mediciones reales, usa el flag de Chrome (ver arriba).

### Problema: "node: command not found"

**Solución**: Instala Node.js desde https://nodejs.org/

### Problema: "Los workers no funcionan"

**Solución**: Asegúrate de usar un servidor HTTP, los Web Workers no funcionan con `file://`

### Problema: "Búsqueda binaria no encuentra el valor"

**Solución**: Primero ejecuta el ordenamiento. La búsqueda binaria requiere un arreglo ordenado.

---

## Comandos Rápidos

### Iniciar Web (Mac/Linux)
```bash
cd proyecto-final-paralelos
python3 -m http.server 8888 &
open http://localhost:8888
```

### Iniciar Web (Windows)
```cmd
cd proyecto-final-paralelos
python -m http.server 8888
start http://localhost:8888
```

### Medición Completa Node.js
```bash
cd proyecto-final-paralelos
node --expose-gc measure-memory.js --export resultados.json
```

### Ver Resultados JSON
```bash
cat resultados.json
# o en Windows:
type resultados.json
```

---

## Recomendaciones

### Para Demostraciones
✅ Usa la **versión web**
- Interfaz visual atractiva
- Animaciones de progreso en tiempo real
- Fácil de mostrar a una audiencia

### Para Reportes Académicos
✅ Usa la **versión Node.js**
- Mediciones exactas y reproducibles
- Datos exportables en JSON
- Estadísticas detalladas (mediana, min, max)

### Para Comparaciones Completas
✅ Usa **ambas versiones**
- Web: Demostrar paralelismo con Web Workers
- Node.js: Análisis profundo de rendimiento

---

## Próximos Pasos

1. **Explora la versión web**: Inicia el servidor y prueba diferentes tamaños de arreglo

2. **Ejecuta mediciones exactas**: Usa Node.js para obtener datos precisos

3. **Experimenta con tamaños**: Prueba con 1,000 / 10,000 / 50,000 elementos

4. **Analiza los resultados**: Compara tiempos y memoria entre algoritmos

5. **Exporta datos**: Genera JSONs para incluir en tu reporte

---

¿Necesitas ayuda adicional? Revisa:
- `README.md` - Información general del proyecto
- `README-MEDICION-EXACTA.md` - Detalles técnicos de Node.js
- `COMO_HABILITAR_MEDICION_MEMORIA.md` - Configuración de Chrome
