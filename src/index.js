const fs = require("fs");
const crypto_lib = require("./crypto");
const TelegramBot = require("node-telegram-bot-api");

const CryptoJS = crypto_lib();

async function main() {
  const token = await JSON.parse(fs.readFileSync("conf.json")).tgKey;
  const bot = new TelegramBot(token, { polling: true });

  await bot.setMyCommands([
    { command: "/encrypt", description: "Crypt a message giving a key" },
    { command: "/decrypt", description: "Decrypt a message giving the key" },
  ]);

  bot.on("message", async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text.trim();
    const command = text.substring(0,text.indexOf(" ")).trim();
    const txt = text.substring(text.indexOf(" "), text.lastIndexOf(" ")).trim();
    const key = text.substring(text.lastIndexOf(" "), text.length).trim();
    if (text.startsWith("/start")) {
        return await bot.sendMessage(
            chatId,
            `<b>💎Welcome to Cryptobot!💎</b>

Here you can encrypt and decrypt messages with <b>AES</b> algorithm just giving the passkey 🔐! 

Use /encrypt to encrypt a message by providing a key 🔑.
    <b>📝 Type --></b> /encrypt <b>&lt;message&gt; &lt;key&gt;</b>

Use /decrypt to decrypt texts <b>encrypted with AES</b> by providing <b>the correct</b> key🔑.
    <b>📝 Type --></b> /decrypt <b>&lt;message&gt; &lt;key&gt;</b>

<b>🔥Enjoy using me!🔥</b>

For any question just text me @LukeInCode or visit my personal 
<a href="https://www.aboutluke.com/">website</a> 💬`,
            { parse_mode: "HTML" }
          );                 
    };          

    if (text.startsWith("/encrypt")) {
      if (!text) return await bot.sendMessage("<b>Internal error</b>",{ parse_mode: "HTML" });
      const params = text.split(" ");
      if (params.length < 3)
        return await bot.sendMessage(
            chatId,
            "<b>Insert the correct params ❌! Type /start to see the instructions</b>",
            { parse_mode: "HTML" }
        );
      if (!key) return await bot.sendMessage(chatId, "<b>Insert a valid key</b>",{ parse_mode: "HTML" });
      await bot.sendMessage(chatId, `Encrypting text: <b>${txt}</b> using key: <b>${key}</b> ↻`,{ parse_mode: "HTML" });
      const ciphertext = CryptoJS.encrypt(txt, key);
      return await bot.sendMessage(
        chatId,
        `Done! Here the text encrypted: 
<b>${ciphertext}</b> 
and there's the key <b>${key}</b> 🔐🔐`,
        { parse_mode: "HTML" }
      );
    }

    if (text.startsWith("/decrypt")) {
      if (!text) return await bot.sendMessage("<b>Internal error</b>",{ parse_mode: "HTML" });
      const params = text.split(" ");
      if (params.length < 3)
        return await bot.sendMessage(
          chatId,
          "<b>Insert the correct params ❌! Type /start to see the instructions</b>",
          { parse_mode: "HTML" }
        );
      if (!key) return await bot.sendMessage(chatId, "<b>Insert a valid key</b>",{ parse_mode: "HTML" });
      await bot.sendMessage(chatId, 
        `Decrypting text: 
<b>${txt}</b> 
using key: <b>${key}</b> ↻`,{ parse_mode: "HTML" });
      const plaintext = CryptoJS.decrypt(txt, key);
      if (plaintext) return await bot.sendMessage(
        chatId,
        `Done! the encrypted word is <b>${plaintext}</b> 🔓`,
        { parse_mode: "HTML" }
      );
      else return await bot.sendMessage(chatId,"<b>The gived text is not encrypted with AES</b> ⁴⁰⁴",{ parse_mode: "HTML" });
    }

    return await bot.sendMessage(chatId,"Command not found! Type /start to see what I can do 📋");
  });
}

main();