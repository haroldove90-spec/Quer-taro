
import React, { useState } from 'react';
import { announcements } from '../../data/mockData';
import { Card, CardContent, CardTitle } from '../ui/Card';
import { generateAnnouncement } from '../../services/geminiService';
import { ICONS } from '../../constants';

const Communication: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [generatedAnnouncement, setGeneratedAnnouncement] = useState({ title: '', content: ''});
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    const result = await generateAnnouncement(topic);
    // Simple parsing, assuming "Title:\n\nContent" format
    const parts = result.split('\n\n');
    const title = parts[0].replace('**', '').replace('**', '').trim();
    const content = parts.slice(1).join('\n\n');

    setGeneratedAnnouncement({title, content});
    setIsLoading(false);
  };

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
            <CardTitle>Tablón de Anuncios</CardTitle>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 border dark:border-gray-700 rounded-lg">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">{ann.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{ann.date} por {ann.author}</p>
                    <p className="text-gray-700 dark:text-gray-300">{ann.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardTitle>Generar Comunicado (IA)</CardTitle>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tema del comunicado</label>
                <input
                  type="text"
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Ej: Fumigación en áreas comunes"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300"
              >
                {isLoading ? 'Generando...' : 'Generar con IA'}
              </button>

              {generatedAnnouncement.title && (
                <div className="mt-4 p-4 border border-dashed border-primary-400 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <h5 className="font-bold text-gray-800 dark:text-gray-100">{generatedAnnouncement.title}</h5>
                    <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{generatedAnnouncement.content}</p>
                    <div className="mt-4 flex gap-2">
                        <button className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1 rounded-md">Publicar</button>
                        <button onClick={() => setGeneratedAnnouncement({title: '', content: ''})} className="text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 px-3 py-1 rounded-md">Descartar</button>
                    </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Communication;
