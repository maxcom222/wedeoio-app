import { createRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Dropdown from 'components/elements/Dropdown';
import Arrow from 'components/icons/Arrow';
import Sidebar from './Sidebar';
import InviteModal from '../InviteModal';
import CreateFolderModal from '../CreateFolderModal';
import { BiMessageCheck } from 'react-icons/bi';
import { HiOutlinePresentationChartLine, HiUserAdd } from 'react-icons/hi';
import { FiChevronRight } from 'react-icons/fi';
import { SiYoutube } from 'react-icons/si';
import { RiFileUploadLine, RiFolderLine } from 'react-icons/ri';
import Link from 'next/link';
import CreateYoutubeModal from '../CreateYoutubeModal';
import { uploadFiles } from 'redux/slices/fileSlice';
import { useRouter } from 'next/router';
import CircleCharIcon from 'components/dashboard/CircleCharIcon';

const SingleProjectLayout: React.FC<{ children: any }> = ({ children }) => {
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);
  const [openYoutubeModal, setOpenYoutubeModal] = useState(false);

  const dispatch: any = useDispatch();
  const router = useRouter();
  const teamId = router.query.teamId;
  const team = useSelector((state: any) => state.team.data);
  const project = useSelector((state: any) => state.project.data);
  const currentFolder = useSelector((state: any) => state.file.currentFolder);
  const path = currentFolder
    ? [
        ...currentFolder.path,
        { id: currentFolder.id, name: currentFolder.name },
      ]
    : [];

  const projectId = router.query.projectFolderIds[0];
  const parentId =
    typeof router.query.projectFolderIds[1] === 'undefined'
      ? ''
      : router.query.projectFolderIds[1];

  const fileInputRef: any = createRef<HTMLInputElement>();

  const handleUploadFiles = (e: any) => {
    dispatch(
      uploadFiles({
        blobs: Array.from(e.target.files),
        teamId,
        projectId,
        parentId,
      })
    );
  };

  return (
    <>
      <div className="md:flex flex-col md:flex-row w-full min-h-screen bg-gray-100">
        <div className="flex-shrink-0 w-60 border-r border-gray-200 bg-white">
          <div className="text-xl text-gray-600 pl-5 py-3">
            <Link href="/">
              <a href="" className="flex">
                <img
                  className="w-auto h-8 sm:h-10"
                  src="/img/logo.svg"
                  alt="Wedeo"
                />
              </a>
            </Link>
          </div>
          <div className="p-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex flex-col w-full">
          <Header>
            <div className="mx-auto sm:px-6 lg:px-8">
              <div className="flex justify-between py-3">
                <div className="flex items-center">
                  <Link href={`/myproject/${teamId}/${project?.id}`}>
                    <span
                      className={`text-xl cursor-pointer mr-2 ${
                        path.length === 0 ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {project?.name}
                    </span>
                  </Link>
                  {path.map((parent, key) => (
                    <Link
                      key={key}
                      href={`/myproject/${teamId}/${project?.id}/${parent.id}`}
                    >
                      <span
                        className={`flex items-center text-xl cursor-pointer mr-2 ${
                          key === path.length - 1
                            ? 'text-gray-600'
                            : 'text-gray-400'
                        }`}
                      >
                        <FiChevronRight className="-mb-0.5 mr-1" />
                        <span>{parent?.name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <span
                      className="flex justify-center items-center w-7 h-7 rounded-full text-gray-700 bg-gray-200 hover:bg-gray-300 cursor-pointer"
                      onClick={() => setOpenInviteModal(!openInviteModal)}
                    >
                      <HiUserAdd size={16} />
                    </span>
                  </div>
                  <div className="flex mr-4">
                    {team?.users
                      .filter((el) => el.status === 'active')
                      .map((el, key) => (
                        <CircleCharIcon
                          key={key}
                          string={el.name}
                          className="w-8 h-8 border-2 border-white -ml-2.5"
                        />
                      ))}
                  </div>
                  <Dropdown
                    left={-20}
                    border
                    button={
                      <button className="inline-flex items-center px-6 py-1 text-sm text-white bg-indigo-500 border-0 rounded focus:outline-none hover:bg-indigo-600">
                        Share
                      </button>
                    }
                  >
                    <a className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer">
                      <span className="mt-0.5 mr-2">
                        <BiMessageCheck size={16} />
                      </span>
                      <div>
                        <div className="">Share as Review Link</div>
                        <div className="text-xs text-gray-400">
                          Viewers can leave comments
                        </div>
                      </div>
                    </a>
                    <a className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer">
                      <span className="mt-0.5 mr-2">
                        <HiOutlinePresentationChartLine size={16} />
                      </span>
                      <div>
                        <div className="">Share as Presentation</div>
                        <div className="text-xs text-gray-400">
                          View-only links with custom branding
                        </div>
                      </div>
                    </a>
                  </Dropdown>
                  <Dropdown
                    position="right"
                    border
                    button={
                      <button className="inline-flex items-center pl-4 pr-2 py-1 ml-4 text-sm text-gray-700 bg-gray-200 border-0 rounded focus:outline-none hover:bg-gray-300">
                        <span className="mr-3">New</span>
                        <Arrow direction="down" />
                      </button>
                    }
                  >
                    <a
                      className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => {
                        fileInputRef.current.click();
                        fileInputRef.current.value = null;
                      }}
                    >
                      <span className="mt-0.5 mr-2">
                        <RiFileUploadLine size={16} />
                      </span>
                      <div>File upload</div>
                    </a>
                    {/* <a className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer">
                      <span className="mt-0.5 mr-2">
                        <RiFolderUploadLine size={16} />
                      </span>
                      <div>Folder upload</div>
                    </a> */}
                    <a
                      className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => {
                        setOpenYoutubeModal(true);
                      }}
                    >
                      <span className="mt-0.5 mr-2">
                        <SiYoutube size={16} />
                      </span>
                      <div>Import Youtube</div>
                    </a>
                    <hr className="my-1" />
                    <a
                      className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => {
                        setOpenCreateFolderModal(true);
                      }}
                    >
                      <span className="mt-0.5 mr-2">
                        <RiFolderLine size={16} />
                      </span>
                      <div>New folder</div>
                    </a>
                    {/* <a
                      className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <span className="mt-0.5 mr-2">
                        <RiFolderLockLine size={16} />
                      </span>
                      <div>New private folder</div>
                    </a> */}
                  </Dropdown>
                </div>
              </div>
            </div>
          </Header>
          {children}
        </div>
      </div>
      <InviteModal
        open={openInviteModal}
        requestClose={() => setOpenInviteModal(false)}
      />
      <CreateFolderModal
        open={openCreateFolderModal}
        requestClose={() => setOpenCreateFolderModal(false)}
      />
      <CreateYoutubeModal
        open={openYoutubeModal}
        requestClose={() => setOpenYoutubeModal(false)}
      />
      <input
        ref={fileInputRef}
        type="file"
        className="absolute hidden"
        accept=".avi, .mp4, .mp3, .jpg, .jpeg, .png, .gif"
        onChange={handleUploadFiles}
        multiple
      />
    </>
  );
};

export default SingleProjectLayout;
