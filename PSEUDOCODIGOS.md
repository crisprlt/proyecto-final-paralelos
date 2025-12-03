# Pseudocódigos de los Algoritmos Implementados

Este documento contiene los pseudocódigos de todos los algoritmos utilizados en el proyecto.

---

## 1. Búsqueda Secuencial

### Descripción
Recorre el arreglo elemento por elemento hasta encontrar el valor buscado.

### Pseudocódigo
```
ALGORITMO BusquedaSecuencial(arreglo, valor)
    PARA i = 0 HASTA longitud(arreglo) - 1 HACER
        SI arreglo[i] == valor ENTONCES
            RETORNAR i
        FIN SI
    FIN PARA
    RETORNAR -1  // No encontrado
FIN ALGORITMO
```

### Complejidad
- **Tiempo:** O(n)
- **Espacio:** O(1)

---

## 2. Búsqueda Binaria

### Descripción
Busca un elemento en un arreglo ordenado dividiendo repetidamente el espacio de búsqueda a la mitad.

### Pseudocódigo
```
ALGORITMO BusquedaBinaria(arreglo, valor)
    izquierda = 0
    derecha = longitud(arreglo) - 1

    MIENTRAS izquierda <= derecha HACER
        medio = (izquierda + derecha) / 2

        SI arreglo[medio] == valor ENTONCES
            RETORNAR medio
        SINO SI arreglo[medio] < valor ENTONCES
            izquierda = medio + 1
        SINO
            derecha = medio - 1
        FIN SI
    FIN MIENTRAS

    RETORNAR -1  // No encontrado
FIN ALGORITMO
```

### Complejidad
- **Tiempo:** O(log n)
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
```
ALGORITMO CarreraParalela(arreglo)
    // Crear workers para cada algoritmo
    workers = []
    resultados = []

    PARA CADA algoritmo EN [Burbuja, Quick, Insercion, Secuencial, Binaria] HACER
        worker = CrearWorker(algoritmo)
        Agregar worker a workers
    FIN PARA

    // Ejecutar todos en paralelo
    PARA CADA worker EN workers HACER
        worker.Ejecutar(arreglo)
    FIN PARA

    // Esperar resultados
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

### Para arreglos pequeños (< 1,000 elementos):
1. Quick Sort
2. Insertion Sort
3. Bubble Sort
4. Binary Search Sort
5. Sequential Search Sort

### Para arreglos medianos (1,000 - 10,000 elementos):
1. Quick Sort
2. Binary Search Sort
3. Insertion Sort
4. Bubble Sort
5. Sequential Search Sort

### Para arreglos grandes (> 10,000 elementos):
1. Quick Sort (significativamente más rápido)
2. Binary Search Sort
3. Insertion Sort
4. Bubble Sort
5. Sequential Search Sort (significativamente más lento)

---

## Conclusiones

- **Quick Sort** es generalmente el algoritmo más eficiente para ordenamiento
- **Bubble Sort** e **Insertion Sort** son útiles para arreglos pequeños o casi ordenados
- **Búsqueda Binaria** requiere que el arreglo esté ordenado previamente
- El uso de **paralelismo** permite ejecutar todos los algoritmos simultáneamente sin afectar el rendimiento individual
