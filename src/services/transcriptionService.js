import axios from 'axios';

const BASE_URL = 'http://localhost:5175/transcribe';

const uploadAudio = async (audioFile) => {
    try {
        const formData = new FormData();
        formData.append('audio', audioFile);

        const response = await axios.post(BASE_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.transcription;
    } catch (error) {
        console.error('Error uploading audio:', error);
        throw error;
    }
};

export const transcriptionService = {
    uploadAudio,
};
