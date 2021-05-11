import { useRouter } from 'next/router';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Dropdown from 'components/elements/Dropdown';
import { AiOutlineSetting } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';

const NavProject: React.FC<NavProjectProps> = ({
  team,
  project,
  onClickSetting,
  onClickDelete,
}) => {
  const router = useRouter();

  return (
    <div
      className={`
        group flex justify-between items-center pl-8 pr-3 py-2
        text-sm leading-5 font-medium rounded-md mb-1
        focus:outline-none  focus:bg-gray-200
        transition ease-in-out duration-150 cursor-pointer hover-trigger
        ${
          typeof router.query.projectFolderIds !== 'undefined' &&
          project.id === router.query.projectFolderIds[0]
            ? 'text-gray-900 bg-gray-200'
            : 'text-gray-600 hover:bg-gray-200'
        }
      `}
      aria-current="page"
    >
      <Link href={`/myproject/${team.id}/${project.id}`}>
        <span className="truncate w-full">{project.name}</span>
      </Link>
      <Dropdown
        left={0}
        top={-5}
        border
        button={
          <span className="hover-target">
            <BsThreeDotsVertical />
          </span>
        }
        buttonClassName="flex"
      >
        <a
          className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
          onClick={() => onClickSetting()}
        >
          <span className="mt-0.5 mr-2">
            <AiOutlineSetting size={16} />
          </span>
          <div className="font-normal">Project settings</div>
        </a>
        <a
          className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-100 rounded cursor-pointer"
          onClick={() => onClickDelete()}
        >
          <span className="mt-0.5 mr-2">
            <RiDeleteBinLine size={16} />
          </span>
          <div className="font-normal">Delete project</div>
        </a>
      </Dropdown>
    </div>
  );
};

type NavProjectProps = {
  team: any;
  project: any;
  onClickDelete?: any;
  onClickSetting?: any;
};

export default NavProject;
