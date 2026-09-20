import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Badge, Button, Input, Modal } from '../components/ui';
import { useProjects } from '../hooks/useProjects';

export default function ProjectsDashboard() {
  const navigate = useNavigate();
  const { projects, isLoading, error, fetchProjects, createProject } = useProjects();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', visibility: 'private', lead: '', template: 'blank' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async () => {
    try {
      await createProject({ name: newProject.name, description: newProject.description });
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', visibility: 'private', lead: '', template: 'blank' });
    } catch (err) {
      alert(err.message || 'Failed to create project');
    }
  };

  const handleSelectProject = (project) => {
    navigate(`/projects/${project._id}/tasks`);
  };

  const filteredProjects = projects.filter(p => 
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background text-on-surface font-body-md text-body-md antialiased min-h-screen flex flex-col">
      {/* TOP NAVIGATION */}
      <header className="bg-surface-container-lowest flex justify-between items-center w-full px-6 h-12 border-b border-surface-variant sticky top-0 z-30 select-none">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-on-primary font-headline-sm text-headline-sm shadow-sm">
              <span className="material-symbols-outlined text-[14px]">grid_view</span>
            </div>
            <span className="text-headline-sm font-headline-sm font-semibold tracking-tight text-on-surface">Silver Memory</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6 pt-3 h-12">
            <span className="text-primary font-semibold border-b-2 border-primary pb-3 font-label-md text-label-md flex items-center gap-1">
              Projects <span className="px-1.5 py-0.2 bg-primary-fixed text-on-primary-fixed rounded-full text-label-sm font-label-sm font-semibold">{projects.length}</span>
            </span>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative hidden sm:block">
            <div className="flex items-center bg-surface-container-low border border-surface-variant rounded-lg px-3 py-1 text-on-surface-variant focus-within:border-outline transition-colors w-44 focus-within:w-60">
              <span className="material-symbols-outlined text-[16px] mr-1.5">search</span>
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-body-sm w-full text-on-surface placeholder:text-on-surface-variant"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-low">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <Button variant="primary" icon="add" onClick={() => setIsModalOpen(true)} className="hidden sm:inline-flex">
            New Project
          </Button>
          <div className="relative pl-1 border-l border-surface-variant ml-2">
            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-surface-container-low transition-colors">
              <Avatar initials="AR" size="md" extraClasses="ring-1 ring-surface-variant" />
              <span className="hidden xl:inline-block font-label-md text-label-md text-on-surface font-medium">Alex Rivera</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[14px]">expand_more</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="hidden lg:flex flex-col justify-between h-[calc(100vh-48px)] w-60 p-3 border-r border-surface-variant bg-surface-container-lowest shrink-0 select-none">
          <div className="space-y-4">
            <button className="w-full flex items-center justify-center space-x-1.5 h-8 px-3 rounded-lg border border-surface-variant bg-surface-container-lowest hover:bg-surface-container-low font-label-md text-label-md text-on-surface font-medium transition-colors">
              <span className="material-symbols-outlined text-[16px] text-primary">add_task</span>
              <span>+ Add Task</span>
            </button>
            <nav className="space-y-1">
              {['Tasks', 'Notes'].map((item) => (
                <a key={item} href="#" className="flex items-center space-x-2.5 text-on-surface-variant hover:text-on-surface rounded-lg px-3 py-2 font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                  <span>{item}</span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto bg-surface p-6 md:p-8 space-y-6">
          <div className="max-w-[1280px] mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="font-headline-xl text-headline-xl font-bold tracking-tight text-on-surface">Projects</h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">All active workspaces and team initiatives</p>
              </div>
              <Button variant="primary" icon="add" onClick={() => setIsModalOpen(true)}>New Project</Button>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project, idx) => (
                <div 
                  key={project._id || project.id || idx} 
                  className="group bg-surface-container-lowest rounded-xl border border-surface-variant p-4 flex flex-col justify-between hover:border-outline-variant hover:shadow-sm cursor-pointer transition-all"
                  onClick={() => handleSelectProject(project)}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg bg-${project.color || 'indigo'}-50 border border-${project.color || 'indigo'}-100 flex items-center justify-center text-primary`}>
                          <span className="material-symbols-outlined text-[18px]">{project.icon || 'folder'}</span>
                        </div>
                        <div>
                          <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface group-hover:text-primary transition-colors">{project.name}</h3>
                          <div className="flex items-center space-x-1.5 mt-0.5">
                            {project.role && <Badge variant="admin">{project.role}</Badge>}
                            <span className="text-on-surface-variant text-[11px]">• {project.category || 'General'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-surface-variant/60 flex items-center justify-between">
                    <div className="flex -space-x-1.5 items-center">
                      {project.members && project.members.map((m, i) => (
                        <Avatar key={i} src={m.avatar} initials={m.initials} size="sm" extraClasses="border-surface-container-lowest" />
                      ))}
                    </div>
                    <span className="font-body-sm text-body-sm text-outline">
                      {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {projects.length === 0 && (
              <div className="mt-8 pt-6 border-t border-surface-variant/60">
                <div className="bg-surface-container-lowest rounded-xl border border-dashed border-surface-variant p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-3">
                    <span className="material-symbols-outlined text-[24px]">folder_off</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">No projects found</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-md">
                    Create your first project to begin tracking milestones, subtasks, and sprint deliverables with your team.
                  </p>
                  <Button variant="secondary" icon="add" onClick={() => setIsModalOpen(true)} className="mt-4">
                    Create New Project
                  </Button>
                </div>
              </div>
            )}

            {projects.length > 0 && filteredProjects.length === 0 && (
              <div className="mt-8 pt-6 border-t border-surface-variant/60">
                <div className="bg-surface-container-lowest rounded-xl border border-dashed border-surface-variant p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-11 h-11 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant mb-3">
                    <span className="material-symbols-outlined text-[24px]">search_off</span>
                  </div>
                  <h4 className="font-headline-sm text-headline-sm font-semibold text-on-surface">No projects match your search</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-md">
                    Try adjusting your search term to find what you're looking for.
                  </p>
                  <Button variant="secondary" onClick={() => setSearchQuery('')} className="mt-4">
                    Clear Search
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CREATE PROJECT MODAL */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Project"
        actions={<>
          <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreate}>Create Project</Button>
        </>}
      >
        <div className="space-y-4">
          <Input 
            label="Project Name" 
            placeholder="e.g. Website Redesign" 
            value={newProject.name}
            onChange={(e) => setNewProject({...newProject, name: e.target.value})}
          />
          <Input 
            label="Description" 
            placeholder="Brief overview of the project..." 
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          />
          
          <div className="space-y-1.5">
            <label className="font-label-md text-label-md text-on-surface font-medium">Visibility</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="visibility" value="public" checked={newProject.visibility === 'public'} onChange={() => setNewProject({...newProject, visibility: 'public'})} />
                <span className="text-body-sm">Public to Workspace</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="visibility" value="private" checked={newProject.visibility === 'private'} onChange={() => setNewProject({...newProject, visibility: 'private'})} />
                <span className="text-body-sm">Private</span>
              </label>
            </div>
          </div>
          
          <Input 
            label="Project Lead" 
            placeholder="Search team members..." 
            value={newProject.lead}
            onChange={(e) => setNewProject({...newProject, lead: e.target.value})}
          />
        </div>
      </Modal>
    </div>
  );
}
