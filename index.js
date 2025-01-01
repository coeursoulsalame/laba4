const readline = require('readline');
const fs = require('fs');

const alphabet = "АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя";

const numAlph = {};

for (let i = 0; i < alphabet.length; i++) {
    numAlph[alphabet[i]] = i;
}

function Encode(text, key) {
    let code = '';

    for (let i = 0; i < text.length; i++) {
        if (alphabet.includes(text[i])) {
            code += alphabet[(numAlph[text[i]] + numAlph[key[i % key.length]]) % alphabet.length];
        } else {
            code += text[i]; // Сохраняем символ, если он не в алфавите (например, пробел или перенос строки)
        }
    }
    return code;
}

function Decode(text, key) {
    let code = '';

    for (let i = 0; i < text.length; i++) {
        if (alphabet.includes(text[i])) {
            code += alphabet[(numAlph[text[i]] - numAlph[key[i % key.length]] + alphabet.length) % alphabet.length];
        } else {
            code += text[i]; // Сохраняем символ, если он не в алфавите (например, пробел или перенос строки)
        }
    }
    return code;
}

function frequencyAnalysis(text) {
    const frequencies = {};

    for (let char of text) {
        if (alphabet.includes(char)) {
            frequencies[char] = (frequencies[char] || 0) + 1;
        }
    }

    return Object.entries(frequencies).sort((a, b) => b[1] - a[1]);
}

function main() {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Выберите опцию (0 - Кодировать, 1 - Раскодировать, 2 - Анализ текста): ", (choice) => {
        if (choice === '0') {
            rl.question("Введите путь к файлу для кодирования: ", (filePath) => {
                rl.question("Введите ключ (на русском): ", (key) => {
                    const text = fs.readFileSync(filePath, 'utf8'); // Сохраняем исходный формат текста
                    const encodedText = Encode(text, key);

                    rl.question("Введите путь для сохранения закодированного текста: ", (outputFilePath) => {
                        fs.writeFileSync(outputFilePath, encodedText, 'utf8');
                        console.log("Текст успешно закодирован и сохранен в:", outputFilePath);
                        rl.close();
                    });
                });
            });
        } else if (choice === '1') {
            rl.question("Введите путь к файлу для раскодирования: ", (filePath) => {
                rl.question("Введите ключ (на русском): ", (key) => {
                    const text = fs.readFileSync(filePath, 'utf8'); // Сохраняем исходный формат текста
                    const decodedText = Decode(text, key);

                    rl.question("Введите путь для сохранения раскодированного текста: ", (outputFilePath) => {
                        fs.writeFileSync(outputFilePath, decodedText, 'utf8');
                        console.log("Текст успешно раскодирован и сохранен в:", outputFilePath);
                        rl.close();
                    });
                });
            });
        } else if (choice === '2') {
            rl.question("Введите путь к файлу для анализа текста: ", (filePath) => {
                const text = fs.readFileSync(filePath, 'utf8'); // Сохраняем исходный формат текста
                const frequencies = frequencyAnalysis(text);

                console.log("Результат частотного анализа:");
                frequencies.forEach(([char, count]) => {
                    console.log(`${char}: ${count}`);
                });

                rl.close();
            });
        } else {
            console.log("Неверный выбор, завершение программы.");
            rl.close();
        }
    });
}

main();