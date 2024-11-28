import { LoginSchema } from '@/lib/schemas/authSchema';
import { CompleteProfileSchemaType } from '@/lib/schemas/completeProfileSchema';
import { createClient } from '@/utils/supabase/server';
import { UPDATE_PROFILE } from '@/utils/supabase/services';
import { randomUUID } from 'crypto';
import { Context } from 'grammy';
import { z } from 'zod';
import { extractCredentials, getBotUser } from '../(utils)/utils';

/**
 * Main message handler for the Telegram bot that processes different types of user messages.
 * Handles three types of messages:
 * 1. OTP verification messages (starts with 'OTP')
 * 2. Email registration messages (starts with 'email')
 * 3. Account linking messages (contains 'link' and an email address)
 *
 * @param {Context} ctx - The Telegram bot context containing message and user information
 * @returns {Promise<void>} Resolves when the message has been processed
 *
 * @example
 * // OTP verification
 * // User sends: OTP 123456
 * await onMessageHandler(ctx);
 *
 * // Email registration
 * // User sends: email user@example.com
 * await onMessageHandler(ctx);
 *
 * // Account linking
 * // User sends: link user@example.com
 * await onMessageHandler(ctx);
 */
export async function onMessageHandler(ctx: Context) {
  const messageText = ctx?.message?.text;
  if (!messageText) {
    console.log('No message text');
    return;
  }

  if (messageText.startsWith('OTP')) {
    await handleOTP(ctx, messageText);
  } else if (messageText.trim().startsWith('email')) {
    await handleRegistration(ctx, messageText);
  } else if (messageText.replace('link', '').trim().includes('@')) {
    await handleAccountLinking(ctx);
  }
}

type OTP = {
  created_at: Date;
  expires_at: number;
  email: string;
  telegram_id: string;
  id: number;
  otp: string;
};

/**
 * Handles the OTP message sent by the user
 * @param {Context} ctx - The context of the message
 * @param {string} otpText - The OTP message text
 * @returns {Promise<void>}
 */
/**
 * Flow:
 * 1. Check if the user has an OTP request
 * 2. Check if the OTP is expired
 * 3. Check if the OTP is correct
 * 4. If the OTP is correct, delete the OTP request and add the telegram_id to the profile
 * 5. Send a success message to the user
 * 6. If the OTP is incorrect, send an error message to the user
 * 7. If there is an error, send an error message to the user
 * @throws {Error} If there is an error
 */

async function handleOTP(ctx: Context, otpText: string) {
  if (!ctx.chat) return;
  const waitMessage = await ctx.reply('Please wait . . . ⌛');
  const supabase = createClient();
  const { data, error } = await supabase
    .from('otp_requests')
    .select('*')
    .eq('telegram_id', ctx.from?.id.toString());

  if (error || !data.length) {
    await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
    await ctx.reply('⚠️ No OTP requests issued!');
    return;
  }

  const otpData = data[0] as OTP;

  if (otpData.expires_at < new Date().getTime()) {
    await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
    ctx.reply(`Your OTP token has expired, please try again with a new one.`);
    return;
  }

  if (otpData.otp === otpText.replace('OTP', '')) {
    const { error } = await supabase
      .from('otp_requests')
      .delete()
      .eq('telegram_id', ctx.from?.id.toString());

    if (error) {
      await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
      await ctx.reply('⚠️ Something went wrong, Try again');
    } else {
      const addTelegramIdToProfile = await supabase
        .from('profiles')
        .update({ telegram_id: ctx.from?.id.toString() })
        .eq('email', otpData.email);
      if (addTelegramIdToProfile.error) {
        await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
        await ctx.reply('⚠️ Something went wrong, Try again');
        return;
      }
      await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
      await ctx.reply(
        '✅ You have successfully verified your account. use /start to get started with your options.'
      );
    }
  } else {
    await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
    ctx.reply(`Wrong OTP`);
  }
}

/**
 * Handles the registration message sent by the user
 * @param {Context} ctx - The context of the message
 * @param {string} messageText - The registration message text
 * @returns {Promise<void>}
 */
/**
 * Flow:
 * 1. Check if the user is already registered
 * 2. Extract the email, password and gender from the message text
 * 3. Validate the email and password using zod
 * 4. If the validation fails, reply with an error message
 * 5. Signup the user using supabase's signUp method
 * 6. If the signup fails, reply with an error message
 * 7. Create a profile for the user using the email, telegram_id, first_name, last_name and gender
 * 8. Reply with a welcome message and a button to browse popular plans
 * 9. If there is an error, reply with an error message
 * @throws {Error} If there is an error
 */
