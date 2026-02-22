import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';
import { File, Note } from '../types';
import HomeIcon from '../components/icons/HomeIcon';
import UploadIcon from '../components/icons/UploadIcon';


const Log: React.FC = () => {
  const { currentUser } = useAuth();
  const [timelineItems, setTimelineItems] = useState<(File | Note)[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const filesQuery = query(collection(db, `users/${currentUser.uid}/files`), orderBy('createdAt', 'desc'));
        const notesQuery = query(collection(db, `users/${currentUser.uid}/notes`), orderBy('createdAt', 'desc'));

        const [filesSnapshot, notesSnapshot] = await Promise.all([
          getDocs(filesQuery),
          getDocs(notesQuery),
        ]);

        const files = filesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as File));
        const notes = notesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Note));

        const allItems = [...files, ...notes].sort((a, b) => {
          const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
          const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        });
        setTimelineItems(allItems);

      } catch (error) {
        console.error("Error fetching log data: ", error);
      }
    };

    fetchData();
  }, [currentUser]);
    
  const groupedData = useMemo(() => {
    const groups: { [key: string]: (File | Note)[] } = {};
    timelineItems.forEach(item => {
      const date = item.createdAt instanceof Timestamp ? item.createdAt.toDate() : new Date(item.createdAt);
      const dateKey = date.toISOString().split('T')[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    return groups;
  }, [timelineItems]);



  return (
    <div className="w-full max-w-4xl mx-auto pb-20 md:pb-0">
      <header className="mb-8">
        <h1 className="text-4xl font-black uppercase text-brand-text">Content Log</h1>
        <p className="text-brand-text-light mt-1">A chronological timeline of your archived knowledge.</p>
      </header>

      <div className="relative">
        {/* The timeline line */}
        <div className="absolute left-4 md:left-1/2 -ml-[1px] h-full w-[2px] bg-brand-gray-dark"></div>

        {Object.entries(groupedData).map(([date, items]) => (
          <div key={date} className="mb-12">
            {/* Date Marker */}
            <div className="flex items-center mb-4">
              <div className="z-10 bg-brand-black text-brand-white rounded-full h-8 w-8 flex items-center justify-center absolute left-0 md:left-1/2 -ml-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <h2 className="font-bold text-lg ml-12 md:ml-0 md:w-1/2 md:text-right md:pr-12">
                {new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </h2>
            </div>

            {/* Items for the date */}
            <div className="space-y-6">
              {items.map((item, index) => {
                  const isFile = 'size' in item;
                  const ItemIcon = isFile ? UploadIcon : HomeIcon;
                  const itemColor = isFile ? 'text-blue-500' : 'text-yellow-500';
                  const isLeft = index % 2 === 0;
                  
                  return (
                    <div key={item.id} className={`flex items-center ${isLeft ? 'md:flex-row-reverse' : ''} w-full`}>
                      <div className="hidden md:block w-1/2"></div>
                      {/* FIX: Replaced double quotes with backticks to correctly form a template literal for the className. */}
                      <div className={`w-full md:w-1/2 ml-12 md:ml-0 ${isLeft ? 'md:pr-6 md:text-right' : 'md:pl-6'}`}>
                        <div className="bg-brand-white border border-brand-gray-dark rounded-medium p-4 transition-shadow hover:shadow-lg">
                           <div className={`flex items-center gap-3 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                               <ItemIcon className={`w-5 h-5 flex-shrink-0 ${itemColor}`} />
                               <h3 className="font-bold text-brand-text">{'title' in item ? item.title : item.name}</h3>
                           </div>
                           <p className={`mt-2 text-sm text-brand-text-light ${isLeft ? 'md:text-right' : 'md:text-left'}`}>{isFile ? `${item.size} bytes` : item.content}</p>
                        </div>
                      </div>
                    </div>
                  )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Log;