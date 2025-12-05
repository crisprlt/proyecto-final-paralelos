# Medición Exacta de Memoria con Node.js

Este documento explica cómo usar el script `measure-memory.js` para obtener mediciones **exactas y precisas** del consumo de memoria de cada algoritmo.

## ¿Por qué Node.js?

A diferencia del navegador (que tiene limitaciones con `performance.memory`), Node.js proporciona:

- **`process.memoryUsage()`**: API detallada con métricas exactas
- **`process.hrtime.bigint()`**: Medición de tiempo de alta precisión (nanosegundos)
- **Garbage Collection forzado**: Control total sobre la recolección de basura con `--expose-gc`
- **Aislamiento**: Cada medición es independiente y precisa

## Métricas que se Miden

### Memoria

- **Heap Used**: Memoria del heap de JavaScript realmente utilizada por el algoritmo
- **RSS (Resident Set Size)**: Memoria física total del proceso
- **External**: Memoria de objetos C++ vinculados a objetos JavaScript
- **Array Buffers**: Memoria de ArrayBuffers y SharedArrayBuffers

### Tiempo

- **Mediana**: Valor medio de 5 mediciones (evita outliers)
- **Mínimo**: Mejor tiempo registrado
- **Máximo**: Peor tiempo registrado
- **Promedio**: Media de todas las mediciones

## Instalación

No se requiere instalación adicional, solo Node.js.

```bash
# Verificar que tienes Node.js instalado
node --version
```

## Uso Básico

### 1. Medición completa (ordenamiento + búsqueda)

```bash
node --expose-gc measure-memory.js
```

### 2. Medición solo de ordenamiento

```bash
node --expose-gc measure-memory.js --sort
```

### 3. Medición solo de búsqueda

```bash
node --expose-gc measure-memory.js --search
```

### 4. Cambiar tamaño del arreglo

```bash
node --expose-gc measure-memory.js --size 5000
node --expose-gc measure-memory.js --size 20000
node --expose-gc measure-memory.js --size 50000
```

### 5. Exportar resultados a JSON

```bash
node --expose-gc measure-memory.js --export
node --expose-gc measure-memory.js --export resultados.json
```

### 6. Combinaciones

```bash
# Solo ordenamiento con 15000 elementos y exportar
node --expose-gc measure-memory.js --sort --size 15000 --export

# Solo búsqueda con 25000 elementos
node --expose-gc measure-memory.js --search --size 25000
```

## Opciones de Línea de Comandos

| Opción | Descripción |
|--------|-------------|
| `--size <número>` | Tamaño del arreglo (por defecto: 10000) |
| `--sort` | Ejecutar solo benchmark de ordenamiento |
| `--search` | Ejecutar solo benchmark de búsqueda |
| `--export [archivo]` | Exportar resultados a JSON |
| `--no-gc` | No requerir `--expose-gc` (menos precisión) |
| `--help` | Mostrar ayuda |

## ¿Por qué `--expose-gc`?

El flag `--expose-gc` expone la función `global.gc()` que permite **forzar la recolección de basura** antes de cada medición.

**Ventajas:**
- Limpia memoria residual de mediciones anteriores
- Asegura que cada medición comience desde un estado limpio
- Reduce variabilidad entre mediciones

**Sin `--expose-gc`:**
- Las mediciones seguirán funcionando
- Pero pueden ser menos precisas
- El GC puede ejecutarse durante la medición y afectar los resultados

## Algoritmos Implementados

### Ordenamiento (5 algoritmos)

1. **Bubble Sort** - O(n²) tiempo, O(n) espacio
2. **Quick Sort** - O(n log n) tiempo promedio, O(log n) espacio
3. **Insertion Sort** - O(n²) tiempo, O(n) espacio
4. **Merge Sort** - O(n log n) tiempo, O(n) espacio
5. **Heap Sort** - O(n log n) tiempo, O(1) espacio

### Búsqueda (3 algoritmos)

1. **Sequential Search** - O(n) tiempo, O(1) espacio
2. **Binary Search** - O(log n) tiempo, O(1) espacio
3. **Jump Search** - O(√n) tiempo, O(1) espacio

## Ejemplo de Salida

