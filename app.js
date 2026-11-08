
// =================================
// NEXORA-AI APPLICATION ENGINE
// Created by A. Teshayev
// =================================

let language = 0;

const languages = ["UZ", "RU", "EN"];

const translations = [
  [
    "Salom! NEXORA AI'ga xush kelibsiz.",
    "Bugun qanday g‘oya ustida ishlaymiz?",
    "Aqlli yordamchi",
    "Savollaringizga javob topish va yangi g‘oyalar yaratish.",
    "Dasturlash",
    "Kod yozish, xatolarni tushunish va loyihalar yaratish.",
    "Rasm va fayllar",
    "Rasmlar va hujjatlar bilan ishlash imkoniyatlari.",
    "Tarjima",
    "Turli tillardagi matnlarni tarjima qilish.",
    "NEXORA AI'dan biror narsa so‘rang...",
    "Yuborish →",
    "AI serveri keyingi bosqichda ulanadi."
  ],
  [
    "Привет! Добро пожаловать в NEXORA AI.",
    "Над какой идеей поработаем сегодня?",
    "Умный помощник",
    "Ответы на вопросы и создание новых идей.",
    "Программирование",
    "Написание кода и создание проектов.",
    "Изображения и файлы",
    "Работа с изображениями и документами.",
    "Перевод",
    "Перевод текстов на разные языки.",
    "Спросите что-нибудь у NEXORA AI...",
    "Отправить →",
    "Подключение AI-сервера — следующий этап."
  ],
  [
    "Hello! Welcome to NEXORA AI.",
    "What idea shall we work on today?",
    "Smart assistant",
    "Get answers and create new ideas.",
    "Coding",
    "Write code, understand errors and build projects.",
    "Images and files",
    "Work with images and documents.",
    "Translation",
    "Translate text into different languages.",
    "Ask NEXORA AI anything...",
    "Send →",
    "AI server connection comes in the next stage."
  ]
];

// OPEN APP
function openApp() {
  document.getElementById("intro").style.display = "none";
  document.getElementById("app").style.display = "block";
  window.scrollTo(0, 0);
}

// GO HOME
function goHome() {
  document.getElementById("app").style.display = "none";
  document.getElementById("intro").style.display = "flex";
  window.scrollTo(0, 0);
}

// CHANGE LANGUAGE
function changeLanguage() {
  language = (language + 1) % 3;

  const t = translations[language];

  document.getElementById("lang").textContent =
    languages[language];

  const ids = [
    "heading",
    "description",
    "f1",
    "d1",
    "f2",
    "d2",
    "f3",
    "d3",
    "f4",
    "d4"
  ];

  ids.forEach((id, i) => {
    document.getElementById(id).textContent = t[i];
  });

  document.getElementById("message").placeholder = t[10];
  document.getElementById("send").textContent = t[11];
  document.getElementById("notice").textContent = t[12];
}

// SEND MESSAGE
function sendMessage() {
  const input = document.getElementById("message");
  const value = input.value.trim();

  if (!value) {
    alert(
      language === 1
        ? "Сначала напишите сообщение."
        : language === 2
        ? "Please write a message first."
        : "Avval xabaringizni yozing."
    );
    return;
  }

  alert(
    language === 1
      ? "Сообщение принято. AI-сервер будет подключён на следующем этапе."
      : language === 2
      ? "Message received. The AI server will be connected in the next stage."
      : "Xabaringiz qabul qilindi. AI serveri keyingi bosqichda ulanadi."
  );

  input.value = "";
}

// ENTER TO SEND
document.addEventListener("DOMContentLoaded", () => {
  const message = document.getElementById("message");

  if (message) {
    message.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    });
  }
});
