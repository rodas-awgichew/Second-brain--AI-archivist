
import { ArchivedCardData } from '../types';

export const mockData: ArchivedCardData[] = [
  { id: '1', title: 'On Brutalism', summary: 'Brutalism is a style with an emphasis on materials, textures and construction, producing highly expressive forms...', type: 'note', createdAt: new Date('2023-10-26') },
  { id: '2', title: 'React Hooks Cheatsheet', summary: 'A quick reference for useState, useEffect, useContext, and other essential React hooks for modern component development.', type: 'pdf', createdAt: new Date('2023-10-25') },
  { id: '3', title: 'Inspiration Gallery', summary: 'A collection of inspiring web designs and architectural photos.', type: 'image', createdAt: new Date('2023-10-24') },
  { id: '4', title: 'Project Archivist Ideas', summary: 'Initial brainstorming for the second brain app. Focus on monochrome palette and minimalist UI.', type: 'note', createdAt: new Date('2023-10-24') },
  { id: '5', title: 'Tailwind CSS Config', summary: 'Configuration file for setting up custom theme colors and fonts for the project.', type: 'pdf', createdAt: new Date('2023-10-22') },
  { id: '6', title: 'Meeting Notes', summary: 'Discussion about the Q4 roadmap and upcoming feature releases for the project.', type: 'note', createdAt: new Date('2023-10-25') },
];
