
/* =====================================
   NEXORA AI — MAIN JAVASCRIPT
   Creator: A. Teshayev
   Model: Gemini 2.5 Flash
===================================== */

// CLOUDFLARE WORKER
const API_URL = "https://nexora-ai.adizbekteshayev671.workers.dev/api/chat";

// ELEMENTLAR
const intro = document.getElementById("intro");
const app = document.getElementById("app");
const chat = document.getElementById("chat");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send");
const langSelect = document.getElementById("lang");

// SUHBAT TARIXI
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
    empty: "Iltimos, avval xabar yozing.",
    network: "Server bilan aloqa o'rnatilmadi.",
    greeting: "Salom! Men NEXORA AI. Sizga qanday yordam bera olaman?"
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
    empty: "Пожалуйста, сначала напишите сообщение.",
    network: "Не удалось подключиться к серверу.",
    greeting: "Здравствуйте! Я NEXORA AI. Чем могу вам помочь?"
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
    empty: "Please write a message first.",
    network: "Could not connect to the server.",
    greeting: "Hello! I am NEXORA AI. How can I help you?"
  }
};

// TILNI TANLASH
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
    addMessage(
      translations[langSelect.value].greeting,
      "ai"
    );
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

  // Xavfsiz matn chiqarish
  element.textContent = text;

  chat.appendChild(element);

  chat.scrollTo({
    top: chat.scrollHeight,
    behavior: "smooth"
  });

  return element;
}

// JAVOB KUTILAYOTGANINI KO'RSATISH
function setLoading(state) {
  isLoading = state;

  const t = translations[langSelect.value] || translations.uz;

  sendButton.disabled = state;
  messageInput.disabled = state;

  sendButton.textContent = state
    ? "⏳ ..."
    : t.send;

  if (!state) {
    messageInput.disabled = false;
  }
}

// AI BILAN SUHBAT
async function sendMessage() {
  if (isLoading) return;

  const userText = messageInput.value.trim();
  const t = translations[langSelect.value] || translations.uz;

  if (!userText) {
    messageInput.focus();
    return;
  }

  // Xabarni chiqarish
  addMessage(userText, "user");

  messageInput.value = "";

  // Suhbat tarixiga qo'shish
  conversation.push({
    role: "user",
    content: userText
  });

  // Oxirgi 20 ta xabarni saqlash
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

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || t.error
      );
    }

    if (!data.reply) {
      throw new Error(t.error);
    }

    // Yuklanish yozuvini o'chirish
    loadingMessage.remove();

    // AI javobini chiqarish
    addMessage(data.reply, "ai");

    // Tarixga saqlash
    conversation.push({
      role: "assistant",
      content: data.reply
    });

    conversation = conversation.slice(-20);

  } catch (error) {
    loadingMessage.remove();

    console.error("NEXORA AI ERROR:", error);

    addMessage(
      error.message || t.network,
      "ai"
    );

    // Xatolikda yuborilgan xabarni
    // qayta yuborish imkoniyati uchun saqlash
    messageInput.value = userText;

    // Takroriy xabar qo'shilmasligi uchun
    // tarixdan oxirgi user xabarini olib tashlash
    conversation.pop();

  } finally {
    setLoading(false);
    messageInput.focus();
  }
}

// ENTER ORQALI XABAR YUBORISH
messageInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// BOSHLANG'ICH TIL
changeLanguage("uz");

console.log("NEXORA AI JavaScript muvaffaqiyatli ishga tushdi.");
