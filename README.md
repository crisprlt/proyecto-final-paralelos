# Proyecto Final - Algoritmos Paralelos

Comparación de algoritmos de ordenamiento y búsqueda con ejecución paralela usando Web Workers.

## 🎯 Características

- **Versión Web**: Interfaz visual interactiva con ejecución paralela
- **Versión Node.js**: Mediciones exactas de tiempo y memoria
- **3 Algoritmos de Ordenamiento**: Bubble Sort, Quick Sort, Insertion Sort
- **2 Algoritmos de Búsqueda**: Secuencial, Binaria
- **Paralelismo Real**: Web Workers ejecutan algoritmos en hilos separados

---

## 🚀 Inicio Rápido

### Opción 1: Versión Web (Interfaz Visual)

```bash
# Iniciar servidor
python3 -m http.server 8080

# O con Node.js
npx http-server -p 8080
```

Luego abre: `http://localhost:8080`

### Opción 2: Node.js (Mediciones Exactas)

```bash
# Benchmark completo
node --expose-gc measure-memory.js

# Solo ordenamiento
node --expose-gc measure-memory.js --sort

# Exportar resultados
node --expose-gc measure-memory.js --export resultados.json
```

---

## 📊 Diferencias entre Versiones

| Característica | Web | Node.js |
|----------------|-----|---------|
| **Interfaz** | Visual interactiva | Terminal/Consola |
| **Paralelismo** | ✅ Sí (Web Workers) | ❌ No (secuencial) |
| **Medición Tiempo** | ✅ Precisa | ✅ Muy precisa |
| **Medición Memoria** | ❌ No disponible | ✅ Exacta |
| **Algoritmos Ordenamiento** | 3 | 5 (+ Merge, Heap) |
| **Algoritmos Búsqueda** | 2 | 3 (+ Jump) |
| **Exportar Datos** | ❌ No | ✅ Sí (JSON) |
| **Mejor para** | Demos, presentaciones | Análisis, reportes |

---

## 📁 Estructura del Proyecto

```
proyecto-final-paralelos/
├── index.html              # Interfaz web
├── main.js                 # Control de la aplicación web
├── worker.js               # Algoritmos ejecutados en Web Workers
├── styles.css              # Estilos de la interfaz
├── measure-memory.js       # Script Node.js con mediciones exactas
├── README.md               # Este archivo
├── README-MEDICION-EXACTA.md  # Documentación Node.js detallada
└── INICIO.md               # Guía completa de inicio
```

---

## 💻 Uso de la Versión Web

1. **Ajustar tamaño del arreglo**: 100 - 50,000 elementos
2. **Iniciar ordenamiento**: Clic en "Iniciar Carrera de Ordenamiento"
3. **Ver resultados**: Los 3 algoritmos se ejecutan en paralelo
4. **Iniciar búsqueda**: Primero ordena, luego busca un valor
5. **Comparar**: Ve el podio con tiempos de ejecución

### Nota sobre Memoria en Web

La versión web **NO mide memoria**. Para mediciones de memoria usa la versión Node.js.

---

## 🔬 Uso de la Versión Node.js

### Comandos Básicos

```bash
# Benchmark completo (ordenamiento + búsqueda)
node --expose-gc measure-memory.js

# Solo ordenamiento
node --expose-gc measure-memory.js --sort

# Solo búsqueda
node --expose-gc measure-memory.js --search

# Tamaño personalizado
node --expose-gc measure-memory.js --size 20000

# Exportar a JSON
node --expose-gc measure-memory.js --export resultados.json
```

### Ejemplo de Salida

```
======================================================================
BENCHMARK: ALGORITMOS DE ORDENAMIENTO
Tamaño del arreglo: 10,000 elementos
======================================================================

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
======================================================================
```

### ¿Por qué `--expose-gc`?

Permite forzar la recolección de basura antes de cada medición para resultados más precisos.

---

## 📖 Algoritmos Implementados

### Ordenamiento

| Algoritmo | Complejidad Tiempo | Complejidad Espacio | Web | Node.js |
|-----------|-------------------|---------------------|-----|---------|
| Bubble Sort | O(n²) | O(n) | ✅ | ✅ |
| Quick Sort | O(n log n) | O(log n) | ✅ | ✅ |
| Insertion Sort | O(n²) | O(n) | ✅ | ✅ |
| Merge Sort | O(n log n) | O(n) | ❌ | ✅ |
| Heap Sort | O(n log n) | O(1) | ❌ | ✅ |

### Búsqueda

| Algoritmo | Complejidad | Requiere Ordenamiento | Web | Node.js |
|-----------|-------------|----------------------|-----|---------|
| Secuencial | O(n) | No | ✅ | ✅ |
| Binaria | O(log n) | Sí | ✅ | ✅ |
| Jump Search | O(√n) | Sí | ❌ | ✅ |

---

## 🎓 Para Proyectos Académicos

### Recomendación

1. **Usa la versión web** para demos y mostrar el paralelismo visual
2. **Usa Node.js** para obtener datos exactos de tiempo y memoria
3. **Exporta a JSON** para incluir tablas en tu reporte

### Ejemplo de Flujo de Trabajo

```bash
# 1. Genera datos con diferentes tamaños
node --expose-gc measure-memory.js --size 5000 --export datos_5k.json
node --expose-gc measure-memory.js --size 10000 --export datos_10k.json
node --expose-gc measure-memory.js --size 20000 --export datos_20k.json

# 2. Analiza los JSON para tu reporte
cat datos_10k.json

# 3. Muestra la versión web en tu presentación
python3 -m http.server 8080
```

---

## 🔧 Requisitos

### Para Versión Web
- Navegador moderno (Chrome, Firefox, Edge, Safari)
- Servidor HTTP local (Python, Node.js, PHP, etc.)

### Para Versión Node.js
- Node.js v14 o superior

Verifica tu versión:
```bash
node --version
```

---

## 📚 Documentación Adicional

- **INICIO.md**: Guía completa paso a paso
- **README-MEDICION-EXACTA.md**: Detalles técnicos de Node.js y medición de memoria

---

## 🐛 Troubleshooting

### "No puedo abrir el HTML directamente"
Necesitas un servidor HTTP. No uses `file://`. Ver sección de Inicio Rápido.

### "node: command not found"
Instala Node.js desde https://nodejs.org/

### "Los workers no funcionan"
Asegúrate de usar un servidor HTTP, no abrir el archivo directamente.

### "Búsqueda binaria no encuentra el valor"
La búsqueda binaria requiere un arreglo ordenado. Primero ejecuta el ordenamiento.

---

## 📝 Licencia

Proyecto académico - Universidad

---

## 👥 Autores

Proyecto Final - Algoritmos Paralelos
