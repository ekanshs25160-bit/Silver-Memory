import React, { useEffect } from 'react';
import { Outlet, useParams, Link, useLocation } from 'react-router-dom';
import { Avatar, Badge, Button } from '../components/ui';
import { useProject } from '../hooks/useProjects';
import { useMembers } from '../hooks/useMembers';

export default function ProjectDetailShell() {
  const { projectId } = useParams();
  const location = useLocation();
  const { project, isLoading, error, fetchProject } = useProject(projectId);
  const { members, fetchMembers } = useMembers(projectId);

  useEffect(() => {
    fetchProject();
    fetchMembers();
  }, [fetchProject, fetchMembers]);

  const currentTab = location.pathname.split('/').pop();

  if (isLoading) {
    return <div className="p-8 text-center text-on-surface-variant">Loading project details...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-error">Error loading project: {error}</div>;
  }

  if (!project) return null;

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-surface-container-lowest border-b border-surface-variant px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2 text-body-sm text-on-surface-variant mb-1">
              <Link to="/" className="hover:text-on-surface transition-colors">Projects</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface font-medium">{project.name}</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">{project.name}</h1>
              <Badge variant="success">Active</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-1.5 items-center mr-2">
              {members.slice(0, 3).map(member => (
                <div key={member._id || member.id} className="relative ring-2 ring-surface-container-lowest rounded-full overflow-hidden w-8 h-8">
                  <Avatar src={member.user?.avatar} initials={member.user?.initials || member.user?.name?.charAt(0) || 'U'} size="sm" />
                </div>
              ))}
              {members.length > 3 && (
                <div className="relative ring-2 ring-surface-container-lowest rounded-full w-8 h-8 bg-surface-container-high flex items-center justify-center text-[10px] font-medium text-on-surface-variant">
                  +{members.length - 3}
                </div>
              )}
            </div>
            <Button variant="secondary" icon="share">Share</Button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex space-x-6 mt-6 border-b border-surface-variant">
          <Link to={`/projects/${projectId}/tasks`} className={`pb-3 font-label-md transition-colors ${currentTab === 'tasks' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Tasks
          </Link>
          <Link to={`/projects/${projectId}/notes`} className={`pb-3 font-label-md transition-colors ${currentTab === 'notes' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Notes
          </Link>
          <Link to={`/projects/${projectId}/members`} className={`pb-3 font-label-md transition-colors ${currentTab === 'members' ? 'border-b-2 border-primary text-primary font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}>
            Members
          </Link>
        </div>
      </header>

      {/* Renders the sub-route component (ProjectDetailTasks or ProjectDetailNotesMembers) */}
      <Outlet context={{ project }} />
    </div>
  );
}
