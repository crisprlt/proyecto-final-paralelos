// ========== ALGORITMOS - ARCHIVO DE REFERENCIA ==========
//
// NOTA: Este archivo contiene las implementaciones de referencia de los algoritmos.
// Las implementaciones reales que se ejecutan están en worker.js
//
// Los algoritmos se ejecutan en Web Workers (worker.js) para verdadero paralelismo.
// La lógica de control está en main.js

// ========== ALGORITMOS DE ORDENAMIENTO ==========

/**
 * Ordenamiento Burbuja (Bubble Sort)
 * Complejidad: O(n²)
 * Implementación real: worker.js línea 14-34
 */
function bubbleSort(arr) {
    const array = [...arr];
    const n = array.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
    }

    return array;
}

/**
 * Quick Sort
 * Complejidad: O(n log n) promedio
 * Implementación real: worker.js línea 40-79
 */
function quickSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const pivot = arr[Math.floor(arr.length / 2)];
    const left = [];
    const middle = [];
    const right = [];

    for (let element of arr) {
        if (element < pivot) {
            left.push(element);
        } else if (element > pivot) {
            right.push(element);
        } else {
            middle.push(element);
        }
    }

    return [...quickSort(left), ...middle, ...quickSort(right)];
}

/**
 * Método de Inserción (Insertion Sort)
 * Complejidad: O(n²)
 * Implementación real: worker.js línea 85-108
 */
function insertionSort(arr) {
    const array = [...arr];
    const n = array.length;

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            j--;
        }

        array[j + 1] = key;
    }

    return array;
}

// ========== ALGORITMOS DE BÚSQUEDA ==========

/**
 * Búsqueda Secuencial (Linear Search)
 * Complejidad: O(n)
 * Busca un valor en un arreglo recorriendo elemento por elemento
 * Implementación real: worker.js línea 116-134
 */
function sequentialSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Retorna la posición donde encontró el valor
        }
    }
    return -1; // No encontrado
}

/**
 * Búsqueda Binaria (Binary Search)
 * Complejidad: O(log n)
 * Busca un valor en un arreglo ORDENADO dividiendo el espacio de búsqueda a la mitad
 * IMPORTANTE: El arreglo DEBE estar ordenado
 * Implementación real: worker.js línea 140-168
 */
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid; // Encontrado
        } else if (arr[mid] < target) {
            left = mid + 1; // Buscar en la mitad derecha
        } else {
            right = mid - 1; // Buscar en la mitad izquierda
        }
    }

    return -1; // No encontrado
}

console.log('algorithms.js cargado (solo referencia, las implementaciones reales están en worker.js)');