async function handleRegistration(ctx: Context, messageText: string) {
  if (!ctx.from) {
    console.error('No chat found to handle callback');
    return;
  }
  const user = await getBotUser({ ctx, replayError: false });
  if (user) {
    console.log('There is user, do not replay', user);
    await ctx.reply('You are already registered! 😎 ');
    return;
  }
  const { email, password, gender } = extractCredentials(messageText.trim());
  if (!email || !password || !gender || !['male', 'female'].includes(gender.toLowerCase().trim())) {
    await ctx.reply('❌ Do not forget to provide all fields');
    return;
  }

  const validated = LoginSchema.safeParse({ email, password });

  if (validated.error) {
    const { email: emailError, password: passwordError } = validated.error.flatten().fieldErrors;
    await ctx.reply(
      `
             ** Validation error
             * ${emailError || ''}
             * ${passwordError || ''}
            `,
      {
        parse_mode: 'Markdown',
      }
    );

    return;
  }

  const supabase = createClient();

  const { error, data } = await supabase.auth.signUp({ email, password });

  if (error || !data?.user) {
    console.log(' ⚠️Could not signup, try again', data.user?.id, error);
    await ctx.reply(`⚠️ ${error?.message}` || '⚠️ Something went wrong');
    return;
  }

  const fullUserInfo: CompleteProfileSchemaType = {
    email,
    telegram_id: ctx.from.id.toString(),
    firstName: ctx.from.first_name,
    lastName: ctx.from.last_name || '',
    gender: gender.toLowerCase().trim(),
  };

  try {
    const profile = (await UPDATE_PROFILE(fullUserInfo, data.user.id, undefined)) as Profile;

    await ctx.reply(
      `
          **Profile Info
          * Name: ${profile.first_name} ${profile?.last_name || ''}
          * Email: ${profile.email}
          * Gender: ${profile.gender}
          * ======================
          ** WELCOME TO BIBLE READER 🎉 
          `,
      {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Browse popular plans 📚',
                callback_data: 'popular_plans_callback',
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.log('Error creating user', user, error);
    await ctx.reply('⚠️ Something went wrong, try again');
  }
}

/**
 * Handles the process of linking a Telegram account with a Bible Reader web account.
 * The function performs the following steps:
 * 1. Validates the email provided in the message
 * 2. Checks if the user is already verified
 * 3. Verifies the email exists in the system
 * 4. Generates and stores a new OTP
 * 5. Sends instructions to the user for OTP verification
 *
 * @param {Context} ctx - The Telegram bot context containing message and user information
 * @throws {Error} When there are issues with OTP generation or database operations
 * @returns {Promise<void>} Resolves when the account linking process is complete
 *
 * @example
 * // User sends: link example@email.com
 * await handleAccountLinking(ctx);
 */
async function handleAccountLinking(ctx: Context): Promise<void> {
  const email = ctx.message!.text!.split(' ')?.[1];

  if (!email) {
    await ctx.reply(
      'Please provide a valid email that you used to register to Bible Reader website'
    );
    return;
  }
  const validation = z.string().email().safeParse(email);

  if (!validation.success) {
    await ctx.reply(
      'Please provide a valid email that you used to register to Bible Reader website'
    );
    return;
  }

  const user = await getBotUser({ ctx, replayError: false });
  if (user) {
    await ctx.reply('You have already verified your telegram account! 😎 ');
    return;
  }

  const supabase = createClient();
  const getUser = await supabase.from('profiles').select('*').eq('email', validation.data).single();

  if (getUser.error) {
    console.error('could not get user from profile', getUser.error);
    await ctx.reply('⚠️⚠️⚠️ Email not found, try registering', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Register 👋',
              callback_data: 'register_callback',
            },
          ],
        ],
      },
    });
    return;
  }

  //delete previous OTPs
  await supabase.from('otp_requests').delete().eq('telegram_id', ctx.from?.id.toString());

  const sendOtp = await supabase.from('otp_requests').insert({
    email: validation.data,
    otp: randomUUID(),
    //expire the OTP after 10 minutes
    expires_at: new Date().getTime() + 1000 * 60 * 10,
    telegram_id: ctx.from?.id.toString(),
  });

  if (sendOtp.error) {
    await ctx.reply('Could not send OTP to your account, try again');
  }

  await ctx.reply(
    `OTP sent to your <a href="${process.env.NEXT_APP_URL}/home">Bible Reader web account</a>. Please copy and paste it here.`,
    {
      parse_mode: 'HTML',
    }
  );
}
