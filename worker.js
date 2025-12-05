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

        if (progressCallback) {
            const progress = ((i + 1) / totalIterations) * 100;
            progressCallback(progress);
        }
    }

    return array;
}

function quickSort(arr, progressCallback, progressState = null) {
    if (arr.length <= 1) {
        return arr;
    }

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

    progressState.processedCount += arr.length;
    if (progressCallback && progressState.totalSize > 0) {
        const progress = Math.min((progressState.processedCount / progressState.totalSize) * 100, 99);
        progressCallback(progress);
    }

    const sortedLeft = left.length > 0 ? quickSort(left, progressCallback, progressState) : [];
    const sortedRight = right.length > 0 ? quickSort(right, progressCallback, progressState) : [];

    return [...sortedLeft, ...middle, ...sortedRight];
}

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

        if (progressCallback) {
            const progress = (i / (n - 1)) * 100;
            progressCallback(progress);
        }
    }

    return array;
}

function sequentialSearch(arr, target, progressCallback) {
    const n = arr.length;

    for (let i = 0; i < n; i++) {
        if (progressCallback && i % 1000 === 0) {
            const progress = ((i + 1) / n) * 100;
            progressCallback(progress);
        }

        if (arr[i] === target) {
            if (progressCallback) progressCallback(100);
            return i;
        }
    }

    if (progressCallback) progressCallback(100);
    return -1;
}

function binarySearch(arr, target, progressCallback) {
    let left = 0;
    let right = arr.length - 1;
    let iterations = 0;
    const maxIterations = Math.ceil(Math.log2(arr.length)) + 1;

    while (left <= right) {
        iterations++;
        const mid = Math.floor((left + right) / 2);

        if (progressCallback) {
            const progress = (iterations / maxIterations) * 100;
            progressCallback(Math.min(progress, 99));
        }

        if (arr[mid] === target) {
            if (progressCallback) progressCallback(100);
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (progressCallback) progressCallback(100);
    return -1;
}

function verifySorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

self.addEventListener('message', function(e) {
    const { type, algorithmName, data, target } = e.data;

    const startTime = performance.now();

    const progressCallback = (progress) => {
        self.postMessage({
            type: 'progress',
            algorithm: algorithmName,
            progress: Math.min(Math.round(progress), 100)
        });
    };

    try {

        if (type === 'sort') {
            let sortedArray;

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
                default:
                    throw new Error('Algoritmo de ordenamiento desconocido: ' + algorithmName);
            }

            const endTime = performance.now();
            const executionTime = endTime - startTime;
            const isCorrect = verifySorted(sortedArray);

            self.postMessage({
                type: 'complete',
                algorithm: algorithmName,
                time: executionTime,
                success: true,
                isCorrect: isCorrect,
                resultPreview: sortedArray.slice(0, 10)
            });

        } else if (type === 'search') {
            let foundIndex;

            switch(algorithmName) {
                case 'sequential':
                    foundIndex = sequentialSearch(data, target, progressCallback);
                    break;
                case 'binary':
                    foundIndex = binarySearch(data, target, progressCallback);
                    break;
                default:
                    throw new Error('Algoritmo de búsqueda desconocido: ' + algorithmName);
            }

            const endTime = performance.now();
            const executionTime = endTime - startTime;

            self.postMessage({
                type: 'complete',
                algorithm: algorithmName,
                time: executionTime,
                success: true,
                found: foundIndex !== -1,
                position: foundIndex,
                target: target
            });

        } else {
            throw new Error('Tipo de operación desconocido: ' + type);
        }

    } catch (err) {
        const endTime = performance.now();
        const executionTime = endTime - startTime;

        self.postMessage({
            type: 'complete',
            algorithm: algorithmName,
            time: executionTime,
            success: false,
            error: err.message
        });
    }
});
