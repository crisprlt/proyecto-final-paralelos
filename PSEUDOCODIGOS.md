# Pseudocódigos de los Algoritmos Implementados

Este documento contiene los pseudocódigos de todos los algoritmos utilizados en el proyecto.

---

## 1. Búsqueda Secuencial (Linear Search)

### Descripción
Busca un valor específico en un arreglo recorriendo elemento por elemento de principio a fin hasta encontrarlo.

### Pseudocódigo
```
ALGORITMO BusquedaSecuencial(arreglo, valor)
    PARA i = 0 HASTA longitud(arreglo) - 1 HACER
        SI arreglo[i] == valor ENTONCES
            RETORNAR i  // Retorna la posición donde encontró el valor
        FIN SI
    FIN PARA
    RETORNAR -1  // No encontrado
FIN ALGORITMO
```

### Características
- **NO requiere** que el arreglo esté ordenado
- Recorre los elementos secuencialmente
- En el peor caso, recorre todo el arreglo

### Complejidad
- **Tiempo:**
  - Mejor caso: O(1) - El elemento está en la primera posición
  - Caso promedio: O(n)
  - Peor caso: O(n) - El elemento está al final o no existe
- **Espacio:** O(1)

---

## 2. Búsqueda Binaria (Binary Search)

### Descripción
Busca un valor específico en un arreglo **ORDENADO** dividiendo repetidamente el espacio de búsqueda a la mitad. Compara el valor buscado con el elemento del medio y descarta la mitad donde no puede estar.

### Pseudocódigo
```
ALGORITMO BusquedaBinaria(arreglo, valor)
    izquierda = 0
    derecha = longitud(arreglo) - 1

    MIENTRAS izquierda <= derecha HACER
        medio = (izquierda + derecha) / 2

        SI arreglo[medio] == valor ENTONCES
            RETORNAR medio  // Retorna la posición donde encontró el valor
        SINO SI arreglo[medio] < valor ENTONCES
            izquierda = medio + 1  // Buscar en la mitad derecha
        SINO
            derecha = medio - 1    // Buscar en la mitad izquierda
        FIN SI
    FIN MIENTRAS

    RETORNAR -1  // No encontrado
FIN ALGORITMO
```

### Características
- **REQUIERE** que el arreglo esté ordenado (ascendente o descendente)
- Divide el espacio de búsqueda a la mitad en cada iteración
- Mucho más eficiente que búsqueda secuencial en arreglos grandes
- Utiliza el paradigma "divide y conquista"

### Complejidad
- **Tiempo:**
  - Mejor caso: O(1) - El elemento está en el medio
  - Caso promedio: O(log n)
  - Peor caso: O(log n)
- **Espacio:** O(1)

---

## 3. Ordenamiento de la Burbuja (Bubble Sort)

### Descripción
Compara elementos adyacentes y los intercambia si están en el orden incorrecto. Este proceso se repite hasta que el arreglo está ordenado.

### Pseudocódigo
```
ALGORITMO OrdenamientoBurbuja(arreglo)
    n = longitud(arreglo)

    PARA i = 0 HASTA n - 2 HACER
        PARA j = 0 HASTA n - i - 2 HACER
            SI arreglo[j] > arreglo[j + 1] ENTONCES
                // Intercambiar elementos
                temp = arreglo[j]
                arreglo[j] = arreglo[j + 1]
                arreglo[j + 1] = temp
            FIN SI
        FIN PARA
    FIN PARA

    RETORNAR arreglo
FIN ALGORITMO
```

### Complejidad
- **Tiempo:**
  - Peor caso: O(n²)
  - Mejor caso: O(n)
  - Promedio: O(n²)
- **Espacio:** O(1)

---

## 4. Quick Sort

### Descripción
Algoritmo de divide y conquista que selecciona un elemento como pivote y particiona el arreglo alrededor del pivote.

### Pseudocódigo
```
ALGORITMO QuickSort(arreglo)
    SI longitud(arreglo) <= 1 ENTONCES
        RETORNAR arreglo
    FIN SI

    pivote = arreglo[longitud(arreglo) / 2]
    izquierda = []
    medio = []
    derecha = []

    PARA CADA elemento EN arreglo HACER
        SI elemento < pivote ENTONCES
            Agregar elemento a izquierda
        SINO SI elemento > pivote ENTONCES
            Agregar elemento a derecha
        SINO
            Agregar elemento a medio
        FIN SI
    FIN PARA

    RETORNAR Concatenar(QuickSort(izquierda), medio, QuickSort(derecha))
FIN ALGORITMO
```

### Complejidad
- **Tiempo:**
  - Peor caso: O(n²)
  - Mejor caso: O(n log n)
  - Promedio: O(n log n)
- **Espacio:** O(log n) - O(n) dependiendo de la implementación

---

## 5. Método de Inserción (Insertion Sort)

### Descripción
Construye el arreglo ordenado final un elemento a la vez, insertando cada elemento en su posición correcta.

### Pseudocódigo
```
ALGORITMO MetodoInsercion(arreglo)
    n = longitud(arreglo)

    PARA i = 1 HASTA n - 1 HACER
        clave = arreglo[i]
        j = i - 1

        // Mover elementos mayores que clave una posición adelante
        MIENTRAS j >= 0 Y arreglo[j] > clave HACER
            arreglo[j + 1] = arreglo[j]
            j = j - 1
        FIN MIENTRAS

        arreglo[j + 1] = clave
    FIN PARA

    RETORNAR arreglo
FIN ALGORITMO
```

### Complejidad
- **Tiempo:**
  - Peor caso: O(n²)
  - Mejor caso: O(n)
  - Promedio: O(n²)
