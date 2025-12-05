
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

    const sortedLeft = left.length > 0 ? quickSort(left) : [];
    const sortedRight = right.length > 0 ? quickSort(right) : [];

    return [...sortedLeft, ...middle, ...sortedRight];
}

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

function mergeSort(arr) {
    if (arr.length <= 1) {
        return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i++]);
        } else {
            result.push(right[j++]);
        }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
}

function heapSort(arr) {
    const array = [...arr];
    const n = array.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(array, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        heapify(array, i, 0);
    }

    return array;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}


function sequentialSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}

function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

function jumpSearch(arr, target) {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;

    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) {
            return -1;
        }
    }

    while (arr[prev] < target) {
        prev++;
        if (prev === Math.min(step, n)) {
            return -1;
        }
    }

    if (arr[prev] === target) {
        return prev;
    }

    return -1;
}


function generateRandomArray(size) {
    const array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 10000));
    }
    return array;
}

function verifySorted(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
            return false;
        }
    }
    return true;
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes.toFixed(2) + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}


function forceGarbageCollection() {
    if (global.gc) {
        global.gc();
        return true;
    }
    return false;
}


function measureMemory(fn, description = 'Function') {
    const measurements = [];
    const iterations = 5;

    fn();

    const hasGC = forceGarbageCollection();

    const waitTime = 100;
    const start = Date.now();
    while (Date.now() - start < waitTime) {
    }

    for (let i = 0; i < iterations; i++) {
        if (hasGC) {
            forceGarbageCollection();
        }

        const memBefore = process.memoryUsage();
        const startTime = process.hrtime.bigint();

        const result = fn();

        const endTime = process.hrtime.bigint();
        const memAfter = process.memoryUsage();

        const heapUsedDiff = memAfter.heapUsed - memBefore.heapUsed;
        const externalDiff = memAfter.external - memBefore.external;
        const rssDiff = memAfter.rss - memBefore.rss;
        const arrayBuffersDiff = memAfter.arrayBuffers - memBefore.arrayBuffers;

        const timeDiff = Number(endTime - startTime) / 1e6; 

        measurements.push({
            heapUsed: Math.max(0, heapUsedDiff),
            external: Math.max(0, externalDiff),
            rss: Math.max(0, rssDiff),
            arrayBuffers: Math.max(0, arrayBuffersDiff),
            time: timeDiff,
            result: result
        });

        const pauseStart = Date.now();
        while (Date.now() - pauseStart < 50) {
        }
    }

    const heapUsedValues = measurements.map(m => m.heapUsed).sort((a, b) => a - b);
    const timeValues = measurements.map(m => m.time).sort((a, b) => a - b);

    const medianHeapUsed = heapUsedValues[Math.floor(heapUsedValues.length / 2)];
    const medianTime = timeValues[Math.floor(timeValues.length / 2)];

    const maxHeapUsed = Math.max(...heapUsedValues);
    const maxRss = Math.max(...measurements.map(m => m.rss));

    return {
        description: description,
        time: {
            median: medianTime,
            min: Math.min(...timeValues),
            max: Math.max(...timeValues),
            avg: timeValues.reduce((a, b) => a + b, 0) / timeValues.length
        },
        memory: {
            heapUsed: {
                median: medianHeapUsed,
                max: maxHeapUsed,
                formatted: formatBytes(maxHeapUsed)
            },
            rss: {
                max: maxRss,
                formatted: formatBytes(maxRss)
            }
        },
        iterations: iterations,
        hasGC: hasGC,
        result: measurements[0].result 
    };
}


