<template>
  <div class="coze-chat-container">
    <h2>{{ currentTitle }}</h2>
    <div class="dialogue-selector">
      <select v-model="currentDialogue" @change="loadSelectedDialogue">
        <option v-for="dialogue in dialogues" :key="dialogue" :value="dialogue">
          {{ dialogue }}
        </option>
      </select>
      <button @click="createNewDialogue">New Dialogue</button>
      <button @click="deleteCurrentDialogue" :disabled="!currentDialogue">Delete</button>
    </div>

    <div class="chat-box">
      <div v-for="(message, index) in chatHistory" :key="index" class="message">
        <div :class="['message-content', message.role]">
          <strong>{{ message.role === 'user' ? 'You' : 'Coze' }}:</strong>
          <div v-html="renderMarkdown(message.content)"></div>
        </div>
      </div>
    </div>

    <div class="input-box">
      <input
        v-model="userQuery"
        type="text"
        placeholder="Type your message..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>
<script setup></script>
<style scoped>
.coze-chat-container {
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.chat-box {
  height: 800px;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
}

.message-content {
  padding: 10px 40px;
  border-radius: 5px;
}

.message-content.user {
  background-color: #e6f7ff;
  text-align: left;
  box-shadow: 0 0 5px #ccc;
  margin-bottom: 20px;
}

.message-content.assistant {
  background-color: #ffffff;
  box-shadow: 0 0 5px #ccc;
  margin-bottom: 20px;
}

.input-box {
  display: flex;
}

.input-box input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.input-box button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.input-box button:hover {
  background-color: #0056b3;
}
</style>
