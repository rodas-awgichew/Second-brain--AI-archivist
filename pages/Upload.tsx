
import React, { useState, useCallback } from 'react';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { saveNoteToFirestore } from '../services/firebase';
import { File as FileType } from '../types';

const Upload: React.FC = () => {
    const { currentUser } = useAuth();
    const [note, setNote] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files && files.length > 0) {
            setSelectedFiles(files);
            setFeedback(`${files.length} file(s) selected.`);
        }
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files && files.length > 0) {
            setSelectedFiles(files);
            setFeedback(`${files.length} file(s) selected.`);
        }
    }

    const handleSaveNote = async () => {
        if (!note.trim() || !currentUser) return;
        setFeedback('Saving note...');
        try {
            await saveNoteToFirestore(currentUser.uid, { title: 'Quick Note', content: note });
            setNote('');
            setFeedback('Note saved successfully!');
        } catch (error) {
            console.error("Error saving note: ", error);
            setFeedback('Failed to save note.');
        } finally {
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    const handleUpload = async () => {
        if (!currentUser || selectedFiles.length === 0) return;

        setFeedback('Uploading files...');
        try {
            const filesCollection = collection(db, `users/${currentUser.uid}/files`);
            for (const file of selectedFiles) {
                const newFile: Omit<FileType, 'id'> = {
                    name: file.name,
                    size: file.size,
                    createdAt: new Date(),
                };
                await addDoc(filesCollection, newFile);
            }
            setSelectedFiles([]);
            setFeedback('Files uploaded successfully!');
        } catch (error) {
            console.error("Error uploading files: ", error);
            setFeedback('Failed to upload files.');
        } finally {
            setTimeout(() => setFeedback(''), 3000);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto pb-20 md:pb-0">
            <header className="mb-8">
                <h1 className="text-4xl font-black uppercase text-brand-text">Archive New Content</h1>
                <p className="text-brand-text-light mt-1">Add to your second brain. Upload files or jot down a quick note.</p>
            </header>

            <div className="space-y-10">
                {/* File Upload */}
                <div className="bg-brand-white border border-brand-gray-dark rounded-medium p-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-brand-text">Upload File</h2>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`bg-brand-gray-light border-2 border-dashed border-brand-gray-dark rounded-medium p-12 text-center transition-colors ${isDragging ? 'border-brand-black bg-brand-gray' : ''}`}
                    >
                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            multiple
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <p className="font-bold text-brand-text">Drag & drop files here</p>
                            <p className="text-sm text-brand-text-light my-2">or</p>
                            <span className="inline-block bg-brand-white text-brand-text border border-brand-gray-dark px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-soft hover:bg-brand-gray-light">
                                Click to browse
                            </span>
                        </label>
                    </div>
                    {selectedFiles.length > 0 && (
                        <div className="mt-4 text-right">
                            <Button onClick={handleUpload}>Upload</Button>
                        </div>
                    )}
                </div>

                {/* Quick Note */}
                <div className="bg-brand-white border border-brand-gray-dark rounded-medium p-6">
                    <h2 className="text-lg font-bold uppercase tracking-wider mb-4 text-brand-text">Quick Note</h2>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Type your thoughts, ideas, or reminders here..."
                        className="w-full h-48 bg-brand-white border border-brand-gray-dark rounded-soft p-4 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-brand-black"
                    />
                    <div className="flex justify-end items-center mt-4">
                        {feedback && <p className="text-sm mr-4 text-brand-text-light">{feedback}</p>}
                        <Button onClick={handleSaveNote} disabled={!note.trim()}>Save Note</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;
