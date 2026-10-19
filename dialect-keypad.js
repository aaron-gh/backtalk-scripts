export const manifest = {
  id: "dialect-keypad",
  name: "Dialect keypad",
  version: "1.0",
  author: "Aaron Hewitt",
  minApiVersion: 5,
  testedApiVersion: 5,
  description:
    "Lifting the finger from a key on the Dialect keypad activates it: the digits, Backspace and Enter. " +
    "Holding a digit or Backspace for the long-press hold time long-presses it.",
  apps: ["com.dialect.launcher"],
  permissions: ["speech"],
  settings: [
    {
      key: "holdTime",
      type: "list",
      title: "Long-press hold time",
      default: "1000",
      options: [
        { value: "0", label: "Off" },
        { value: "500", label: "0.5 seconds" },
        { value: "750", label: "0.75 seconds" },
        { value: "1000", label: "1 second" },
        { value: "1500", label: "1.5 seconds" },
        { value: "2000", label: "2 seconds" },
        { value: "3000", label: "3 seconds" },
      ],
    },
  ],
};

// The letters on keys 2 to 9 follow Dialect's language: Latin, Cyrillic or Greek.
const ALPHABETS = [
  ["ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"],
  ["АБВГ", "ДЕЁЖЗ", "ИЙКЛ", "МНОП", "РСТУ", "ФХЦЧ", "ШЩЪЫ", "ЬЭЮЯ"],
  ["ΑΒΓ", "ΔΕΖ", "ΗΘΙ", "ΚΛΜ", "ΝΞΟ", "ΠΡΣ", "ΤΥΦ", "ΧΨΩ"],
];

// Backspace in each of Dialect's languages.
const BACKSPACE = ["Backspace", "Rücktaste", "Retroceso", "Retour arrière", "Retrocesso", "Стереть", "Διαγραφή"];

// Enter is named by the key and what it does, such as "Enter, calls Alex", so it's matched by the start of
// each form in each language.
const ENTER = [
  "Enter, no matches to open",
  "Enter, opens ",
  "Enter, calls ",
  "Enter, messages ",
  "Eingabetaste, keine Treffer zum Öffnen",
  "Eingabetaste, öffnet ",
  "Eingabetaste, ruft ",
  "Eingabetaste, schreibt ",
  "Intro, no hay resultados que abrir",
  "Intro, abre ",
  "Intro, llama a ",
  "Intro, envía un mensaje a ",
  "Entrée, aucun résultat à ouvrir",
  "Entrée, ouvre ",
  "Entrée, appelle ",
  "Entrée, envoie un message à ",
  "Invio, nessun risultato da aprire",
  "Invio, apre ",
  "Invio, chiama ",
  "Invio, invia un messaggio a ",
  "Enter, sem resultados para abrir",
  "Enter, abre ",
  "Enter, liga a ",
  "Enter, envia mensagem a ",
  "Ввод, нет совпадений для открытия",
  "Ввод, открывает ",
  "Ввод, звонит ",
  "Ввод, отправляет сообщение ",
  "Enter, καμία αντιστοίχιση για άνοιγμα",
  "Enter, ανοίγει ",
  "Enter, καλεί ",
  "Enter, στέλνει μήνυμα σε ",
];

// Digit keys are named by the digit and its letters: "2, A, B, C".
const digitKeys = [
  "0",
  "1",
  ...ALPHABETS.flatMap((letters) => letters.map((keyLetters, at) => `${at + 2}, ${[...keyLetters].join(", ")}`)),
];

// The typed number above the keypad is named by its digits too, but can't be clicked.
const keys = [
  ...[...digitKeys, ...BACKSPACE].map((name) => ({ contentDescription: name, clickable: true })),
  ...ENTER.map((start) => ({ textContains: start, clickable: true })),
];

for (const match of keys) backtalk.rules.add({ match, liftToActivate: true });

// longPressAfter only applies to items that lift to activate, so one rule covers every key. Enter can't be
// long-pressed, so holding it and lifting presses it.
let holdRule = null;
const applyHoldTime = () => {
  if (holdRule !== null) backtalk.rules.remove(holdRule);
  const holdTime = Number(backtalk.settings.get("holdTime")) || 0;
  holdRule = holdTime > 0 ? backtalk.rules.add({ match: { clickable: true }, longPressAfter: holdTime }) : null;
};

applyHoldTime();
backtalk.onSettingChange((key) => {
  if (key === "holdTime") applyHoldTime();
});
