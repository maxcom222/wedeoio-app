import Button from 'components/elements/Button';
import Modal from 'components/elements/Modal';
import TextInput from 'components/inputs/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { renameFile } from 'redux/slices/fileSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const schema = yup.object().shape({
  name: yup.string().required(),
});

const RenameFileModal: React.FC<RenameFileModalType> = ({
  file,
  open,
  requestClose,
}) => {
  const dispatch: any = useDispatch();
  const submitting = useSelector((state: any) => state.file.renaming);

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    dispatch(renameFile({ id: file.id, data }))
      .then(unwrapResult)
      .then(() => false);
    requestClose();
  };

  return (
    <Modal open={open} requestClose={() => requestClose()}>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-900 mb-8">
            Rename {file?.type === 'folder' ? 'Folder' : 'File'}
          </div>
          <div className="mb-6">
            <Controller
              name="name"
              control={control}
              defaultValue={file?.name}
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

type RenameFileModalType = {
  file: any;
  open: boolean;
  requestClose: any;
};

export default RenameFileModal;
