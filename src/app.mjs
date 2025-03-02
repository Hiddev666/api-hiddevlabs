import express from "express"
import dotenv from "dotenv"
import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from "fs/promises"
import cors from "cors"

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
const PORT = 8000

app.get("/", (req, res) => {
    res.send({
        message: "Welcome To hiddevLabs"
    })
})

app.post("/textgenerative", async (req, res) => {

    const { body } = req

    const genAI = new GoogleGenerativeAI("AIzaSyCFJTp2_RrTBwW6mPj-ApaQ_0POvXZGWUs")
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })


    console.log(body.prompt)
    const result = await model.generateContent(body.prompt)

    res.send({
        gemini_response: result.response.text()
    })
})

app.get("/vision", async (req, res) => {
    const genAI = new GoogleGenerativeAI("AIzaSyCFJTp2_RrTBwW6mPj-ApaQ_0POvXZGWUs")
    const genConfig = {
        temperature: 0.4,
        topP: 1,
        topK: 32,
        maxOutputTokens: 4096
    }

    const genModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        genConfig
    })

    try {
        const filePath = "C:\Users\\HIDDEV\\Downloads\\WhatsApp Image 2025-02-28 at 10.32.21.jpeg"
        const imageFile = await fs.readFile(filePath)
        const imageBase64 = imageFile.toString("base64")

        const promptConfig = [
            { text: "Can you tell me about this image?" },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: imageBase64
                }
            }
        ]

        const result = await genModel.generateContent({
            contents: [{
                role: "user",
                parts: promptConfig
            }]
        })

        res.send({
            gemini_response: result.response.text()
        })

    } catch (err) {
        res.send({
            err: err.message
        })
    }

})

app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`)
})
