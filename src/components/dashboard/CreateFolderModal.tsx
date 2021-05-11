import Button from 'components/elements/Button';
import Modal from 'components/elements/Modal';
import TextInput from 'components/inputs/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createFile } from 'redux/slices/fileSlice';
import { useRouter } from 'next/router';
import { unwrapResult } from '@reduxjs/toolkit';

const schema = yup.object().shape({
  name: yup.string().required(),
});

const CreateFolderModal: React.FC<{
  open: boolean;
  requestClose: any;
}> = ({ open, requestClose }) => {
  const router = useRouter();
  const teamId = router.query.teamId;
  const projectId = router.query.projectFolderIds[0];
  const folderId =
    typeof router.query.projectFolderIds[1] === 'undefined'
      ? ''
      : router.query.projectFolderIds[1];

  const dispatch: any = useDispatch();
  const currentFolder = useSelector((state: any) => state.file.currentFolder);
  const submitting = useSelector((state: any) => state.file.creating);

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    const path = currentFolder
      ? [
          ...currentFolder.path,
          {
            id: currentFolder.id,
            name: currentFolder.name,
          },
        ]
      : [];

    dispatch(
      createFile({
        type: 'folder',
        name: data.name,
        teamId,
        projectId,
        parentId: folderId,
        path,
      })
    )
      .then(unwrapResult)
      .then((res) => false);
    requestClose();
  };

  return (
    <Modal open={open} requestClose={() => requestClose()}>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-900 mb-8">New Folder</div>
          <div className="mb-6">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={(props) => (
                <TextInput
                  value={props.value}
                  onChange={(value) => props.onChange(value)}
                  error={errors.name}
                  autoFocus
                />
              )}
            />
          </div>
          <div className="flex justify-end">
            <div className="flex">
              <Button
                title="Cancel"
                type="button"
                className="mr-4"
                color="unset"
                onClick={() => requestClose()}
              />
              <Button type="submit" title="OK" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateFolderModal;
