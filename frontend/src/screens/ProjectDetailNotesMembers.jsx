import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Badge, Button, Input } from '../components/ui';
import { useNotes } from '../hooks/useNotes';
import { useMembers } from '../hooks/useMembers';

export default function ProjectDetailNotesMembers() {
  const { projectId } = useParams();
  const { notes, fetchNotes, publishNote } = useNotes(projectId);
  const { members, fetchMembers, inviteMember, changeMemberRole } = useMembers(projectId);
  
  const [newNote, setNewNote] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    fetchNotes();
    fetchMembers();
  }, [fetchNotes, fetchMembers]);

  const handlePublish = async () => {
    if (!newNote.trim()) return;
    try {
      await publishNote(newNote);
      setNewNote('');
    } catch (err) {
      alert(err.message || 'Failed to publish note');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      await inviteMember(inviteEmail);
      setInviteEmail('');
    } catch (err) {
      alert(err.message || 'Failed to invite member');
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* NOTES FEED */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md font-semibold text-on-surface">Project Notes</h2>
          <Button variant="primary" icon="edit" onClick={handlePublish}>New Note</Button>
        </div>

        {/* New Note Input */}
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-4">
          <textarea 
            className="w-full bg-transparent border-none outline-none resize-none min-h-[100px] text-body-sm font-body-sm"
            placeholder="Write an update, decision, or notes (Markdown supported)..."
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
          ></textarea>
          <div className="flex justify-end mt-2">
            <Button variant="primary" onClick={handlePublish}>Publish</Button>
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {notes.map(note => (
            <div key={note._id || note.id} className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                <Avatar src={note.author?.avatar} initials={note.author?.initials || 'U'} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-label-md font-semibold text-on-surface">{note.author?.name || 'User'}</span>
                      <Badge variant={note.author?.role === 'Admin' ? 'admin' : 'secondary'}>{note.author?.role || 'Member'}</Badge>
                      <span className="text-xs text-outline">• {new Date(note.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <button className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined text-lg">more_horiz</span></button>
                  </div>
                  <div className="mt-2 text-body-md text-on-surface-variant prose prose-sm max-w-none">
                    <p>{note.body || note.content}</p>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant hover:text-primary">
                      <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                      {note.commentCount || 0} Comments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {notes.length === 0 && (
             <div className="py-12 text-center text-on-surface-variant border border-dashed border-surface-variant rounded-xl">
               <span className="material-symbols-outlined text-4xl mb-2">article</span>
               <p>No notes published yet.</p>
             </div>
          )}
        </div>
      </div>

      {/* MEMBERS PANEL */}
      <aside className="w-80 space-y-6">
        <div className="bg-surface-container-lowest border border-surface-variant rounded-xl p-5">
          <h3 className="font-headline-sm font-semibold mb-4 text-on-surface">Team Members</h3>
          
          {/* Invite */}
          <form className="flex gap-2 mb-6" onSubmit={handleInvite}>
            <div className="flex-1">
              <Input 
                placeholder="Email address..." 
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
              />
            </div>
            <Button variant="secondary" type="submit">Invite</Button>
          </form>

          {/* Member List */}
          <div className="space-y-4">
            {members.map(member => (
              <div key={member._id || member.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={member.user?.avatar} initials={member.user?.initials || 'U'} size="md" />
                  <div>
                    <div className="font-label-sm font-semibold text-on-surface">{member.user?.name || member.name}</div>
                    <div className="text-[10px] text-on-surface-variant">{member.user?.email || member.email}</div>
                  </div>
                </div>
                <div className="relative group cursor-pointer" onClick={() => changeMemberRole(member._id || member.id, member.role === 'admin' ? 'member' : 'admin')}>
                  <Badge variant={member.role === 'admin' ? 'admin' : 'secondary'}>{member.role}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
