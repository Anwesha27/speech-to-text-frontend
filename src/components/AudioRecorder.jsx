import React, { useState, useRef } from 'react';
import axios from 'axios';

function AudioRecorder({ onTranscriptionComplete }) {
    const [recording, setRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const [audioBlob, setAudioBlob] = useState(null); // Store the recorded audio blob

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            mediaRecorder.current.ondataavailable = handleDataAvailable;
            mediaRecorder.current.onstop = handleStop;
            audioChunks.current = [];
            mediaRecorder.current.start();
            setRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Unable to access microphone. Please check your permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
            mediaRecorder.current.stop();
            setRecording(false);
        }
    };

    const handleDataAvailable = (event) => {
        audioChunks.current.push(event.data);
    };

    const handleStop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/wav' });
        setAudioBlob(blob); // Save the audio blob
    };

    const processAudio = async () => {
        if (!audioBlob) {
            setError("No audio recorded. Please record audio before processing.");
            return;
        }
        const onTranscriptionComplete = (transcription) => {
            console.log("Transcription completed: ", transcription);
        };

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob);

            // Replace with your deployed backend URL
            const response = await axios.post('http://localhost:5175/transcribe', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data && response.data.transcription) {
                onTranscriptionComplete(response.data.transcription); // Pass transcription result to parent component
            } else {
                setError("Failed to process audio. Please try again.");
            }
        } catch (err) {
            console.error("Error processing audio:", err);
            setError("An error occurred while processing the audio.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col items-center justify-center mb-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Or Record Audio</h2>

            {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

            <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-md text-white ${recording ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} focus:outline-none`}
                disabled={loading}
            >
                {recording ? 'Stop Recording' : 'Start Recording'}
            </button>

            <button
                onClick={processAudio}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ml-4"
                disabled={!audioBlob || loading}
            >
                {loading ? 'Processing...' : 'Process Audio'}
            </button>
            {audioBlob && (
                <p className="mt-2 text-sm text-gray-300">Audio recorded successfully.</p>
            )}
        </div>
    );
}

export default AudioRecorder;