```
======================================================================
SISTEMA DE MEDICIÓN EXACTA DE MEMORIA
======================================================================
Node.js: v20.10.0
Plataforma: darwin (arm64)
Memoria total del sistema: 16.00 GB
Memoria libre del sistema: 8.45 GB
GC forzado: Disponible ✓
======================================================================

======================================================================
BENCHMARK: ALGORITMOS DE ORDENAMIENTO
Tamaño del arreglo: 10,000 elementos
======================================================================
Arreglo generado: [7234, 1456, 9823, 4567, 2341...]

⏳ Midiendo Bubble Sort...
✓ Bubble Sort:
  Tiempo (mediana): 234.5678 ms
  Tiempo (rango): 230.1234 - 239.8765 ms
  Memoria Heap (máx): 320.08 KB
  Memoria RSS (máx): 1.25 MB
  Resultado correcto: ✓

⏳ Midiendo Quick Sort...
✓ Quick Sort:
  Tiempo (mediana): 8.7654 ms
  Tiempo (rango): 8.2341 - 9.4567 ms
  Memoria Heap (máx): 400.12 KB
  Memoria RSS (máx): 890.00 KB
  Resultado correcto: ✓

...

======================================================================
RESULTADOS FINALES - ORDENAMIENTO (Ordenado por Tiempo)
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

## Formato del JSON Exportado

```json
{
  "timestamp": "2025-12-05T10:30:45.123Z",
  "node_version": "v20.10.0",
  "platform": "darwin",
  "arch": "arm64",
  "sorting": [
    {
      "algorithm": "Quick Sort",
      "time_ms": 8.7654,
      "memory_bytes": 409720,
      "memory_formatted": "400.12 KB",
      "is_correct": true,
      "time_stats": {
        "median": 8.7654,
        "min": 8.2341,
        "max": 9.4567,
        "avg": 8.8901
      },
      "memory_stats": {
        "heapUsed": {
          "median": 398234,
          "max": 409720,
          "formatted": "400.12 KB"
        },
        "rss": {
          "max": 911360,
          "formatted": "890.00 KB"
        }
      }
    }
  ],
  "searching": [...]
}
```

## Cómo Funciona la Medición

### 1. Calentamiento (Warm-up)
Ejecuta el algoritmo una vez antes de medir para:
- Permitir optimizaciones JIT del motor V8
- Evitar que la primera medición sea artificialmente lenta

### 2. Múltiples Iteraciones
Ejecuta cada algoritmo **5 veces** para:
- Obtener estadísticas confiables
- Identificar y evitar outliers
- Calcular mediana (más robusta que el promedio)

### 3. Garbage Collection Forzado
Antes de cada medición:
- Fuerza GC con `global.gc()`
- Espera 100ms para que se complete
- Asegura estado limpio de memoria

### 4. Medición con Alta Precisión
- `process.hrtime.bigint()`: Precisión de nanosegundos
- `process.memoryUsage()`: Snapshot detallado de memoria
- Calcula diferencia antes/después de la ejecución

### 5. Estadísticas Robustas
- **Mediana**: Resistente a outliers extremos
- **Máximo**: Representa el pico real de uso de memoria
- **Rango**: Muestra variabilidad de las mediciones

## Comparación: Node.js vs Navegador

| Aspecto | Navegador (`performance.memory`) | Node.js (`process.memoryUsage()`) |
|---------|----------------------------------|-----------------------------------|
| **Disponibilidad** | Requiere `--enable-precise-memory-info` | Siempre disponible |
| **Precisión** | Limitada, estimaciones | Alta, mediciones exactas |
| **Control GC** | No disponible | Disponible con `--expose-gc` |
| **Métricas** | Solo `usedJSHeapSize` | Heap, RSS, External, ArrayBuffers |
| **Aislamiento** | Compartido con toda la página | Proceso aislado |
| **Precisión tiempo** | `performance.now()` (~5μs) | `process.hrtime.bigint()` (~1ns) |

## Interpretación de Resultados

### Memoria Heap Used
La memoria **realmente consumida** por el algoritmo en el heap de JavaScript.

**Ejemplo:**
- **Bubble Sort (10,000 elementos)**: ~320 KB
  - Copia del arreglo: 160 KB (10,000 × 8 bytes × 2)
  - Overhead del array: ~80 KB
  - Variables temporales: ~80 KB

### Memoria RSS
Memoria física **total** del proceso. Incluye:
- Heap de JavaScript
- Stack
- Código del programa
- Librerías compartidas

**Nota:** RSS es siempre mayor que Heap Used.

### ¿Qué métrica usar?

- **Para comparar algoritmos**: Usa **Heap Used Max**
- **Para optimizar tu sistema**: Usa **RSS Max**
- **Para análisis detallado**: Revisa el JSON exportado

## Tips para Mediciones Precisas

### 1. Cerrar Aplicaciones
Cierra otras aplicaciones para reducir variabilidad del sistema.

### 2. Múltiples Ejecuciones
Si los resultados varían mucho, ejecuta varias veces y promedia:

```bash
for i in {1..5}; do
  node --expose-gc measure-memory.js --export "resultado_$i.json"