function benchmarkSorting(arraySize) {
    console.log('\n' + '='.repeat(70));
    console.log(`BENCHMARK: ALGORITMOS DE ORDENAMIENTO`);
    console.log(`Tamaño del arreglo: ${arraySize.toLocaleString()} elementos`);
    console.log('='.repeat(70));

    const testArray = generateRandomArray(arraySize);
    console.log(`Arreglo generado: [${testArray.slice(0, 5).join(', ')}...]`);

    const algorithms = [
        { name: 'Bubble Sort', fn: bubbleSort },
        { name: 'Quick Sort', fn: quickSort },
        { name: 'Insertion Sort', fn: insertionSort },
        { name: 'Merge Sort', fn: mergeSort },
        { name: 'Heap Sort', fn: heapSort }
    ];

    const results = [];

    for (const algo of algorithms) {
        console.log(`\n⏳ Midiendo ${algo.name}...`);

        const measurement = measureMemory(
            () => algo.fn([...testArray]),
            algo.name
        );

        const isCorrect = verifySorted(measurement.result);

        results.push({
            name: algo.name,
            time: measurement.time.median,
            memory: measurement.memory.heapUsed.max,
            memoryFormatted: measurement.memory.heapUsed.formatted,
            isCorrect: isCorrect,
            measurement: measurement
        });

        console.log(`✓ ${algo.name}:`);
        console.log(`  Tiempo (mediana): ${measurement.time.median.toFixed(4)} ms`);
        console.log(`  Tiempo (rango): ${measurement.time.min.toFixed(4)} - ${measurement.time.max.toFixed(4)} ms`);
        console.log(`  Memoria Heap (máx): ${measurement.memory.heapUsed.formatted}`);
        console.log(`  Memoria RSS (máx): ${measurement.memory.rss.formatted}`);
        console.log(`  Resultado correcto: ${isCorrect ? '✓' : '✗'}`);
    }

    results.sort((a, b) => a.time - b.time);

    console.log('\n' + '='.repeat(70));
    console.log('RESULTADOS FINALES - ORDENAMIENTO (Ordenado por Tiempo)');
    console.log('='.repeat(70));
    console.log('Pos | Algoritmo          | Tiempo (ms) | Memoria      | Correcto');
    console.log('-'.repeat(70));

    results.forEach((result, index) => {
        const pos = (index + 1).toString().padStart(3);
        const name = result.name.padEnd(18);
        const time = result.time.toFixed(4).padStart(11);
        const memory = result.memoryFormatted.padStart(12);
        const correct = result.isCorrect ? '✓' : '✗';

        console.log(`${pos} | ${name} | ${time} | ${memory} | ${correct}`);
    });

    console.log('='.repeat(70));

    return results;
}


function benchmarkSearching(arraySize, targetMode = 'existing') {
    console.log('\n' + '='.repeat(70));
    console.log(`BENCHMARK: ALGORITMOS DE BÚSQUEDA`);
    console.log(`Tamaño del arreglo: ${arraySize.toLocaleString()} elementos`);
    console.log('='.repeat(70));

    const testArray = generateRandomArray(arraySize);
    const sortedArray = [...testArray].sort((a, b) => a - b);

    let target;
    if (targetMode === 'existing') {
        target = sortedArray[Math.floor(sortedArray.length / 2)];
        console.log(`Buscando valor EXISTENTE: ${target} (posición esperada: ${sortedArray.indexOf(target)})`);
    } else {
        target = -1;
        console.log(`Buscando valor NO EXISTENTE: ${target}`);
    }

    const algorithms = [
        { name: 'Sequential Search', fn: sequentialSearch, needsSorted: false },
        { name: 'Binary Search', fn: binarySearch, needsSorted: true },
        { name: 'Jump Search', fn: jumpSearch, needsSorted: true }
    ];

    const results = [];

    for (const algo of algorithms) {
        console.log(`\n⏳ Midiendo ${algo.name}...`);

        const arrayToUse = algo.needsSorted ? sortedArray : testArray;

        const measurement = measureMemory(
            () => algo.fn(arrayToUse, target),
            algo.name
        );

        const foundIndex = measurement.result;
        const found = foundIndex !== -1;

        results.push({
            name: algo.name,
            time: measurement.time.median,
            memory: measurement.memory.heapUsed.max,
            memoryFormatted: measurement.memory.heapUsed.formatted,
            found: found,
            position: foundIndex,
            measurement: measurement
        });

        console.log(`✓ ${algo.name}:`);
        console.log(`  Tiempo (mediana): ${measurement.time.median.toFixed(4)} ms`);
        console.log(`  Tiempo (rango): ${measurement.time.min.toFixed(4)} - ${measurement.time.max.toFixed(4)} ms`);
        console.log(`  Memoria Heap (máx): ${measurement.memory.heapUsed.formatted}`);
        console.log(`  Resultado: ${found ? `Encontrado en posición ${foundIndex}` : 'No encontrado'}`);
    }

    results.sort((a, b) => a.time - b.time);

    console.log('\n' + '='.repeat(70));
    console.log('RESULTADOS FINALES - BÚSQUEDA (Ordenado por Tiempo)');
    console.log('='.repeat(70));
    console.log('Pos | Algoritmo          | Tiempo (ms) | Memoria      | Resultado');
    console.log('-'.repeat(70));

    results.forEach((result, index) => {
        const pos = (index + 1).toString().padStart(3);
        const name = result.name.padEnd(18);
        const time = result.time.toFixed(4).padStart(11);
        const memory = result.memoryFormatted.padStart(12);
        const foundText = result.found ? `Pos ${result.position}` : 'No encontrado';

        console.log(`${pos} | ${name} | ${time} | ${memory} | ${foundText}`);
    });

    console.log('='.repeat(70));

    return results;
}


