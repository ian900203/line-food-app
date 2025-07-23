// === Line Food App 初始專案架構 ===
// 建立一個基本的 LINE Webhook + 圖片處理 Server

// 1. 初始化 Node 專案
// 在 line-food-app 資料夾中執行：
// npm init -y
// npm install express @line/bot-sdk axios dotenv

// 2. 建立以下檔案結構：
// ├── index.js
// ├── .env
// ├── .gitignore
// └── package.json

// 3. .env 檔案內容（請自行填入）
// LINE_CHANNEL_ACCESS_TOKEN=你的Token
// LINE_CHANNEL_SECRET=你的Secret

// 4. index.js：Webhook Server
const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
require('dotenv').config();

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
};

const app = express();
const client = new line.Client(config);

app.post('/webhook', line.middleware(config), async (req, res) => {
  const events = req.body.events;
  const results = await Promise.all(events.map(handleEvent));
  res.json(results);
});

async function handleEvent(event) {
  if (event.type !== 'message') return null;
  const msg = event.message;

  if (msg.type === 'image') {
    const buffer = await client.getMessageContent(msg.id);
    // 👉 這裡之後串接 Google Vision or AI 分析
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: '我收到你的食物照囉🍱！準備分析熱量中...'
    });
  }

  if (msg.type === 'text') {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: `你說了：「${msg.text}」`
    });
  }
}

app.listen(3000, () => console.log('🚀 Server is running on http://localhost:3000'));
