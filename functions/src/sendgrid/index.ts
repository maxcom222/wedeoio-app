import * as functions from 'firebase-functions';
import regionalFunctions from '../regionalFunctions';
import { welcomeTemplateId, teamInviteTemplateId, sgMail, db } from '../config';

export const sendWelcomeEmail: any = (user) => {
  const emailTemplate = {
    from: 'support@wedeo.io',
    to: user.email,
    templateId: welcomeTemplateId,
    dynamic_template_data: {
      product_url: 'https://app.wedeo.io/',
      product_name: 'Wedeo',
      name: user.name,
      action_url: 'https://app.wedeo.io/account/billing',
      support_email: 'support@wedeo.io',
      sender_name: 'Wedeo',
      help_url: 'https://app.wedeo.io/',
      company_name: 'Wedeo',
      company_address: '',
      login_url: 'https://app.wedeo.io/login',
    },
  };

  return sgMail.send(emailTemplate).catch((e) => console.log(e));
};

export const sendTeamInviteEmail = regionalFunctions.https.onCall(
  async (data, context) => {
    if (!context?.auth?.token?.email) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Must be logged with an email address'
      );
    }

    const invite_receiver = await (
      await db.collection('users').where('email', '==', data.emailTo).get()
    ).docs;
    const invite_receiver_name =
      invite_receiver.length > 0 ? invite_receiver[0].data().name : '';

    const emailTemplate = {
      from: 'support@wedeo.io',
      to: data.emailTo,
      templateId: teamInviteTemplateId,
      dynamic_template_data: {
        product_url: 'https://app.wedeo.io',
        product_name: 'Wedeo',
        name: invite_receiver_name,
        invite_sender_name: data.teamOwnerName,
        invite_sender_organization_name: data.teamName,
        action_url: `https://app.wedeo.io/join?teamId=${data.teamId}&token=${data.token}`,
        support_email: 'support@wedeo.io',
        live_chat_url: 'https://app.wedeo.io/',
        help_url: 'support.wedeo.io',
        company_name: 'Wedeo',
        company_address: 'Wedeo',
      },
    };

    try {
      await sgMail.send(emailTemplate);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }

      return { success: false };
    }

    return { success: true };
  }
);
