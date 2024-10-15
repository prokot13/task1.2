// CSV-дані для обробки
const csvData = `
48.30,32.16,Кропивницький,200000,
44.38,34.33,Алушта,31440,
49.46,30.17,Біла Церква,200131,
49.54,28.49,Бердичів,87575,#некоммент
46.49,36.58,#Бердянськ,121692,
49.15,28.41,Вінниця,356665,
#45.40,34.29,Джанкой,43343,
`;

// Функція створення замикання для заміни міст у тексті
const createCityReplacer = (csv) => {
    const cities = csv
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))  // Фільтруємо пусті та коментовані рядки
        .map(line => line.split(','))
        .map(([x, y, name, population]) => ({ name, population: parseInt(population, 10) }))
        .sort((a, b) => b.population - a.population)  // Сортуємо міста за кількістю населення
        .slice(0, 10)  // Вибираємо ТОП-10 міст
        .reduce((acc, city, index) => {
            acc[city.name] = { population: city.population, rating: index + 1 };
            return acc;
        }, {});

    return (text) => {
        return text.replace(/\b[A-ZА-ЯІЇЄ][a-zа-яіїє']+\b/g, (match) => {
            const city = cities[match];
            if (city) {
                const populationText = city.population.toLocaleString('uk-UA');
                const peopleText = ['людина', 'людини', 'людей'][
                    (city.population % 10 === 1 && city.population % 100 !== 11) ? 0 :
                        ([2, 3, 4].includes(city.population % 10) && ![12, 13, 14].includes(city.population % 100)) ? 1 : 2
                    ];
                return `${match} (№${city.rating} в ТОП-10 найбільших міст України, населення ${populationText} ${peopleText})`;
            }
            return match;  // Якщо місто не в ТОП-10
        });
    };
};

// Ініціалізуємо функцію для заміни міст
const replaceCities = createCityReplacer(csvData);

// Знаходимо елементи DOM
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const changeTextBtn = document.getElementById('change-text-btn');

// Додаємо подію на кнопку
changeTextBtn.addEventListener('click', () => {
    const input = inputText.value;  // Отримуємо введений текст
    const output = replaceCities(input);  // Обробляємо текст
    outputText.textContent = output;  // Виводимо результат
});
