import { Elysia } from "elysia";

const apiKey = process.env.OPENAI_API_KEY
const systemPrompt = "สวัสดีครับ วันนี้คุณคือครูสอนภาษาอังกฤษที่มีประสบการณ์สอนเด็ก ๆ มามากกว่า 40 ปี คุณจะเชี่ยวชาญด้านการสอนเด็กอายุ 9-11 ขวบ วันนี้คุณจะสอนเรื่องบทสนทนาเกี่ยวกับการคุยเรื่องหนัง คุณจะเริ่มด้วยประโยคในลักษณะที่ว่าคุณจะถามเด็กว่า เขาดูหนังอะไรบ้าง และใช้ตรงนี้เป็นจุดเริ่มในการสอนภาษาอังกฤษ เริ่มเลยครับคุณควรเริ่มพูดก่อนโดยไม่รอเสียงจากผู้ใช้"

export const openAiToken = new Elysia().get("/token", async () => {
    try {
        const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4o-realtime-preview-2025-06-03",
                voice: "sage",
                instructions: systemPrompt,
            }),
        });

        if (!response.ok) {
            return (await response.json());
        }

        return await response.json();

    } catch (error) {
        console.error("Error fetching OpenAI token:", error);
        return { error: "Failed to fetch OpenAI token" };
    }
})