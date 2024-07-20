import { OpenAI } from 'openai';

// Here defines a Singleton class OpenAIService that wraps the OpenAI API client.
class OpenAIService {
    private static instance: OpenAIService;
    private openai!: OpenAI;

    public constructor(apiKey?: string) {

        this.openai = new OpenAI({
            apiKey: apiKey,
        });
    }

    // apiKey can be a string or undefined
    static getInstance(apiKey?: string): OpenAIService {
        if (!apiKey) {
            throw new Error('OPENAI API Key is required');
        }
        if (!OpenAIService.instance) {
            OpenAIService.instance = new OpenAIService(apiKey);
        }
        return OpenAIService.instance;
    }

    async generateText(msg: [], model: string = "gpt-3.5-turbo"): Promise<OpenAI.Chat.Completions.ChatCompletionMessage> {
        try {
            const response = await this.openai.chat.completions.create({
                model: model,
                messages: msg
            });

            if (response && response.choices && response.choices.length > 0) {
                return response.choices[0].message;
            } else {
                throw new Error('No text generated');
            }
        } catch (error) {
            console.error('Error generating text:', error);
            throw error;
        }
    }

    async generateImage(prompt: string, amount: string = "1", resolution: OpenAI.ImageGenerateParams["size"] = "1024x1024"): Promise<OpenAI.Images.Image[]> {
        try {
            // Logic for processing the messages and interacting with OpenAI can go here
            const response = await this.openai.images.generate({
                prompt: prompt,
                size: resolution,
                n: parseInt(amount, 10),
            });

            if (response && response.data && response.data.length > 0) {
                return response.data;
            } else {
                throw new Error('No image generated');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            throw error;
        }
    }
}

export default OpenAIService;
