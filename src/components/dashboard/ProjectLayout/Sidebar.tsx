import { useRouter } from 'next/router';
import MenuGroup from './MenuGroup';
import NavProject from './NavProject';
import { useSelector, useDispatch } from 'react-redux';
import { deleteProject } from 'redux/slices/projectSlice';
import ConfirmModal from '../ConfirmModal';
import { useState } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import UpdateProjectModal from '../UpdateProjectModal';

const Sidebar: React.FC<any> = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const projectId = router.query.projectFolderIds
    ? router.query.projectFolderIds[0]
    : null;
  const teams = useSelector((state: any) => state.auth.user.teams);

  const [projectDeleting, setProjectDeleting] = useState(null);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [projectUpdating, setProjectUpdating] = useState(null);
  const [showUpdateProjectModal, setShowUpdateProjectModal] = useState(false);
  const deleting = useSelector((state: any) => state.project.deleting);

  const handleDeleteProject = () => {
    dispatch(deleteProject(projectDeleting))
      .then(unwrapResult)
      .then(() => {
        setShowDeleteProjectModal(false);
        if (projectId === projectDeleting.id) router.replace(`/myproject`);
      });
  };

  return (
    <>
      {teams?.map((team, key) => (
        <MenuGroup key={key} team={team}>
          {team.projects?.map((el, key) => (
            <NavProject
              key={key}
              team={team}
              project={el}
              onClickSetting={() => {
                setProjectUpdating(el);
                setShowUpdateProjectModal(true);
              }}
              onClickDelete={() => {
                setProjectDeleting(el);
                setShowDeleteProjectModal(true);
              }}
            />
          ))}
        </MenuGroup>
      ))}
      <ConfirmModal
        open={showDeleteProjectModal}
        closeModal={() => setShowDeleteProjectModal(false)}
        title={'Delete the project?'}
        text={`Are you sure you want to delete "${projectDeleting?.name}"? All associated media will be permanently deleted and this CANNOT be undone.`}
        processing={deleting}
        confirmColor="red"
        confirmText="Delete"
        confirmAction={() => handleDeleteProject()}
      />
      <UpdateProjectModal
        open={showUpdateProjectModal}
        project={projectUpdating}
        requestClose={() => setShowUpdateProjectModal(false)}
      />
    </>
  );
};

export default Sidebar;
