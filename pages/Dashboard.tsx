
import React, { useState, useEffect } from 'react';

import { collection, query, getDocs, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { Folder, File, Note } from '../types';
import TrashIcon from '../components/icons/TrashIcon';
import Button from '../components/Button';
import Modal from '../components/Modal';
import NoteCard from '../components/NoteCard';

import Input from '../components/Input';


const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const foldersQuery = query(collection(db, `users/${currentUser.uid}/folders`));
        const filesQuery = query(collection(db, `users/${currentUser.uid}/files`));
        const notesQuery = query(collection(db, `users/${currentUser.uid}/notes`));

        const [foldersSnapshot, filesSnapshot, notesSnapshot] = await Promise.all([
          getDocs(foldersQuery),
          getDocs(filesQuery),
          getDocs(notesQuery),
        ]);

        setFolders(foldersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Folder)));
        setFiles(filesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as File)));
        setNotes(notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));

      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSaveNote = async () => {
    if (!currentUser || !newNoteTitle.trim()) return;

    try {
      const notesCollection = collection(db, `users/${currentUser.uid}/notes`);
      const newNote: Omit<Note, 'id'> = {
        title: newNoteTitle,
        content: newNoteContent,
        createdAt: new Date(),
      };
      const docRef = await addDoc(notesCollection, newNote);
      setNotes([...notes, { id: docRef.id, ...newNote }]);
      setNewNoteTitle('');
      setNewNoteContent('');
      setIsNoteModalOpen(false);
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  };

  const handleUploadFile = async () => {
    if (!currentUser || !selectedFile) return;

    setIsUploading(true);
    const storagePath = `user_uploads/${currentUser.uid}/${Date.now()}-${selectedFile.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed: ", error);
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const filesCollection = collection(db, `users/${currentUser.uid}/files`);
        const newFile: Omit<File, 'id'> = {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          storagePath,
          downloadURL,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(filesCollection, newFile);
        setFiles(prevFiles => [...prevFiles, { ...newFile, id: docRef.id }]);
        setIsUploading(false);
        setSelectedFile(null);
        setIsFileModalOpen(false);
      }
    );
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDelete = async (fileId: string, storagePath: string) => {
    if (!currentUser) return;

    try {
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);

      const docRef = doc(db, `users/${currentUser.uid}/files`, fileId);
      await deleteDoc(docRef);

      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file: ", error);
    }
  };

  const handleSaveFolders = async () => {
    if (!currentUser || !newFolderName.trim()) return;

    try {
      const foldersCollection = collection(db, `users/${currentUser.uid}/folders`);
      const newFolder: Omit<Folder, 'id'> = {
        name: newFolderName,
        createdAt: new Date(),
      };
      const docRef = await addDoc(foldersCollection, newFolder);
      setFolders([...folders, { id: docRef.id, ...newFolder }]);
      setNewFolderName('');
      setIsFolderModalOpen(false);
    } catch (error) {
      console.error("Error saving folder: ", error);
    }
  };

  return (
    <div className="w-full pb-20 md:pb-0">
      <header className="mb-8">
        <h1 className="text-4xl font-black uppercase text-brand-text">Dashboard</h1>
        <p className="text-brand-text-light mt-1">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'Archivist'}. Here's your knowledge base.</p>
      </header>

      <div className="space-y-12">
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-brand-text">My Files</h2>
            <div className="flex gap-2">
              {files.length >= 5 ? (
                <Button onClick={() => setIsUpgradeModalOpen(true)}>Upgrade</Button>
              ) : (
                <Button onClick={() => setIsFileModalOpen(true)}>Add File</Button>
              )}
            </div>
          </div>
          {loading ? (
            <p>Loading files...</p>
          ) : files.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Size</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map(file => (
                  <tr key={file.id}>
                    <td className="p-2">{file.name}</td>
                    <td className="p-2">{file.type}</td>
                    <td className="p-2">{file.size}</td>
                    <td className="p-2">
                      <div className="flex gap-2">
                        <Button onClick={() => handleDownload(file.downloadURL)}>Download</Button>
                        <Button onClick={() => handleDelete(file.id, file.storagePath)} variant="danger">
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No files or folders yet. Create one!</p>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold uppercase tracking-wider text-brand-text">My Notes</h2>
            <Button onClick={() => setIsNoteModalOpen(true)}>New Note</Button>
          </div>
          {loading ? (
            <p>Loading notes...</p>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {notes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <p>No notes yet. Create one!</p>
          )}
        </section>
      </div>

      <Modal isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title="New Folder">
        <div className="space-y-4">
          <Input
            id="folder-name"
            label="Folder Name"
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            required
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsFolderModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveFolders}>Save Folder</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isFileModalOpen} onClose={() => setIsFileModalOpen(false)} title="Upload File">
        <div className="space-y-4">
          <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} />
          {isUploading && <p>Progress: {uploadProgress.toFixed(2)}%</p>}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsFileModalOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadFile} disabled={!selectedFile || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} title="Upgrade your plan">
        <div className="space-y-4">
          <p>You have reached the free plan limit of 5 files.</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsUpgradeModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="New Note">
        <div className="space-y-4">
          <Input
            id="note-title"
            label="Title"
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            required
          />
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Type your thoughts, ideas, or reminders here..."
            className="w-full h-48 bg-brand-white border border-brand-gray-dark rounded-soft p-4 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-brand-black"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote}>Save Note</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;
