let chatHistory = JSON.parse(localStorage.getItem("chat")) || [];
let darkMode = true;

window.onload = function () {

  document.getElementById("sendBtn").addEventListener("click", sendMessage);
  document.getElementById("micBtn").addEventListener("click", startVoice);

  document.getElementById("themeBtn").addEventListener("click", toggleTheme);
  document.getElementById("clearBtn").addEventListener("click", clearChat);
  document.getElementById("exportBtn").addEventListener("click", exportChat);

  document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  loadChat();
};

// ================= SEND =================
function sendMessage() {
  let input = document.getElementById("userInput");
  let text = input.value.trim();

  if (text === "") return;

  addMessage("user", text);
  chatHistory.push("You: " + text);

  input.value = "";

  setTimeout(() => {
    let reply = getAI(text);

    addMessage("bot", reply);
    chatHistory.push("Bot: " + reply);

    saveChat();
  }, 800);
}

// ================= AI =================
function getAI(text) {
  text = text.toLowerCase();

  if (text.includes("hello")) return "Hello! 👋";
  if (text.includes("name")) return "I am Level 5 AI Assistant 🤖";
  if (text.includes("how are you")) return "I'm doing great!";
  if (text.includes("ai")) return "AI is Artificial Intelligence.";
  if (text.includes("bye")) return "Goodbye 👋";

  return "Interesting 🤔 tell me more.";
}

// ================= UI =================
function addMessage(type, text) {
  let chatBox = document.getElementById("chat-box");

  let msg = document.createElement("div");
  msg.className = type;
  msg.innerText = text;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ================= LOCAL STORAGE =================
function saveChat() {
  localStorage.setItem("chat", JSON.stringify(chatHistory));
}

function loadChat() {
  chatHistory.forEach(msg => {
    let type = msg.startsWith("You") ? "user" : "bot";
    addMessage(type, msg.replace("You: ", "").replace("Bot: ", ""));
  });
}

// ================= CLEAR CHAT =================
function clearChat() {
  localStorage.removeItem("chat");
  location.reload();
}

// ================= EXPORT CHAT =================
function exportChat() {
  let blob = new Blob([chatHistory.join("\n")], { type: "text/plain" });
  let link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = "chat.txt";
  link.click();
}

// ================= THEME =================
function toggleTheme() {
  document.body.classList.toggle("light");
  darkMode = !darkMode;
}

// ================= VOICE INPUT =================
function startVoice() {
  let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = function (event) {
    let text = event.results[0][0].transcript;
    document.getElementById("userInput").value = text;
    sendMessage();
  };
}