function exportResultsToJSON(sortResults, searchResults, filename = 'benchmark-results.json') {
    const fs = require('fs');

    const output = {
        timestamp: new Date().toISOString(),
        node_version: process.version,
        platform: process.platform,
        arch: process.arch,
        sorting: sortResults.map(r => ({
            algorithm: r.name,
            time_ms: r.time,
            memory_bytes: r.memory,
            memory_formatted: r.memoryFormatted,
            is_correct: r.isCorrect,
            time_stats: r.measurement.time,
            memory_stats: r.measurement.memory
        })),
        searching: searchResults.map(r => ({
            algorithm: r.name,
            time_ms: r.time,
            memory_bytes: r.memory,
            memory_formatted: r.memoryFormatted,
            found: r.found,
            position: r.position,
            time_stats: r.measurement.time,
            memory_stats: r.measurement.memory
        }))
    };

    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`\n✓ Resultados exportados a: ${filename}`);
}


function printUsage() {
    console.log(`
Uso: node measure-memory.js [opciones]

Opciones:
  --size <número>      Tamaño del arreglo (por defecto: 10000)
  --sort               Ejecutar solo benchmark de ordenamiento
  --search             Ejecutar solo benchmark de búsqueda
  --export [archivo]   Exportar resultados a JSON (por defecto: benchmark-results.json)
  --no-gc              No requerir --expose-gc (menos precisión)
  --help               Mostrar esta ayuda

Ejemplos:
  node --expose-gc measure-memory.js --size 5000
  node --expose-gc measure-memory.js --sort --export resultados.json
  node --expose-gc measure-memory.js --search --size 20000

IMPORTANTE: Para mediciones más precisas, ejecuta con --expose-gc:
  node --expose-gc measure-memory.js

Sin --expose-gc, las mediciones seguirán funcionando pero serán menos precisas.
`);
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        printUsage();
        return;
    }

    if (!global.gc && !args.includes('--no-gc')) {
        console.log('⚠️  ADVERTENCIA: --expose-gc no está habilitado');
        console.log('   Para mediciones más precisas, ejecuta:');
        console.log('   node --expose-gc measure-memory.js');
        console.log('');
        console.log('   Continuando sin GC forzado...');
        console.log('');
    } else if (global.gc) {
        console.log('✓ Garbage Collection forzado habilitado');
    }

    // Parsear argumentos
    let arraySize = 10000;
    let runSort = true;
    let runSearch = true;
    let exportResults = false;
    let exportFilename = 'benchmark-results.json';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--size' && i + 1 < args.length) {
            arraySize = parseInt(args[i + 1]);
            i++;
        } else if (args[i] === '--sort') {
            runSearch = false;
        } else if (args[i] === '--search') {
            runSort = false;
        } else if (args[i] === '--export') {
            exportResults = true;
            if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
                exportFilename = args[i + 1];
                i++;
            }
        }
    }

    console.log('\n' + '='.repeat(70));
    console.log('SISTEMA DE MEDICIÓN EXACTA DE MEMORIA');
    console.log('='.repeat(70));
    console.log(`Node.js: ${process.version}`);
    console.log(`Plataforma: ${process.platform} (${process.arch})`);
    console.log(`Memoria total del sistema: ${formatBytes(require('os').totalmem())}`);
    console.log(`Memoria libre del sistema: ${formatBytes(require('os').freemem())}`);
    console.log(`GC forzado: ${global.gc ? 'Disponible ✓' : 'No disponible (usa --expose-gc)'}`);
    console.log('='.repeat(70));

    let sortResults = [];
    let searchResults = [];

    if (runSort) {
        sortResults = benchmarkSorting(arraySize);
    }

    if (runSearch) {
        searchResults = benchmarkSearching(arraySize, 'existing');
    }

    if (exportResults && (sortResults.length > 0 || searchResults.length > 0)) {
        exportResultsToJSON(sortResults, searchResults, exportFilename);
    }

    console.log('\n✓ Benchmark completado\n');
}

if (require.main === module) {
    main();
}

module.exports = {
    bubbleSort,
    quickSort,
    insertionSort,
    mergeSort,
    heapSort,
    sequentialSearch,
    binarySearch,
    jumpSearch,
    measureMemory,
    benchmarkSorting,
    benchmarkSearching,
    generateRandomArray
};
