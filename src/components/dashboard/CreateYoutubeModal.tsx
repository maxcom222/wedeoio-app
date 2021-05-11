import Button from 'components/elements/Button';
import Modal from 'components/elements/Modal';
import TextInput from 'components/inputs/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { unwrapResult } from '@reduxjs/toolkit';
import { createFile } from 'redux/slices/fileSlice';

const schema = yup.object().shape({
  link: yup.string().required(),
});

const CreateYoutubeModal: React.FC<{
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
  const submitting = useSelector((state: any) => state.file.creating);

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    dispatch(
      createFile({
        type: 'youtube',
        assetType: 'video',
        link: data.link, // https://www.youtube.com/embed/GCjZzcpWPRM?feature=oembed
        teamId,
        projectId,
        parentId: folderId,
      })
    )
      .then(unwrapResult)
      .then(() => false);
    requestClose();
  };

  return (
    <Modal open={open} requestClose={() => requestClose()}>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-900 mb-8">Import Youtube Video</div>
          <div className="mb-6">
            <Controller
              name="link"
              control={control}
              defaultValue=""
              render={(props) => (
                <TextInput
                  value={props.value}
                  onChange={(value) => props.onChange(value)}
                  error={errors.link}
                  autoFocus
                  placeholder="Enter youtube video link"
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
              <Button type="submit" title="Add" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateYoutubeModal;
