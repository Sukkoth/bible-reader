import { Bot, webhookCallback } from 'grammy';
import * as CallBackHandlers from './(handlers)/callbacks';
import * as CommandHandlers from './(handlers)/commands';
import * as MessageHandlers from './(handlers)/messages';
import { handleAnswerCallBack } from './(utils)/utils';

export const dynamic = 'force-dynamic';
export const maxDuration = 55;
export const fetchCache = 'force-no-store';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) throw new Error('TELEGRAM_BOT_TOKEN environment variable not found.');

const bot = new Bot(token);
console.log('Bot started');

bot.command('start', async (ctx) => {
  await CommandHandlers.startCommandHandler(ctx);
});

bot.callbackQuery('myplans_callback', async (ctx) => {
  await CallBackHandlers.myPlansCallback(ctx);
});

bot.command('myplans', async (ctx) => {
  await CallBackHandlers.myPlansCallback(ctx);
});

bot.callbackQuery('register_callback', async (ctx) => {
  await CallBackHandlers.registrationCallback(ctx);
});

bot.callbackQuery('popular_plans_callback', async (ctx) => {
  await CallBackHandlers.popularPlansCallback(ctx);
});

bot.command('todays', async (ctx) => {
  await CommandHandlers.todaysPlansCommandHandler(ctx);
});
bot.command('help', async (ctx) => {
  await CommandHandlers.helpCommandHandler(ctx);
});

bot.callbackQuery('todays_plans_callback', async (ctx) => {
  //do the same thing as when the user uses /todays command
  await CommandHandlers.todaysPlansCommandHandler(ctx);
  await handleAnswerCallBack(ctx);
});

bot.callbackQuery('link_callback', async (ctx) => {
  //send this message
  //please send link example@email.com to link your account
  await ctx.reply(`Please provide a valid email that you used to register to Bible Reader website. Use this format to send your email. 

    link youremail@email.com

    `);

  await handleAnswerCallBack(ctx);
  return;
});

bot.on('callback_query', async (ctx) => {
  await CallBackHandlers.dynamicCallBacks(ctx);
});

bot.on('message:text', async (ctx) => {
  await MessageHandlers.onMessageHandler(ctx);
});

export const POST = webhookCallback(bot, 'std/http');
