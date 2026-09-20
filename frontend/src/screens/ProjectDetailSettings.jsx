import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useProject } from '../hooks/useProjects';
import { useMembers } from '../hooks/useMembers';
import { useAuthContext } from '../context/AuthContext';

export default function ProjectDetailSettings() {
  const { project } = useOutletContext();
  const navigate = useNavigate();
  const { updateProject, deleteProject } = useProject(project?._id || project?.id);
  const { members, fetchMembers } = useMembers(project?._id || project?.id);
  const { currentUser } = useAuthContext();

  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({ name: project.name || '', description: project.description || '' });
    }
  }, [project]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Find the current user's role in this project
  const currentMember = members.find(m => 
    (m.user?._id || m.user?.id || m.user) === (currentUser?._id || currentUser?.id)
  );
  
  // Also check if they are the owner as fallback
  const isOwner = project?.owner === (currentUser?._id || currentUser?.id);
  const isAdmin = isOwner || currentMember?.role === 'admin' || currentMember?.role === 'Admin';

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setIsUpdating(true);
    try {
      await updateProject(formData);
      // Optional: show a success toast here
    } catch (err) {
      alert(err.message || 'Failed to update project');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject();
      navigate('/', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete project');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-6">
      <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl p-6 md:p-8">
        <h2 className="font-headline-sm font-semibold text-on-surface mb-6">Project Settings</h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <Input 
            label="Project Name" 
            placeholder="e.g. Website Redesign" 
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isAdmin || isUpdating}
          />
          
          <div className="flex flex-col space-y-1.5">
            <label className="text-label-md font-label-md font-medium text-on-surface">Description</label>
            <textarea
              className="w-full bg-surface-container-lowest border border-outline text-on-surface rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[100px] text-body-md font-body-md disabled:opacity-60"
              placeholder="What is this project about?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={!isAdmin || isUpdating}
            />
          </div>

          {isAdmin && (
            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" disabled={isUpdating || !formData.name.trim()}>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>

        {/* Danger Zone */}
        {isAdmin && (
          <div className="mt-12 pt-8 border-t border-error/20">
            <h3 className="font-title-md font-semibold text-error mb-2">Danger Zone</h3>
            <p className="text-body-sm text-on-surface-variant mb-4">
              Once you delete a project, there is no going back. Please be certain.
            </p>
            
            {!showDeleteConfirm ? (
              <Button 
                variant="secondary" 
                className="!text-error !border-error/30 hover:!bg-error/10"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Project
              </Button>
            ) : (
              <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-error font-medium text-body-sm">Are you absolutely sure?</span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1 sm:flex-none">
                    Cancel
                  </Button>
                  <Button variant="primary" className="!bg-error hover:!bg-error/90 flex-1 sm:flex-none" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
