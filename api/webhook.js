const { middleware, Client } = require('@line/bot-sdk')

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
}

const client = new Client(config)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  const events = req.body.events

  for (const event of events) {
    if (event.type === 'message') {
      await client.replyMessage(event.replyToken, {
        type: 'text',
        text: '你說的是：「' + event.message.text + '」',
      })
    }
  }

  res.status(200).send('OK')
}
