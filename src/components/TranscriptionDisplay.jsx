// components/TranscriptionDisplay.jsx
import React from 'react';

function TranscriptionDisplay({ transcription }) {
    return (
        <div className="w-full bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mt-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 text-center">Transcription</h2>
            <div className="bg-gray-700 p-3 sm:p-4 rounded-md w-full">
                <p className="text-gray-300 whitespace-pre-wrap break-words">
                    {transcription || 'No transcription available.'}
                </p>

            </div>
        </div>
    );
}

export default TranscriptionDisplay;

