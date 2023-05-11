import express from 'express'
import axios from "axios"
import dotenv from "dotenv"
import { openai } from '../index.js'
import { PineconeClient } from "@pinecone-database/pinecone";

dotenv.config();
const router = express.Router();


router.post("/text", async (req, res) => {
    try {
        let { text, activeChatId } = req.body
        text = text.substring(1) //remove first @

        const response = await axios.post(`${process.env.CHAT_GPT_SERVICE}/gpt_query`, {
            query: text,
        })

        console.log(`answer from chatgpt: {response}`)

        await axios.post(`https://api.chatengine.io/chats/${activeChatId}/messages/`, {
            text: response.data['answer']
        },
            {
                headers: {
                    "Project-ID": process.env.PROJECT_ID,
                    "User-Name": process.env.BOT_USER_NAME,
                    "User-Secret": process.env.BOT_USER_SECRET,
                },
            });

        res.status(200).json({
            text: response.data.answer
        });
    }
    catch (error) {
        console.error("error: ", error);
        res.status(500).json({ error: error.message })
    }
});

export default router;

