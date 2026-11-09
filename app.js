/* =====================================
   NEXORA AI — MAIN SYSTEM
   Creator: A. Teshayev
   AI: Gemini 2.5 Flash
===================================== */

"use strict";

/* CLOUDFLARE WORKER */
const API_URL =
  "https://nexora-ai.adizbekteshayev671.workers.dev/api/chat";

/* TARJIMALAR */
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
    notice: "Gemini 2.5 Flash bilan ishlaydi",
    send: "Yuborish",
    thinking: "NEXORA AI javob tayyorlamoqda...",
    greeting: "Salom! Men NEXORA AI. Sizga qanday yordam bera olaman?",
    empty: "Avval xabar yozing.",
    network: "Server bilan aloqa o'rnatilmadi.",
    error: "Xatolik yuz berdi. Qaytadan urinib ko'ring."
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
    notice: "Работает на Gemini 2.5 Flash",
    send: "Отправить",
    thinking: "NEXORA AI готовит ответ...",
    greeting: "Здравствуйте! Я NEXORA AI. Чем могу вам помочь?",
    empty: "Сначала напишите сообщение.",
    network: "Не удалось подключиться к серверу.",
    error: "Произошла ошибка. Попробуйте снова."
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
    notice: "Powered by Gemini 2.5 Flash",
    send: "Send",
    thinking: "NEXORA AI is preparing an answer...",
    greeting: "Hello! I am NEXORA AI. How can I help you?",
    empty: "Please write a message first.",
    network: "Could not connect to the server.",
    error: "An error occurred. Please try again."
  }
};

/* ILOVA ISHGA TUSHISHI */
document.addEventListener("DOMContentLoaded", () => {

  /* HTML ELEMENTLAR */
  const intro = document.getElementById("intro");
  const app = document.getElementById("app");

  const enterButton = document.getElementById("enterButton");
  const homeButton = document.getElementById("homeButton");

  const langSelect = document.getElementById("lang");

  const chat = document.getElementById("chat");
  const messageInput = document.getElementById("message");
  const sendButton = document.getElementById("send");
  const sendText = document.getElementById("sendText");

  const welcomeText = document.getElementById("welcomeText");
  const heading = document.getElementById("heading");
  const description = document.getElementById("description");

  const notice = document.getElementById("notice");

  const feature1 = document.getElementById("f1");
  const feature2 = document.getElementById("f2");
  const feature3 = document.getElementById("f3");
  const feature4 = document.getElementById("f4");

  /* ELEMENTLARNI TEKSHIRISH */
  const requiredElements = [
    intro,
    app,
    enterButton,
    homeButton,
    langSelect,
    chat,
    messageInput,
    sendButton
  ];

  if (requiredElements.some(element => !element)) {
    console.error("NEXORA AI: HTML elementlari topilmadi!");
    return;
  }

  /* HOLAT */
  let conversation = [];
  let isLoading = false;
  let currentLanguage = "uz";

  /* TARJIMA OLISH */
  function getTranslation() {
    return translations[currentLanguage] || translations.uz;
  }

  /* TILNI ALMASHTIRISH */
  function changeLanguage(language) {
    currentLanguage = translations[language] ? language : "uz";

    const t = getTranslation();

    document.documentElement.lang = currentLanguage;

    welcomeText.textContent = t.welcome;
    enterButton.textContent = t.enter;

    heading.textContent = t.heading;
    description.textContent = t.description;

    feature1.textContent = t.f1;
    feature2.textContent = t.f2;
    feature3.textContent = t.f3;
    feature4.textContent = t.f4;

    messageInput.placeholder = t.placeholder;
    notice.textContent = t.notice;

    if (!isLoading) {
      sendText.textContent = t.send;
    }
  }

  /* XABAR QO'SHISH */
  function addMessage(text, type) {
    const element = document.createElement("div");

    element.className = type === "user"
      ? "message user-message"
      : "message ai-message";

    element.textContent = String(text);

    chat.appendChild(element);

    chat.scrollTop = chat.scrollHeight;

    return element;
  }

  /* PLATFORMAGA KIRISH */
  function openApp() {
    intro.hidden = true;
    app.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (chat.children.length === 0) {
      addMessage(getTranslation().greeting, "ai");
    }

    messageInput.focus();
  }

  /* BOSH SAHIFAGA QAYTISH */
  function goHome() {
    app.hidden = true;
    intro.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  /* YUKLANISH HOLATI */
  function setLoading(state) {
    isLoading = state;

    sendButton.disabled = state;
    messageInput.disabled = state;

    sendText.textContent = state
      ? "⏳ ..."
      : getTranslation().send;
  }

  /* AI BILAN SUHBAT */
  async function sendMessage() {

    if (isLoading) return;

    const userText = messageInput.value.trim();
    const t = getTranslation();

    if (!userText) {
      messageInput.focus();
      return;
    }

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

      const rawResponse = await response.text();

      let data;

      try {
        data = JSON.parse(rawResponse);
      } catch {
        throw new Error(
          "Server JSON formatida javob bermadi."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error || "Server xatosi: " + response.status
        );
      }

      if (!data.success || !data.reply) {
        throw new Error(
          data.error || t.error
        );
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

      console.error("NEXORA AI xatosi:", error);

      addMessage(
        error.message || t.network,
        "ai"
      );

      conversation.pop();

      messageInput.value = userText;

    } finally {

      setLoading(false);
      messageInput.focus();

    }
  }

  /* TUGMALARNI ULASH */
  enterButton.addEventListener("click", openApp);

  homeButton.addEventListener("click", goHome);

  sendButton.addEventListener("click", sendMessage);

  /* TIL TANLASH */
  langSelect.addEventListener("change", () => {
    changeLanguage(langSelect.value);
  });

  /* ENTER ORQALI XABAR YUBORISH */
  messageInput.addEventListener("keydown", event => {

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }

  });

  /* BOSHLANG'ICH SOZLAMALAR */
  changeLanguage("uz");

  console.log("NEXORA AI muvaffaqiyatli ishga tushdi!");

});