- **Espacio:** O(1)

---

## Tabla Comparativa de Complejidades

| Algoritmo | Mejor Caso | Caso Promedio | Peor Caso | Espacio |
|-----------|------------|---------------|-----------|---------|
| Búsqueda Secuencial | O(1) | O(n) | O(n) | O(1) |
| Búsqueda Binaria | O(1) | O(log n) | O(log n) | O(1) |
| Burbuja | O(n) | O(n²) | O(n²) | O(1) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) |
| Inserción | O(n) | O(n²) | O(n²) | O(1) |

---

## Implementación con Paralelismo

### Pseudocódigo del Flujo Principal

El programa está dividido en **2 competencias separadas**:

#### 1. Competencia de Ordenamiento
```
ALGORITMO CarreraOrdenamiento(arreglo)
    // Crear workers para cada algoritmo de ordenamiento
    workers = []
    resultados = []

    PARA CADA algoritmo EN [Burbuja, Quick, Insercion] HACER
        worker = CrearWorker(algoritmo)
        worker.Ejecutar('sort', arreglo)
        Agregar worker a workers
    FIN PARA

    // Esperar resultados (todos se ejecutan en paralelo)
    MIENTRAS NO todos_terminados HACER
        SI worker.terminado ENTONCES
            resultado = worker.ObtenerResultado()
            Agregar resultado a resultados
        FIN SI
    FIN MIENTRAS

    // Ordenar por tiempo de ejecución
    resultados = OrdenarPorTiempo(resultados)

    // Guardar el arreglo ordenado para la siguiente fase
    arregloOrdenado = ResultadoOrdenamiento

    RETORNAR resultados
FIN ALGORITMO
```

#### 2. Competencia de Búsqueda
```
ALGORITMO CarreraBusqueda(arregloOrdenado, valorBuscado)
    // IMPORTANTE: Requiere que el arreglo esté ordenado (de la fase anterior)

    SI arregloOrdenado está vacío ENTONCES
        ERROR "Primero ejecuta la carrera de ordenamiento"
    FIN SI

    // Crear workers para cada algoritmo de búsqueda
    workers = []
    resultados = []

    PARA CADA algoritmo EN [Secuencial, Binaria] HACER
        worker = CrearWorker(algoritmo)
        worker.Ejecutar('search', arregloOrdenado, valorBuscado)
        Agregar worker a workers
    FIN PARA

    // Esperar resultados (todos se ejecutan en paralelo)
    MIENTRAS NO todos_terminados HACER
        SI worker.terminado ENTONCES
            resultado = worker.ObtenerResultado()
            Agregar resultado a resultados
        FIN SI
    FIN MIENTRAS

    // Ordenar por tiempo de ejecución
    resultados = OrdenarPorTiempo(resultados)

    RETORNAR resultados
FIN ALGORITMO
```

---

## Análisis de Resultados Esperados

### Competencia de Ordenamiento

#### Para arreglos pequeños (< 1,000 elementos):
1. **Quick Sort** - Más rápido
2. **Insertion Sort** - Bueno para arreglos pequeños
3. **Bubble Sort** - El más lento

#### Para arreglos medianos (1,000 - 10,000 elementos):
1. **Quick Sort** - Significativamente más rápido
2. **Insertion Sort**
3. **Bubble Sort** - Significativamente más lento

#### Para arreglos grandes (> 10,000 elementos):
1. **Quick Sort** - Dominante por O(n log n)
2. **Insertion Sort** - Lento por O(n²)
3. **Bubble Sort** - Muy lento por O(n²)

### Competencia de Búsqueda

#### Para cualquier tamaño de arreglo:
1. **Búsqueda Binaria** - Siempre más rápida por O(log n)
2. **Búsqueda Secuencial** - Más lenta por O(n)

**Diferencia notable:** En un arreglo de 10,000 elementos:
- Búsqueda Binaria: máximo 14 comparaciones (log₂ 10,000 ≈ 13.3)
- Búsqueda Secuencial: promedio 5,000 comparaciones, peor caso 10,000

**IMPORTANTE:** La búsqueda binaria requiere un arreglo ordenado, por eso la competencia de búsqueda se ejecuta DESPUÉS de la competencia de ordenamiento.

---

## Conclusiones

### Sobre Ordenamiento:
- **Quick Sort** es el algoritmo más eficiente para ordenamiento en la mayoría de los casos
- **Insertion Sort** puede ser competitivo en arreglos pequeños o casi ordenados
- **Bubble Sort** tiene valor educativo pero es ineficiente en la práctica

### Sobre Búsqueda:
- **Búsqueda Binaria** es significativamente más rápida que la secuencial
- **Búsqueda Binaria REQUIERE** que el arreglo esté ordenado
- **Búsqueda Secuencial** funciona en arreglos ordenados y desordenados, pero es lenta
- La diferencia de rendimiento aumenta exponencialmente con el tamaño del arreglo

### Sobre Paralelismo:
- El uso de **Web Workers** permite ejecutar todos los algoritmos simultáneamente en hilos separados
- Cada algoritmo se ejecuta en un núcleo diferente del CPU (verdadero paralelismo)
- Los algoritmos NO se afectan entre sí durante la ejecución
- El resultado es una comparación justa de rendimiento real

### Arquitectura del Proyecto:
1. **Fase 1 (Ordenamiento):** Genera arreglo aleatorio → Ejecuta 3 algoritmos en paralelo → Guarda resultado ordenado
2. **Fase 2 (Búsqueda):** Usa arreglo ordenado → Define valor a buscar → Ejecuta 2 algoritmos en paralelo → Compara resultados
