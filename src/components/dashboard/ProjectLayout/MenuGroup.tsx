import { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import CreateProjectModal from '../CreateProjectModal';

const MenuGroup: React.FC<{ children: any; team: any }> = ({
  children,
  team,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);

  return (
    <>
      <nav>
        <a className="flex justify-between items-center text-grey-500 px-3 py-2 text-gray-500 cursor-pointer outline-none">
          <div className="flex" onClick={() => setIsOpen(!isOpen)}>
            <svg
              className={`
                flex-shrink-0 w-5 h-5 mr-1 -ml-1 transform
                ${isOpen ? '-rotate-90' : 'rotate-180'}
                ${team.projects.length > 0 ? 'visible' : 'invisible'}
              `}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm">{team.name}</span>
          </div>
          <span
            className="flex justify-center items-center w-5 h-5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
            onClick={() => setOpenCreateProjectModal(true)}
          >
            <BiPlus size={13} />
          </span>
        </a>
        {isOpen && children}
      </nav>
      <CreateProjectModal
        teamId={team.id}
        open={openCreateProjectModal}
        requestClose={() => setOpenCreateProjectModal(false)}
      />
    </>
  );
};

export default MenuGroup;
