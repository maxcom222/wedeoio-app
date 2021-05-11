import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/router';
import RandomString from 'randomstring';

import { functions } from 'config/firebase';

import withAuth from 'middlewares/withAuth';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from 'redux/slices/toastSlice';

import {
  fetchTeam,
  updateTeam,
  createTeamMember,
  deleteTeamMember,
} from 'redux/slices/teamSlice';
import Layout from 'components/dashboard/Layout';
import AccountMenu from 'components/dashboard/AccountMenu';
import Button from 'components/elements/Button';
import ConfirmModal from 'components/dashboard/ConfirmModal';
import { CgSpinner } from 'react-icons/cg';
import TextInput from 'components/inputs/TextInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

const Team: React.FC = () => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const teamId = router.query.teamId;
  const user = useSelector((state: any) => state.auth.user);
  const team = useSelector((state: any) => state.team.data);
  const [formOpen, setFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResendInvite, setHasResendInvite] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberDeleting, setMemberDeleting] = useState(null);
  const { control, errors, setError, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    dispatch(fetchTeam(teamId));
  }, []);

  const onSubmit = async (data) => {
    if (team.users.findIndex((user) => user.email === data.email) !== -1) {
      // validate if existing member
      setError('email', {
        type: 'manual',
        message: "The email address is already your team member's",
      });
      return;
    }

    setIsLoading(true);

    const payload = {
      status: 'invited',
      invitedAt: Date.now(),
      role: 'member',
      token: RandomString.generate(60),
      ...data,
    };

    await dispatch(createTeamMember({ teamId: team.id, data: payload }));

    setFormOpen(false);
    setIsLoading(false);

    const sendTeamInviteEmail = functions.httpsCallable('sendTeamInviteEmail');

    await sendTeamInviteEmail({
      emailTo: data.email,
      token: payload.token,
      teamName: team.name,
      teamId: team.id,
      teamOwnerName: user.name,
    });

    await dispatch(
      addToast({
        title: 'Invite is sent ✉️',
        description: `An invitation email has been sent to ${data.email}`,
        type: 'success',
      })
    );
  };

  const resendInvite = async (data) => {
    setIsLoading(data.email);

    const payload = {
      ...data,
      invitedAt: Date.now(),
      token: RandomString.generate(60),
    };

    const updatedTeam: any = { ...team, users: [...team.users] };
    const updatedTeamMemberIndex = updatedTeam.users.findIndex(
      (member) => member.email === data.email
    );
    updatedTeam.users[updatedTeamMemberIndex] = payload;

    await dispatch(updateTeam({ id: team.id, data: updatedTeam }));

    setFormOpen(false);
    setIsLoading(false);

    const sendTeamInviteEmail = functions.httpsCallable('sendTeamInviteEmail');

    await sendTeamInviteEmail({
      emailTo: data.email,
      token: payload.token,
      teamName: team.name,
      teamId: team.id,
      teamOwnerName: user.name,
    });

    setHasResendInvite(data.email);
    setFormOpen(false);

    setIsLoading(false);

    await dispatch(
      addToast({
        title: 'Invite is sent ✉️',
        description: `Once again, an invitation email has been sent to ${data.email}.`,
        type: 'success',
      })
    );
  };

  const deleteMember = async (member) => {
    setIsLoading(true);
    await dispatch(deleteTeamMember({ teamId: team.id, member }));
    setIsLoading(false);
    setShowConfirmModal(false);
    await dispatch(
      addToast({
        title: 'Member deleted',
        description: `The team member is successfully removed from the team`,
        type: 'success',
      })
    );
  };

  return (
    <Layout>
      <div className="px-4 py-10 pb-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <header className="pb-4 pl-3 mb-6 border-b-2 border-gray-300 sm:py-6">
          <div className="mt-2 md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-800 sm:text-3xl sm:leading-9 sm:truncate">
                {team?.name || 'Team'}
              </h2>
            </div>
          </div>
        </header>
        <div className="flex">
          <div className="w-full sm:w-1/3 sm:pr-16">
            <AccountMenu />
          </div>
          <main className="hidden w-2/3 mx-auto sm:block">
            {!team && (
              <CgSpinner size={30} className="m-auto mt-6 animate-spin" />
            )}
            {team && (
              <div>
                <div className="px-4 py-5 pt-5 mt-10 overflow-hidden bg-white rounded-lg shadow-lg sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Team Info
                  </h3>
                  <div className="pt-3 my-6 border-t border-gray-200 sm:flex sm:items-start sm:justify-between ">
                    <div className="text-sm leading-5 text-gray-500">
                      <p>{`Team name: ${team.name || ''}`}</p>
                      <p>{`Team ID: ${team.id}`}</p>
                      <p>{`Team Slug: ${team.slug}`}</p>
                      <p>{`Team Member Count: ${team.users.length}`}</p>
                    </div>
                  </div>
                  <div className="pt-5 border-t border-gray-200">
                    <div className="flex justify-end">
                      <span className="rounded-md shadow-sm">
                        <Link href={`/account/teams/${team.id}/edit`}>
                          <a href="">
                            <Button title="Edit" />
                          </a>
                        </Link>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-5 pt-5 mt-10 overflow-hidden bg-white rounded-lg shadow-lg sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Team members
                  </h3>
                  <ul className="mt-5">
                    {team?.users.map((member, i) => {
                      return (
                        <li className="border-t border-gray-200" key={i}>
                          <div className="flex items-center justify-between w-full py-6">
                            <div className="flex-1 truncate">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-sm font-medium leading-5 text-gray-900 truncate">
                                  {member.email}
                                </h3>
                                <span className="flex-shrink-0 inline-block px-2 py-0.5 text-teal-800 text-xs leading-4 font-medium bg-teal-100 rounded-full capitalize">
                                  {member.role}
                                </span>
                              </div>
                              <p className="mt-1 text-sm leading-5 text-gray-500 truncate">
                                {member.status === 'active'
                                  ? `Joined on ${new Date(
                                      member.joinedAt
                                    ).toLocaleDateString()}`
                                  : `Invited on ${new Date(
                                      member.invitedAt
                                    ).toLocaleDateString()}`}
                              </p>
                            </div>
                            <div className="flex">
                              {member.status !== 'active' &&
                              user.uid === team.ownerId ? (
                                <Button
                                  color="unset"
                                  isLoading={isLoading === member.email}
                                  onClick={() => resendInvite(member)}
                                  title={
                                    (hasResendInvite === member.email &&
                                      'Invite is resent') ||
                                    'Resend invite'
                                  }
                                />
                              ) : (
                                <span className="inline-flex justify-center w-full px-4 py-2 mr-3 text-base font-medium leading-6 text-gray-700 bg-white sm:text-sm sm:leading-5">
                                  {member.status == 'active'
                                    ? 'Active'
                                    : 'Invited'}
                                </span>
                              )}
                              {member.role !== 'owner' &&
                                user.uid === team.ownerId && (
                                  <Button
                                    title="Delete"
                                    color="red"
                                    className="ml-2"
                                    onClick={() => {
                                      setShowConfirmModal(true);
                                      setMemberDeleting(member);
                                    }}
                                  />
                                )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="pt-5 border-t border-gray-200">
                    {user.uid === team.ownerId && !formOpen && (
                      <div className="flex justify-end">
                        <span className="rounded-md shadow-sm">
                          <Button
                            title="Invite a member"
                            onClick={() => setFormOpen(true)}
                          />
                        </span>
                      </div>
                    )}
                    {formOpen && (
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex justify-end">
                          <div className="w-full mr-3 rounded-md">
                            <Controller
                              name="email"
                              control={control}
                              render={(props) => (
                                <TextInput
                                  value={props.value}
                                  type="email"
                                  placeholder="Enter an email address"
                                  onChange={(value) => props.onChange(value)}
                                  error={errors.email}
                                  autoFocus
                                />
                              )}
                            />
                          </div>

                          <div>
                            <Button
                              type="submit"
                              title="Send"
                              isLoading={isLoading}
                            />
                          </div>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <ConfirmModal
        open={showConfirmModal}
        closeModal={() => setShowConfirmModal(false)}
        title={'Are you sure?'}
        text={
          "The team member will be deleted from your team. This user will lose all access to your team's resources. If there is still a pending invitation it will no longer be valid."
        }
        confirmColor="red"
        confirmText="Delete member"
        confirmAction={() => deleteMember(memberDeleting)}
        processing={isLoading}
      />
    </Layout>
  );
};

export default withAuth(Team);
