import Button from 'components/elements/Button';
import Modal from 'components/elements/Modal';
import TextInput from 'components/inputs/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from 'redux/slices/projectSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const schema = yup.object().shape({
  name: yup.string().required(),
});

const CreateProjectModal: React.FC<{
  open: boolean;
  requestClose: any;
  teamId: string;
}> = ({ open, requestClose, teamId }) => {
  const dispatch: any = useDispatch();
  const submitting = useSelector((state: any) => state.project.creating);

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    dispatch(createProject({ name: data.name, teamId: teamId }))
      .then(unwrapResult)
      .then((res) => requestClose());
  };

  return (
    <Modal open={open} requestClose={() => !submitting && requestClose()}>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-900 mb-8">New Project</div>
          <div className="mb-6">
            <Controller
              name="name"
              control={control}
              defaultValue=""
              render={(props) => (
                <TextInput
                  value={props.value}
                  placeholder="Enter project name"
                  onChange={(value) => props.onChange(value)}
                  error={errors.name}
                  autoFocus
                />
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              title="Create Project"
              isLoading={submitting}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreateProjectModal;
