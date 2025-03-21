import React, { useState } from 'react';

function FileUpload({ onFileSelect }) {
    const [selectedFile, setSelectedFile] = useState(null);


    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        onFileSelect(file); // Pass the file to the parent component
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file.type.startsWith('audio/')) {
            alert('Invalid file type. Please upload an audio file.');
            return;
        }
        setAudioFile(file);
    };

    console.log("Uploading file:", selectedFile);

    const handleUpload = async () => {
        if (!selectedFile) {
            console.error("No file selected for upload!");
            return;
        }

        console.log("Uploading file:", selectedFile);  // 🔍 Check if file is selected

        const formData = new FormData();
        formData.append("audio", selectedFile);

        try {
            const response = await fetch("http://localhost:5175/upload", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            console.log("Upload response:", data);  // 🔍 Log API response
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };



    return (
        <div className="w-full flex flex-col items-center bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg text-center mb-4">
            <div className="w-full max-w-2xl flex flex-col justify-center items-center bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Speech-to-Text Application</h1>
                <p className="text-blue-200 mb-4 sm:mb-6">Upload an audio file to transcribe it.</p>

                <div className="w-full p-3 sm:p-4 bg-gray-700 rounded-lg">
                    <label htmlFor="audioUpload" className="block text-gray-300 font-medium ">
                        Upload Your Audio File
                    </label>
                    <input
                        type="file"
                        id="audioUpload"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-violet-500 mt-3"
                    />
                </div>

                {selectedFile && <p className="mt-2 text-sm text-gray-500">Selected file: {selectedFile.name}</p>}
            </div>
        </div>
    );
}

export default FileUpload;
