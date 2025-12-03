// ========== ALGORITMOS DE ORDENAMIENTO ==========

/**
 * Ordenamiento Burbuja (Bubble Sort)
 * Complejidad: O(n²)
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

/**
 * Búsqueda Secuencial aplicada al ordenamiento
 * Complejidad: O(n²)
 */
function sequentialSearchSort(arr) {
    const array = [...arr];
    const sorted = [];

    while (array.length > 0) {
        let minIndex = 0;
        for (let i = 1; i < array.length; i++) {
            if (array[i] < array[minIndex]) {
                minIndex = i;
            }
        }
        sorted.push(array[minIndex]);
        array.splice(minIndex, 1);
    }

    return sorted;
}

/**
 * Búsqueda Binaria aplicada al ordenamiento
 * Complejidad: O(n² log n)
 */
function binarySearchSort(arr) {
    const array = [...arr];

    for (let i = 1; i < array.length; i++) {
        let key = array[i];

        let left = 0;
        let right = i - 1;

        while (left <= right) {
            let mid = Math.floor((left + right) / 2);
            if (array[mid] > key) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }

        const position = left;
        for (let j = i - 1; j >= position; j--) {
            array[j + 1] = array[j];
        }
        array[position] = key;
    }

    return array;
}

/**
 * Verifica que un arreglo esté ordenado correctamente
 */
function verifySorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

/**
 * Ejecuta un algoritmo de forma asíncrona
 */
async function executeAlgorithm(algorithmName, data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const startTime = performance.now();
            let sortedArray;

            try {
                switch(algorithmName) {
                    case 'bubble':
                        sortedArray = bubbleSort(data);
                        break;
                    case 'quick':
                        sortedArray = quickSort(data);
                        break;
                    case 'insertion':
                        sortedArray = insertionSort(data);
                        break;
                    case 'sequential':
                        sortedArray = sequentialSearchSort(data);
                        break;
                    case 'binary':
                        sortedArray = binarySearchSort(data);
                        break;
                    default:
                        throw new Error('Algoritmo desconocido');
                }

                const endTime = performance.now();
                const executionTime = endTime - startTime;
                const isCorrect = verifySorted(sortedArray);

                resolve({
                    algorithm: algorithmName,
                    time: executionTime,
                    success: true,
                    isCorrect: isCorrect,
                    resultPreview: sortedArray.slice(0, 10)
                });
            } catch (error) {
                const endTime = performance.now();
                const executionTime = endTime - startTime;

                resolve({
                    algorithm: algorithmName,
                    time: executionTime,
                    success: false,
                    error: error.message
                });
            }
        }, 0);
    });
}
