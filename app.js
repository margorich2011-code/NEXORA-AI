
// =================================
// NEXORA-AI APPLICATION ENGINE
// Gemini 2.5 Flash
// Created by A. Teshayev
// =================================

let language = 0;

const API_URL =
  "https://nexora-ai.adizbekteshayev671.workers.dev";

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
    "Gemini 2.5 Flash bilan ishlaydi."
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
    "Работает с Gemini 2.5 Flash."
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
    "Powered by Gemini 2.5 Flash."
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
    "heading", "description",
    "f1", "d1", "f2", "d2",
    "f3", "d3", "f4", "d4"
  ];

  ids.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el) el.textContent = t[i];
  });

  document.getElementById("message").placeholder = t[10];
  document.getElementById("send").textContent = t[11];
  document.getElementById("notice").textContent = t[12];
}

// CHAT CONTAINER
function getChat() {
  let chat = document.getElementById("chat");

  if (!chat) {
    chat = document.createElement("div");
    chat.id = "chat";
    chat.style.cssText =
      "display:flex;flex-direction:column;gap:12px;padding:15px;max-height:450px;overflow-y:auto;";

    const input = document.getElementById("message");
    if (!input) throw new Error("Message elementi topilmadi.");

    const parent = input.parentElement?.parentElement;
    if (!parent) throw new Error("Chat joyi topilmadi.");

    parent.appendChild(chat);
  }

  return chat;
}

// ADD MESSAGE
function addMessage(text, type) {
  const chat = getChat();
  const bubble = document.createElement("div");

  bubble.className = "message " + type;
  bubble.textContent = text;

  bubble.style.cssText =
    "padding:12px 16px;border-radius:14px;max-width:90%;white-space:pre-wrap;overflow-wrap:anywhere;" +
    (type === "user"
      ? "align-self:flex-end;background:#2563eb;color:white;"
      : "align-self:flex-start;background:#e5e7eb;color:#111827;");

  chat.appendChild(bubble);
  chat.scrollTop = chat.scrollHeight;

  return bubble;
}

// SEND MESSAGE TO GEMINI
async function sendMessage() {
  const input = document.getElementById("message");
  const button = document.getElementById("send");

  if (!input || !button) return;

  const value = input.value.trim();
  if (!value || button.disabled) return;

  addMessage(value, "user");
  input.value = "";

  button.disabled = true;

  const loading = addMessage(
    language === 1
      ? "NEXORA AI думает..."
      : language === 2
      ? "NEXORA AI is thinking..."
      : "NEXORA AI javob tayyorlamoqda...",
    "assistant"
  );

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: value,
        language: languages[language]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Server xatosi: " + response.status
      );
    }

    const answer = data.reply;

    if (!answer) {
      throw new Error("AI javobi topilmadi.");
    }

    loading.textContent = answer;

  } catch (error) {
    console.error("NEXORA AI error:", error);

    loading.textContent =
      language === 1
        ? "Ошибка: " + error.message
        : language === 2
        ? "Error: " + error.message
        : "Xatolik: " + error.message;

  } finally {
    button.disabled = false;
    input.focus();
  }
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
