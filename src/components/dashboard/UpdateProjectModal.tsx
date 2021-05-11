import Button from 'components/elements/Button';
import Modal from 'components/elements/Modal';
import TextInput from 'components/inputs/TextInput';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { updateProject } from 'redux/slices/projectSlice';
import { unwrapResult } from '@reduxjs/toolkit';

const schema = yup.object().shape({
  name: yup.string().required(),
});

const UpdateProjectModal: React.FC<{
  open: boolean;
  requestClose: any;
  project: any;
}> = ({ open, requestClose, project }) => {
  const dispatch: any = useDispatch();
  const submitting = useSelector((state: any) => state.project.updating);

  const { handleSubmit, control, errors } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    dispatch(updateProject({ ...project, name: data.name }))
      .then(unwrapResult)
      .then((res) => requestClose());
  };

  return (
    <Modal open={open} requestClose={() => !submitting && requestClose()}>
      <div className="p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-gray-900 mb-8">Edit Project</div>
          <div className="mb-6">
            <Controller
              name="name"
              control={control}
              defaultValue={project?.name}
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
              title="Save Settings"
              isLoading={submitting}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateProjectModal;
