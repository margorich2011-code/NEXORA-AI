
/* =====================================
   NEXORA AI — MAIN SYSTEM
   Creator: A. Teshayev
   AI: Gemini 2.5 Flash
===================================== */

"use strict";

// CLOUDFLARE WORKER
const API_URL =
  "https://nexora-ai.adizbekteshayev671.workers.dev/api/chat";

// ELEMENTLAR
const intro = document.getElementById("intro");
const app = document.getElementById("app");
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const langSelect = document.getElementById("lang");
const enterButton = document.getElementById("enterButton");
const homeButton = document.getElementById("homeButton");

// HOLAT
let conversation = [];
let isLoading = false;

// TARJIMALAR
const translations = {
  uz: {
    enter: "Platformaga kirish",
    welcome: "Sun'iy intellekt yordamida savollaringizga javob oling, g'oyalar yarating va yangi imkoniyatlarni kashf eting.",
    heading: "NEXORA AI yordamchingiz",
    description: "Savolingizni yozing. NEXORA AI sizga yordam beradi.",
    f1: "Matn yozish",
    f2: "G'oyalar",
    f3: "Dasturlash",
    f4: "Tarjima",
    placeholder: "NEXORA AI ga xabar yozing...",
    notice: "Gemini 2.5 Flash bilan ishlaydi.",
    send: "Yuborish ➤",
    thinking: "NEXORA AI javob tayyorlamoqda...",
    error: "Xatolik yuz berdi. Qaytadan urinib ko'ring.",
    network: "Server bilan aloqa o'rnatilmadi.",
    greeting: "Salom! Men NEXORA AI. Sizga qanday yordam bera olaman?",
    empty: "Avval xabar yozing."
  },

  ru: {
    enter: "Войти на платформу",
    welcome: "Получайте ответы, создавайте идеи и открывайте новые возможности с помощью искусственного интеллекта.",
    heading: "Ваш помощник NEXORA AI",
    description: "Напишите свой вопрос. NEXORA AI поможет вам.",
    f1: "Написание текста",
    f2: "Идеи",
    f3: "Программирование",
    f4: "Перевод",
    placeholder: "Напишите сообщение NEXORA AI...",
    notice: "Работает на Gemini 2.5 Flash.",
    send: "Отправить ➤",
    thinking: "NEXORA AI готовит ответ...",
    error: "Произошла ошибка. Попробуйте снова.",
    network: "Не удалось подключиться к серверу.",
    greeting: "Здравствуйте! Я NEXORA AI. Чем могу вам помочь?",
    empty: "Сначала напишите сообщение."
  },

  en: {
    enter: "Enter Platform",
    welcome: "Get answers, create ideas and discover new possibilities with artificial intelligence.",
    heading: "Your NEXORA AI Assistant",
    description: "Write your question. NEXORA AI will help you.",
    f1: "Writing",
    f2: "Ideas",
    f3: "Programming",
    f4: "Translation",
    placeholder: "Write a message to NEXORA AI...",
    notice: "Powered by Gemini 2.5 Flash.",
    send: "Send ➤",
    thinking: "NEXORA AI is preparing an answer...",
    error: "An error occurred. Please try again.",
    network: "Could not connect to the server.",
    greeting: "Hello! I am NEXORA AI. How can I help you?",
    empty: "Please write a message first."
  }
};

// JORIY TIL
function getTranslation() {
  return translations[langSelect.value] || translations.uz;
}

// TILNI O'ZGARTIRISH
function changeLanguage(language) {
  const t = translations[language] || translations.uz;

  document.documentElement.lang = language;

  document.getElementById("enterButton").textContent = t.enter;
  document.getElementById("welcomeText").textContent = t.welcome;
  document.getElementById("heading").textContent = t.heading;
  document.getElementById("description").textContent = t.description;

  document.getElementById("f1").textContent = t.f1;
  document.getElementById("f2").textContent = t.f2;
  document.getElementById("f3").textContent = t.f3;
  document.getElementById("f4").textContent = t.f4;

  messageInput.placeholder = t.placeholder;
  document.getElementById("notice").textContent = t.notice;

  if (!isLoading) {
    sendButton.textContent = t.send;
  }
}

// PLATFORMAGA KIRISH
function openApp() {
  intro.style.display = "none";
  app.style.display = "block";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (chat.children.length === 0) {
    addMessage(getTranslation().greeting, "ai");
  }

  messageInput.focus();
}

// BOSH SAHIFAGA QAYTISH
function goHome() {
  app.style.display = "none";
  intro.style.display = "flex";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// XABAR QO'SHISH
function addMessage(text, type) {
  const element = document.createElement("div");

  element.className =
    type === "user"
      ? "message user-message"
      : "message ai-message";

  element.textContent = String(text);

  chat.appendChild(element);

  chat.scrollTop = chat.scrollHeight;

  return element;
}

// YUKLANISH HOLATI
function setLoading(state) {
  isLoading = state;

  sendButton.disabled = state;
  messageInput.disabled = state;

  sendButton.textContent = state
    ? "⏳ ..."
    : getTranslation().send;
}

// AI BILAN SUHBAT
async function sendMessage() {
  if (isLoading) return;

  const userText = messageInput.value.trim();
  const t = getTranslation();

  if (!userText) {
    messageInput.focus();
    return;
  }

  // Foydalanuvchi xabari
  addMessage(userText, "user");

  messageInput.value = "";

  conversation.push({
    role: "user",
    content: userText
  });

  conversation = conversation.slice(-20);

  const loadingMessage = addMessage(
    t.thinking,
    "ai"
  );

  setLoading(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        messages: conversation
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || `Server xatosi: ${response.status}`
      );
    }

    if (!data.success || !data.reply) {
      throw new Error(data.error || t.error);
    }

    loadingMessage.remove();

    addMessage(data.reply, "ai");

    conversation.push({
      role: "assistant",
      content: data.reply
    });

    conversation = conversation.slice(-20);

  } catch (error) {
    loadingMessage.remove();

    console.error("NEXORA AI:", error);

    addMessage(
      error.message || t.network,
      "ai"
    );

    // Qayta yuborish uchun xabarni tiklash
    conversation.pop();
    messageInput.value = userText;

  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

// TUGMALARNI ULASH
enterButton.addEventListener("click", openApp);
homeButton.addEventListener("click", goHome);
sendButton.addEventListener("click", sendMessage);

// TIL TANLASH
langSelect.addEventListener("change", function() {
  changeLanguage(this.value);
});

// ENTER BILAN YUBORISH
messageInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// BOSHLANG'ICH SOZLAMALAR
changeLanguage("uz");

console.log("NEXORA AI muvaffaqiyatli ishga tushdi!");
