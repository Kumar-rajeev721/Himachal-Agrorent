const { GoogleGenAI } = require('@google/genai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_MODEL = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
const GEMINI_FALLBACK_MODELS = [
    GEMINI_MODEL,
    DEFAULT_GEMINI_MODEL,
    'gemini-2.5-flash',
].filter((model, index, models) => model && models.indexOf(model) === index);

const ai = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

const SYSTEM_CONTEXT = `You are an AI assistant for Himachal Agrorent, a farm land leasing platform in Himachal Pradesh, India. 
Help users with questions about agriculture, crop selection, farming seasons, land leasing, and related topics. 
Be helpful, concise, and practical. If asked about general topics, answer them too.`;

const getPrompt = (body = {}) => {
    return body.prompt || body.message || body.text || body.content;
};

const parseGeminiError = (error) => {
    const statusCode = Number(error.status || error.code) || 500;
    let message = error.message || 'AI service request failed';
    let retryDelay = null;

    try {
        const parsed = JSON.parse(error.message);
        message = parsed?.error?.message || message;
        retryDelay = parsed?.error?.details?.find(
            (detail) => detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
        )?.retryDelay || null;
    } catch (_) {
        // Gemini sometimes returns plain text errors instead of JSON.
    }

    if (statusCode === 429) {
        message = retryDelay
            ? `Gemini API quota exceeded. Please retry in ${retryDelay}.`
            : 'Gemini API quota exceeded. Please try again later.';
    }

    if (statusCode === 404 && message.includes('not found')) {
        message = `Gemini model is not available: ${message}. Set GEMINI_MODEL=${DEFAULT_GEMINI_MODEL} in .env and restart the server.`;
    }

    return { statusCode, message };
};

const generateContentWithFallback = async (contents) => {
    let lastError;

    for (const model of GEMINI_FALLBACK_MODELS) {
        try {
            return await ai.models.generateContent({ model, contents });
        } catch (error) {
            const { statusCode } = parseGeminiError(error);

            if (statusCode !== 404) {
                throw error;
            }

            lastError = error;
            console.warn(`Gemini model "${model}" was not found. Trying next fallback model.`);
        }
    }

    throw lastError;
};

const main = async (req, res) => {
    try {
        if (!ai) {
            return res.status(500).json({
                success: false,
                message: "GEMINI_API_KEY is missing in .env"
            });
        }

        const prompt = getPrompt(req.body);

        if (!prompt || !prompt.trim()) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required"
            });
        }

        const fullPrompt = `${SYSTEM_CONTEXT}\n\nUser: ${prompt.trim()}`;

        const response = await generateContentWithFallback(fullPrompt);

        // response.text is a getter on the SDK response object
        const text = response.text;

        if (!text || !text.trim()) {
            return res.status(500).json({
                success: false,
                message: "AI returned an empty response. Please try again."
            });
        }

        return res.json({
            success: true,
            message: "Content Generated",
            data: text.trim()
        });

    } catch (error) {
        console.error('Gemini error:', error.message || error);
        const { statusCode, message } = parseGeminiError(error);

        res.status(statusCode).json({
            success: false,
            message
        });
    }
};

module.exports = { main };
