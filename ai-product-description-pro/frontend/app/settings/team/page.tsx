'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Mail,
  Trash2,
  MoreVertical,
  Shield,
  Edit3,
  Eye,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Johan Doe',
    email: 'johan@example.com',
    role: 'owner',
    lastActive: '2024-01-15',
  },
  {
    id: '2',
    name: 'Maria Svensson',
    email: 'maria@example.com',
    role: 'editor',
    lastActive: '2024-01-14',
  },
  {
    id: '3',
    name: 'Erik Lindqvist',
    email: 'erik@example.com',
    role: 'viewer',
    lastActive: '2024-01-10',
  },
];

const roleLabels = {
  owner: { label: 'Ägare', icon: Shield, color: 'text-primary' },
  editor: { label: 'Redigerare', icon: Edit3, color: 'text-green-600' },
  viewer: { label: 'Visare', icon: Eye, color: 'text-gray-500' },
};

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor');

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      toast.error('Ange en e-postadress');
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      lastActive: 'Väntar på godkännande',
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setIsInviting(false);
    toast.success(`Inbjudan skickad till ${inviteEmail}`);
  };

  const removeMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member?.role === 'owner') {
      toast.error('Kan inte ta bort ägaren');
      return;
    }
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success('Medlem borttagen');
  };

  const updateRole = (id: string, newRole: 'editor' | 'viewer') => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
    toast.success('Roll uppdaterad');
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                Teamhantering
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Bjud in kollegor och hantera behörigheter
              </p>
            </div>
            <button
              onClick={() => setIsInviting(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Bjud in medlem
            </button>
          </div>

          {/* Invite Form */}
          {isInviting && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="font-semibold text-lg mb-4">Bjud in ny medlem</h2>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="E-postadress"
                    className="input"
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'editor' | 'viewer')}
                  className="input w-40"
                >
                  <option value="editor">Redigerare</option>
                  <option value="viewer">Visare</option>
                </select>
                <button onClick={handleInvite} className="btn-primary">
                  <Mail className="w-4 h-4 mr-2" />
                  Skicka
                </button>
                <button onClick={() => setIsInviting(false)} className="btn-secondary">
                  Avbryt
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p><strong>Redigerare:</strong> Kan skapa och redigera produkttexter</p>
                <p><strong>Visare:</strong> Kan endast se och exportera innehåll</p>
              </div>
            </motion.div>
          )}

          {/* Team Members */}
          <div className="card">
            <h2 className="font-semibold text-lg mb-4">
              Teammedlemmar ({members.length})
            </h2>
            <div className="space-y-4">
              {members.map((member) => {
                const roleInfo = roleLabels[member.role];
                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">
                          {member.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <roleInfo.icon className={`w-4 h-4 ${roleInfo.color}`} />
                        <span className={`text-sm font-medium ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </div>

                      <span className="text-sm text-gray-400">
                        {member.lastActive}
                      </span>

                      {member.role !== 'owner' && (
                        <div className="flex items-center gap-2">
                          <select
                            value={member.role}
                            onChange={(e) =>
                              updateRole(member.id, e.target.value as 'editor' | 'viewer')
                            }
                            className="input py-1 px-2 text-sm"
                          >
                            <option value="editor">Redigerare</option>
                            <option value="viewer">Visare</option>
                          </select>
                          <button
                            onClick={() => removeMember(member.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="card mt-8">
            <h2 className="font-semibold text-lg mb-4">Användning per medlem</h2>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">{member.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 50 + 10)} genereringar
                    </span>
                    <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.random() * 80 + 20}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