done
```

### 3. Tamaños de Arreglo Representativos
Prueba con diferentes tamaños para ver cómo escalan:

```bash
node --expose-gc measure-memory.js --size 1000
node --expose-gc measure-memory.js --size 10000
node --expose-gc measure-memory.js --size 100000
```

### 4. Ajustar Número de Iteraciones
Para arreglos muy grandes (>100,000), puedes editar el código y reducir `iterations` de 5 a 3 en la función `measureMemory()`.

## Troubleshooting

### "Cannot find module"
Asegúrate de estar en el directorio correcto:
```bash
cd /path/to/proyecto-final-paralelos
node --expose-gc measure-memory.js
```

### Mediciones de 0 bytes
- Asegúrate de usar `--expose-gc`
- Aumenta el tamaño del arreglo (algunos algoritmos usan muy poca memoria adicional)

### Resultados inconsistentes
- Verifica que no haya otros procesos consumiendo CPU/memoria
- Prueba con más iteraciones
- Usa la mediana en lugar del promedio

### Error "out of memory"
- Reduce el tamaño del arreglo con `--size`
- Ejecuta solo un benchmark a la vez (`--sort` o `--search`)

## Uso Programático (Como Módulo)

Puedes importar y usar las funciones en tus propios scripts:

```javascript
const {
  measureMemory,
  bubbleSort,
  quickSort,
  generateRandomArray
} = require('./measure-memory.js');

// Generar datos
const data = generateRandomArray(5000);

// Medir un algoritmo específico
const result = measureMemory(
  () => quickSort(data),
  'My Quick Sort Test'
);

console.log(`Tiempo: ${result.time.median.toFixed(4)} ms`);
console.log(`Memoria: ${result.memory.heapUsed.formatted}`);
```

## Ejemplos de Casos de Uso

### 1. Comparar diferentes tamaños

```bash
#!/bin/bash
for size in 1000 5000 10000 20000 50000; do
  echo "Probando con $size elementos..."
  node --expose-gc measure-memory.js --size $size --export "results_${size}.json"
done
```

### 2. Solo medir algoritmos rápidos

Edita `benchmarkSorting()` y comenta los algoritmos lentos:

```javascript
const algorithms = [
    // { name: 'Bubble Sort', fn: bubbleSort },  // Comentado
    { name: 'Quick Sort', fn: quickSort },
    // { name: 'Insertion Sort', fn: insertionSort },  // Comentado
    { name: 'Merge Sort', fn: mergeSort },
    { name: 'Heap Sort', fn: heapSort }
];
```

### 3. Analizar solo un algoritmo

```javascript
const { measureMemory, quickSort, generateRandomArray } = require('./measure-memory.js');

const data = generateRandomArray(10000);
const result = measureMemory(() => quickSort(data), 'Quick Sort Solo');

console.log(JSON.stringify(result, null, 2));
```

## Siguiente Paso

Para mediciones visuales y comparativas, considera usar:
- **clinic.js**: Profiling de rendimiento de Node.js
- **v8-profiler**: Profiling detallado del motor V8
- **heapdump**: Capturas del heap para análisis profundo

Instalar:
```bash
npm install -g clinic
clinic doctor -- node --expose-gc measure-memory.js
```

## Resumen de Comandos Rápidos

```bash
# Medición básica completa
node --expose-gc measure-memory.js

# Tamaño personalizado
node --expose-gc measure-memory.js --size 20000

# Solo ordenamiento
node --expose-gc measure-memory.js --sort

# Exportar resultados
node --expose-gc measure-memory.js --export resultados.json

# Todo combinado
node --expose-gc measure-memory.js --size 15000 --export --sort
```

## Conclusión

Este script te proporciona mediciones **exactas y confiables** del consumo de memoria de cada algoritmo usando las capacidades nativas de Node.js. A diferencia del navegador, obtienes:

- Mediciones reales (no estimaciones)
- Control total sobre el GC
- Estadísticas detalladas
- Alta precisión en tiempo y memoria
- Resultados reproducibles

Para tu proyecto académico, estos datos son ideales para análisis comparativos y conclusiones fundamentadas sobre la eficiencia de los algoritmos.
