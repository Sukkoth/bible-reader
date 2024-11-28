import { GET_TODAYS_PLANS } from '@/utils/supabase/services';
import { Context } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';
import { chunkArray, getBotUser, handleGetUserPlans } from '../(utils)/utils';

const miniAppUrl = process.env.MINI_APP_URL || '';

/**
 * Handles the /start command, which is the entry point of the bot.
 *
 * Depending on whether the user is registered or not, the bot will show different
 * options to the user. If the user is not registered, the bot will show a link button
 * to link their account. If the user is registered, the bot will show buttons to
 * access their plans, today's readings, and popular plans.
 *
 * @param {Context} ctx The context of the message
 * @returns {Promise<void>}
 */
export async function startCommandHandler(ctx: Context): Promise<void> {
  const options: InlineKeyboardButton[][] = [[]];

  const user = await getBotUser({ ctx, replayError: false });

  if (user) {
    options.push([
      {
        text: 'My Plans 📚',
        callback_data: 'myplans_callback',
      },
    ]);
    options.push([
      {
        text: `Today's Readings 📆`,
        callback_data: 'todays_plans_callback',
      },
    ]);
    options.push([
      {
        text: 'Popular Plans 📚',
        callback_data: 'popular_plans_callback',
      },
    ]);
  } else {
    options.push([
      {
        text: 'Link your account 👋',
        callback_data: 'link_callback',
      },
    ]);
  }

  await ctx.replyWithPhoto(`${miniAppUrl}/final-mini.png`, {
    caption:
      'Easily follow your daily Bible reading with Bible Reader, an app designed to help you stay on track with your reading goals and grow in faith.',
    reply_markup: {
      inline_keyboard: options,
    },
  });
}

/**
 * Handles the /myplans command
 * @param {Context} ctx - The context of the command
 * @returns {Promise<void>}
 */
export async function myplansCommandHandler(ctx: Context): Promise<void> {
  const user = await getBotUser({ ctx });
  if (!user) {
    return;
  }
  await handleGetUserPlans(ctx, user.user_id);
}

export async function todaysPlansCommandHandler(ctx: Context) {
  if (!ctx.chat) {
    console.log('No chat');
    return;
  }
  const waitMessage = await ctx.reply('Please wait . . . ⌛');
  const userData = await getBotUser({ ctx, replayError: true });
  if (userData === null) {
    return;
  }

  const data = await GET_TODAYS_PLANS(userData.user_id);
  await ctx.api.deleteMessage(ctx.chat.id, waitMessage.message_id);
  await ctx.reply('Your Todays Readings 📖', {
    reply_markup: {
      inline_keyboard: chunkArray(
        data.map((plan) => {
          return {
            text: plan.plans.name,
            callback_data: `plan-${plan.id}`,
          };
        }),
        1
      ),
    },
  });
}

export async function helpCommandHandler(ctx: Context) {
  await ctx.reply(
    `
  📖 *About the Bot:*  
  
  This bot helps you maintain a consistent Bible reading habit with features like reading plans and progress tracking. Learn more at [Bible Reader](https://thebiblereader.vercel.app).  
  
  🛠 *How to Use:*  
  1. *Link Account:*  
     - If you have an account on the [Bible Reader](https://thebiblereader.vercel.app) website, you can link it.  
     - Send message to the bot accordingly => 
      \`\`\` link your-email@example.com \`\`\` 
     - An OTP will be sent to your account on the website (check the drawer menu). Copy the OTP and send it back here. The bot will link your account.  
     - If your email doesn’t exist, register via the bot or website (see below).  
  
  2. *Register:*  
     Send message to the bot accordingly=>:  
     \`\`\`
  email: your-email@example.com
  password: your-password
  gender: male | female
  \`\`\`
  
  💡 *Commands:*  
  - \`/start\` - Start the bot  
  - \`/myplans\` - View all your plans  
  - \`/todays\` - View today's readings  
  - \`/help\` - Show this help message  
  
  contact @sukkoth for any feedback or suggestions!👋

  Happy reading! ✨  
    `,
    {
      parse_mode: 'Markdown',
    }
  );
}
