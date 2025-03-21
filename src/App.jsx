import React, { useState } from 'react';
import FileUpload from './components/FileUpload.jsx';
import AudioRecorder from './components/AudioRecorder.jsx';
import TranscriptionDisplay from './components/TranscriptionDisplay.jsx';
import axios from 'axios'; // Import Axios

function App() {
  const [transcription, setTranscription] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const handleFileSelect = (file) => {
    setAudioFile(file);

  };

  const handleRecordingComplete = (blob) => {
    setAudioFile(blob);
  };

  const processAudio = async () => {
    if (!audioFile) {
      alert("Please select or record an audio file.");
      return;
    }

    setLoading(true);
    setTranscription('Generating transcription...'); // Show loading message

    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "https://speech-to-text-backend.up.railway.app/";
      const response = await axios.post(API_URL, formData, { // Backend endpoint
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setTranscription(response.data.transcription); // Display the result
    } catch (error) {
      console.error("Error sending audio:", error);
      setTranscription('Error generating transcription.'); // Show error message
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl px-4 sm:px-6 md:px-8 flex flex-col items-center justify-center">
        <FileUpload onFileSelect={handleFileSelect} />
        <AudioRecorder onRecordingComplete={handleRecordingComplete} />
        {audioFile && (
          <>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={processAudio} disabled={loading}>
              {loading ? 'Processing...' : 'Process Audio'}
            </button>
            <TranscriptionDisplay transcription={transcription} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
