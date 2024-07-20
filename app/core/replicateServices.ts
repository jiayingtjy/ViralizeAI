import Replicate from "replicate";

class ReplicateServices {
    private replicate: Replicate;
    private static instance: ReplicateServices;

    private constructor(apiKey?: string) {
        if (!apiKey) {
            apiKey = process.env.REPLICATE_API_KEY;
            if (!apiKey) {
                throw new Error('Replicate API Key is not configured');
            }
        }
        this.replicate = new Replicate({
            auth: apiKey
        });
    }

    static getInstance(apiKey?: string): ReplicateServices {
        if (!ReplicateServices.instance) {
            ReplicateServices.instance = new ReplicateServices(apiKey);
        }
        return ReplicateServices.instance;
    }

    async musicgen(input: any): Promise<any> {
        try {
            const result = await this.replicate.run(
                "meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb",
                { input }
            );
            return result;
        } catch (error) {
            throw new Error(`Failed to generate music: ${error}`);
        }
    }

    async videogen(prompt: string): Promise<any> {
        try {
            return await this.replicate.run(
                "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
                {
                    input: {
                        prompt: prompt
                    }
                }
            );
        } catch (error) {
            throw new Error(`Failed to run model: ${error}`);
        }
    }

    async imagegen(prompt: string): Promise<any> {
        try {
            return await this.replicate.run(
                "bytedance/sdxl-lightning-4step:5f24084160c9089501c1b3545d9be3c27883ae2239b6f412990e82d4a6210f8f",
                {
                    input: {
                        prompt: prompt
                    }
                }
            );
        } catch (error) {
            throw new Error(`Failed to run model: ${error}`);
        }
    }

    async textToSpeech(input: {}): Promise<any> {
        try {
            return await this.replicate.run(
                "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
                {
                    input: input
                }
            );
        } catch (error) {
            throw new Error(`Failed to run model: ${error}`);
        }
    }
}

export default ReplicateServices;