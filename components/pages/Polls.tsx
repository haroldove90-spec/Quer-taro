
import React, { useState } from 'react';
import { Poll, User, Owner, UserRole, PollOption } from '../../types';
import { Card, CardContent, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { ICONS } from '../../constants';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface PollsPageProps {
  currentUser: User;
  polls: Poll[];
  owners: Owner[];
  addPoll: (poll: Poll) => void;
  handleVote: (pollId: string, optionId: string, ownerId: string) => void;
}

const PollResultBar: React.FC<{ option: PollOption; totalVotes: number }> = ({ option, totalVotes }) => {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <p className="text-gray-700 dark:text-gray-300">{option.text}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-100">{option.votes} Votos ({percentage.toFixed(1)}%)</p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-primary-700 rounded-full h-2.5">
        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const PollsPage: React.FC<PollsPageProps> = ({ currentUser, polls, owners, addPoll, handleVote }) => {
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newPoll, setNewPoll] = useState({
    title: '',
    description: '',
    closingDate: '',
    options: [{ text: '' }, { text: '' }]
  });
  const [selectedVote, setSelectedVote] = useState<string | null>(null);

  const currentOwner = owners.find(o => o.email === currentUser.email);

  const handleNewPollChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPoll(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index: number, value: string) => {
    const options = [...newPoll.options];
    options[index].text = value;
    setNewPoll(prev => ({ ...prev, options }));
  };

  const addOption = () => {
    setNewPoll(prev => ({ ...prev, options: [...prev.options, { text: '' }] }));
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length <= 2) return;
    const options = newPoll.options.filter((_, i) => i !== index);
    setNewPoll(prev => ({ ...prev, options }));
  };
  
  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    const pollToAdd: Poll = {
      id: `poll-${Date.now()}`,
      title: newPoll.title,
      description: newPoll.description,
      closingDate: newPoll.closingDate,
      options: newPoll.options.map((opt, index) => ({ id: `opt-${Date.now()}-${index}`, text: opt.text, votes: 0 })),
      status: 'active',
      creationDate: new Date().toISOString().split('T')[0],
      votedBy: []
    };
    addPoll(pollToAdd);
    setCreateModalOpen(false);
    setNewPoll({ title: '', description: '', closingDate: '', options: [{ text: '' }, { text: '' }] });
  };

  const submitVote = (pollId: string) => {
    if (!selectedVote || !currentOwner) return;
    handleVote(pollId, selectedVote, currentOwner.id);
    setSelectedVote(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Encuestas y Votaciones</h1>
        {currentUser.role === UserRole.Admin && (
          <Button leftIcon={ICONS.plus} onClick={() => setCreateModalOpen(true)}>Crear Encuesta</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {polls.sort((a,b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()).map(poll => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
          const userHasVoted = currentOwner && poll.votedBy.includes(currentOwner.id);
          const canVote = currentUser.role === UserRole.Resident && poll.status === 'active' && !userHasVoted;
          const showResults = poll.status === 'closed' || userHasVoted || currentUser.role === UserRole.Admin;

          return (
            <Card key={poll.id}>
              <CardTitle>
                <div className="flex justify-between items-start">
                  <span>{poll.title}</span>
                  <Badge color={poll.status === 'active' ? 'green' : 'gray'}>{poll.status === 'active' ? 'Activa' : 'Cerrada'}</Badge>
                </div>
              </CardTitle>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{poll.description}</p>
                <p className="text-xs text-gray-500 mb-4">Cierra el: {poll.closingDate}</p>

                <div className="space-y-4">
                  {canVote && (
                    <div className="space-y-2">
                      {poll.options.map(option => (
                        <label key={option.id} className="flex items-center p-3 border dark:border-primary-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-primary-800/50">
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            value={option.id}
                            checked={selectedVote === option.id}
                            onChange={() => setSelectedVote(option.id)}
                            className="h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                          />
                          <span className="ml-3 text-gray-800 dark:text-gray-200">{option.text}</span>
                        </label>
                      ))}
                      <Button onClick={() => submitVote(poll.id)} disabled={!selectedVote} className="w-full mt-2">
                        Votar
                      </Button>
                    </div>
                  )}

                  {showResults && (
                    <div className="space-y-3">
                       <h4 className="font-semibold text-gray-800 dark:text-gray-100">Resultados:</h4>
                       {poll.options.map(option => (
                           <PollResultBar key={option.id} option={option} totalVotes={totalVotes} />
                       ))}
                       {userHasVoted && <p className="text-center text-sm font-semibold text-primary-600 dark:text-primary-400 mt-4">¡Gracias por tu voto!</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Crear Nueva Encuesta"
        footer={<><Button variant="secondary" onClick={() => setCreateModalOpen(false)}>Cancelar</Button><Button onClick={handleCreatePoll}>Publicar Encuesta</Button></>}
      >
        <form onSubmit={handleCreatePoll} className="space-y-4">
            <div>
                <label className="block text-sm font-medium">Título</label>
                <input type="text" name="title" value={newPoll.title} onChange={handleNewPollChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Descripción</label>
                <textarea name="description" value={newPoll.description} onChange={handleNewPollChange} rows={3} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium">Fecha de Cierre</label>
                <input type="date" name="closingDate" value={newPoll.closingDate} onChange={handleNewPollChange} className="mt-1 block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Opciones de Votación</label>
                <div className="space-y-2">
                    {newPoll.options.map((opt, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input type="text" value={opt.text} onChange={(e) => handleOptionChange(index, e.target.value)} placeholder={`Opción ${index + 1}`} className="flex-grow block w-full rounded-md dark:bg-primary-800 border-gray-300 dark:border-primary-600" required />
                            <Button variant="danger" size="sm" onClick={() => removeOption(index)} disabled={newPoll.options.length <= 2}>
                                {ICONS.delete}
                            </Button>
                        </div>
                    ))}
                </div>
                <Button variant="secondary" size="sm" onClick={addOption} className="mt-2">
                    Agregar Opción
                </Button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default PollsPage;
