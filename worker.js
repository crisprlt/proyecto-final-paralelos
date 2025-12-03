// ========== WEB WORKER PARA EJECUCIÓN PARALELA DE ALGORITMOS ==========

/**
 * Este worker ejecuta algoritmos de ordenamiento en un hilo separado
 * permitiendo verdadero paralelismo multi-núcleo
 */

// ========== ALGORITMOS DE ORDENAMIENTO CON REPORTE DE PROGRESO ==========

/**
 * Ordenamiento Burbuja (Bubble Sort)
 * Complejidad: O(n²)
 */
function bubbleSort(arr, progressCallback) {
    const array = [...arr];
    const n = array.length;
    const totalIterations = n - 1;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }

        // Reportar progreso cada iteración del bucle externo
        if (progressCallback) {
            const progress = ((i + 1) / totalIterations) * 100;
            progressCallback(progress);
        }
    }

    return array;
}

/**
 * Quick Sort
 * Complejidad: O(n log n) promedio
 */
function quickSort(arr, progressCallback, progressState = null) {
    if (arr.length <= 1) {
        return arr;
    }

    // En la primera llamada, establecer el estado de progreso
    if (progressState === null) {
        progressState = {
            totalSize: arr.length,
            processedCount: 0
        };
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

    // Incrementar elementos procesados y reportar progreso
    progressState.processedCount += arr.length;
    if (progressCallback && progressState.totalSize > 0) {
        const progress = Math.min((progressState.processedCount / progressState.totalSize) * 100, 99);
        progressCallback(progress);
    }

    const sortedLeft = left.length > 0 ? quickSort(left, progressCallback, progressState) : [];
    const sortedRight = right.length > 0 ? quickSort(right, progressCallback, progressState) : [];

    return [...sortedLeft, ...middle, ...sortedRight];
}

/**
 * Método de Inserción (Insertion Sort)
 * Complejidad: O(n²)
 */
function insertionSort(arr, progressCallback) {
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

        // Reportar progreso cada iteración
        if (progressCallback) {
            const progress = (i / (n - 1)) * 100;
            progressCallback(progress);
        }
    }

    return array;
}

/**
 * Búsqueda Secuencial aplicada al ordenamiento
 * Complejidad: O(n²)
 */
function sequentialSearchSort(arr, progressCallback) {
    const array = [...arr];
    const sorted = [];
    const totalElements = array.length;

    while (array.length > 0) {
        let minIndex = 0;
        for (let i = 1; i < array.length; i++) {
            if (array[i] < array[minIndex]) {
                minIndex = i;
            }
        }
        sorted.push(array[minIndex]);
        array.splice(minIndex, 1);

        // Reportar progreso basado en elementos ordenados
        if (progressCallback) {
            const progress = (sorted.length / totalElements) * 100;
            progressCallback(progress);
        }
    }

    return sorted;
}

/**
 * Búsqueda Binaria aplicada al ordenamiento
 * Complejidad: O(n² log n)
 */
function binarySearchSort(arr, progressCallback) {
    const array = [...arr];
    const n = array.length;

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

        // Reportar progreso cada iteración
        if (progressCallback) {
            const progress = (i / (n - 1)) * 100;
            progressCallback(progress);
        }
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

// ========== MANEJADOR DE MENSAJES DEL WORKER ==========

/**
 * Escucha mensajes desde el hilo principal y ejecuta el algoritmo solicitado
 */
self.addEventListener('message', function(e) {
    const { algorithmName, data } = e.data;

    const startTime = performance.now();
    let sortedArray;
    let success = true;
    let error = null;

    // Callback para reportar progreso al hilo principal
    const progressCallback = (progress) => {
        self.postMessage({
            type: 'progress',
            algorithm: algorithmName,
            progress: Math.min(Math.round(progress), 100)
        });
    };

    try {
        // Ejecutar el algoritmo correspondiente con callback de progreso
        switch(algorithmName) {
            case 'bubble':
                sortedArray = bubbleSort(data, progressCallback);
                break;
            case 'quick':
                sortedArray = quickSort(data, progressCallback);
                break;
            case 'insertion':
                sortedArray = insertionSort(data, progressCallback);
                break;
            case 'sequential':
                sortedArray = sequentialSearchSort(data, progressCallback);
                break;
            case 'binary':
                sortedArray = binarySearchSort(data, progressCallback);
                break;
            default:
                throw new Error('Algoritmo desconocido: ' + algorithmName);
        }

        const endTime = performance.now();
        const executionTime = endTime - startTime;
        const isCorrect = verifySorted(sortedArray);

        // Enviar resultado final de vuelta al hilo principal
        self.postMessage({
            type: 'complete',
            algorithm: algorithmName,
            time: executionTime,
            success: true,
            isCorrect: isCorrect,
            resultPreview: sortedArray.slice(0, 10)
        });

    } catch (err) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        // Enviar error de vuelta al hilo principal
        self.postMessage({
            type: 'complete',
            algorithm: algorithmName,
            time: executionTime,
            success: false,
            error: err.message
        });
    }
});
