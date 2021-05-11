import ProjectLayout from 'components/dashboard/ProjectLayout/';
import { useSelector, useDispatch } from 'react-redux';
import withAuth from 'middlewares/withAuth';

const Projects: React.FC = () => {
  return (
    <ProjectLayout>
      <main className="hidden w-full mx-auto overflow-hidden rounded-lg sm:block">
        <div className="px-8 py-4" />
      </main>
    </ProjectLayout>
  );
};

export default withAuth(Projects);
