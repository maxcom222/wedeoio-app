import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { fetchTeam } from 'redux/slices/teamSlice';
import { fetchProject } from 'redux/slices/projectSlice';
import { fetchFiles, deleteFile } from 'redux/slices/fileSlice';
import SingleProjectLayout from 'components/dashboard/ProjectLayout/SingleProjectLayout';
import withAuth from 'middlewares/withAuth';
import Link from 'next/link';
import Folder from 'components/icons/Folder';
import _File from 'components/icons/_File';
import Dropdown from 'components/elements/Dropdown';
import ConfirmModal from 'components/dashboard/ConfirmModal';
import RenameFileModal from 'components/dashboard/RenameFileModal';
import { unwrapResult } from '@reduxjs/toolkit';
import { useDropzone } from 'react-dropzone';
import { uploadFiles } from 'redux/slices/fileSlice';

import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  RiDeleteBinLine,
  RiFolderUnknowFill,
  RiEditLine,
} from 'react-icons/ri';
import { MdCloudUpload } from 'react-icons/md';
import { CgSpinner } from 'react-icons/cg';
import { FaYoutube, FaVideo, FaImage } from 'react-icons/fa';

import { db } from 'config/firebase';

import { withTranslation } from 'react-i18next';

const Project: React.FC<any> = ({ t }) => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const teamId = router.query.teamId;
  const projectId = router.query.projectFolderIds[0];
  const folderId =
    typeof router.query.projectFolderIds[1] === 'undefined'
      ? ''
      : router.query.projectFolderIds[1];
  const { folder, folderLoading } = useSelector((state: any) => ({
    folder: state.file.data,
    folderLoading: state.file.loading,
  }));

  const [fileRenaming, setFileRenaming] = useState(null);
  const [openRenameFileModal, setOpenRenameFileModal] = useState(false);
  const [fileDeleting, setFileDeleting] = useState(null);
  const [showDeleteFileModal, setShowDeleteFileModal] = useState(false);

  const deleting = useSelector((state: any) => state.file.deleting);

  useEffect(() => {
    dispatch(fetchTeam(teamId));
    dispatch(fetchProject(projectId));

    const unsubscribe = db
      .collection('files')
      .where('projectId', '==', projectId)
      .where('parentId', '==', folderId)
      .orderBy('createdAt')
      .onSnapshot((docs) => {
        const files = [];

        docs.forEach((doc) => {
          files.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        dispatch(fetchFiles({ files, folderId }));
      });

    return () => unsubscribe();
  }, [projectId, folderId]);

  const handleDeleteFile = () => {
    dispatch(deleteFile(fileDeleting))
      .then(unwrapResult)
      .then(() => {
        return;
      });
    setShowDeleteFileModal(false);
  };

  const onDrop = (files) => {
    dispatch(
      uploadFiles({ blobs: files, teamId, projectId, parentId: folderId })
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <SingleProjectLayout>
      <main
        className="relative w-full h-full mx-auto overflow-hidden sm:block outline-none"
        {...getRootProps()}
      >
        {folder && !folderLoading && (
          <>
            <input className="absolute invisible" {...getInputProps} />
            {isDragActive && (
              <div className="flex justify-center items-center absolute w-full h-full bg-gray-200 bg-opacity-80 z-10">
                <div className="flex flex-col items-center">
                  <MdCloudUpload size={50} className="text-indigo-500" />
                  <span className="text-indigo-500 text-base font-bold">
                    {t('Drop files to upload')}
                  </span>
                </div>
              </div>
            )}
            {folder.length > 0 ? (
              <div className="grid xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 p-8">
                {folder.map((file, key) => (
                  <div
                    key={key}
                    className="relative cursor-pointer hover-trigger"
                  >
                    {file.type === 'folder' ? (
                      <div className="relative">
                        <Link
                          href={`/myproject/${teamId}/${projectId}/${file.id}`}
                        >
                          <div>
                            <Folder width="100%" fill="#C7D2FE" />
                          </div>
                        </Link>
                        <div className="w-full absolute flex justify-between items-center left-0 bottom-0 p-3">
                          <div className="truncate text-base text-gray-900">
                            {file.name}
                          </div>
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
                              onClick={() => {
                                setOpenRenameFileModal(true);
                                setFileRenaming(file);
                              }}
                            >
                              <span className="mt-0.5 mr-2">
                                <RiEditLine size={16} />
                              </span>
                              <div className="font-normal">{t('Rename')}</div>
                            </a>
                            <a
                              className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-100 rounded cursor-pointer"
                              onClick={() => {
                                setShowDeleteFileModal(true);
                                setFileDeleting(file);
                              }}
                            >
                              <span className="mt-0.5 mr-2">
                                <RiDeleteBinLine size={16} />
                              </span>
                              <div className="font-normal">{t('Delete')}</div>
                            </a>
                          </Dropdown>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden">
                        <Link href={`/myproject/${teamId}/player/${file.id}`}>
                          <div
                            className="absolute w-full h-full rounded-t-lg rounded-b-xl overflow-hidden bg-black bg-no-repeat bg-center bg-cover"
                            style={{
                              backgroundImage: `url(${file.thumbnail})`,
                            }}
                          >
                            <span className="absolute right-0 top-0 p-2 text-white">
                              {file.type === 'youtube' && (
                                <FaYoutube size={24} />
                              )}
                              {file.type === 'file' && (
                                <>
                                  {file.assetType === 'video' && (
                                    <FaVideo size={24} />
                                  )}
                                  {file.assetType === 'image' && (
                                    <FaImage size={24} />
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </Link>
                        <div>
                          <_File width="100%" fill="#C7D2FE" />
                        </div>
                        <div className="w-full absolute flex justify-between items-center left-0 bottom-0 p-2 bg-indigo-200 rounded-b-lg">
                          <div className="truncate text-base text-gray-900">
                            {file.name}
                          </div>
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
                              onClick={() => {
                                setOpenRenameFileModal(true);
                                setFileRenaming(file);
                              }}
                            >
                              <span className="mt-0.5 mr-2">
                                <RiEditLine size={16} />
                              </span>
                              <div className="font-normal">{t('Rename')}</div>
                            </a>
                            <a
                              className="flex px-4 py-2 mx-1 text-sm text-gray-600 hover:text-red-600 hover:bg-red-100 rounded cursor-pointer"
                              onClick={() => {
                                setShowDeleteFileModal(true);
                                setFileDeleting(file);
                              }}
                            >
                              <span className="mt-0.5 mr-2">
                                <RiDeleteBinLine size={16} />
                              </span>
                              <div className="font-normal">{t('Delete')}</div>
                            </a>
                          </Dropdown>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-full">
                <div className="flex flex-col items-center">
                  <RiFolderUnknowFill color="#374151" size={40} />
                  <div className="text-gray-900">
                    {t("It's empty in here!")}
                  </div>
                  <div className="text-gray-400">
                    {t('Drop files and folders to begin.')}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {folderLoading && (
          <div className="flex justify-center items-center w-full h-full">
            <CgSpinner size={26} className="animate-spin" />
          </div>
        )}
      </main>

      <ConfirmModal
        open={showDeleteFileModal}
        closeModal={() => setShowDeleteFileModal(false)}
        title={`Delete the ${
          fileDeleting?.type === 'folder' ? 'Folder' : 'File'
        }?`}
        text={`Are you sure you want to delete "${fileDeleting?.name}"?`}
        // processing={deleting}
        confirmColor="red"
        confirmText="Delete"
        confirmAction={() => handleDeleteFile()}
      />
      <RenameFileModal
        file={fileRenaming}
        open={openRenameFileModal}
        requestClose={() => setOpenRenameFileModal(false)}
      />
    </SingleProjectLayout>
  );
};

export default withAuth(withTranslation()(Project));
