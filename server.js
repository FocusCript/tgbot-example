import { Telegraf } from 'telegraf'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { createCanvas, loadImage } from 'canvas';
import dotenv from 'dotenv'

const commandsHearing = {
  'View_All_Users': '🚶🏻 View All Users',
  'Statistics': '📊 Statistics',
  'About': 'ℹ️ About',
  'Settings': '⚙️ Settings',
  'Language': '🌎 Language',
  'Notification_Period': '🛎 Notification period',
  'Backup_Longivity': '📝 Backup longivity',
  'Back': '⬅️ Back',
  'Uzbek': `🇺🇿 O'zbek`,
  'Russian': '🇷🇺 Русский',
  'English': '🇺🇸 English',
  'Back_to_Settings': '⬅️ Back to Settings'
}

dotenv.config()

console.log('Starting point----')

const telegramToken = process.env.TGBOT_TOKEN

// Replace with your actual bot token from @BotFather
const bot = new Telegraf(telegramToken);

console.log('TG Token excuted----')

// Fake users data
const fakeUsers = [
  {
    id: 'user123', name: 'John Doe', balance: 5000, transactions: [
      { date: '2025-02-01', amount: -100, description: 'Payment for service A' },
      { date: '2025-02-03', amount: 200, description: 'Payment from Client B' }
    ]
  },
  {
    id: 'user456', name: 'Mr Shakh', balance: 3500, transactions: [
      { date: '2025-02-02', amount: -50, description: 'Payment for service C' },
      { date: '2025-02-04', amount: 150, description: 'Payment from Client D' }
    ]
  },
  {
    id: 'user789', name: 'Alice Brown', balance: 7500, transactions: [
      { date: '2025-02-01', amount: -300, description: 'Payment for service X' },
      { date: '2025-02-03', amount: 500, description: 'Payment from Client Y' }
    ]
  }
];

const goToMainMenu = (ctx) => {
  const keyboard = [
    [{ text: commandsHearing.View_All_Users }],
    [{ text: commandsHearing.Statistics }],
    [{ text: commandsHearing.About }],
    [{ text: commandsHearing.Settings }],
  ];

  ctx.reply('Welcome to the Payment System Reporting Bot! Please choose an option below:', {
    reply_markup: {
      keyboard: keyboard,
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
}

const goToSettings = (ctx) => {
  const userButtons = [
    [{
      text: commandsHearing.Language,
    }],
    [{
      text: commandsHearing.Notification_Period,
    }],
    [{
      text: commandsHearing.Backup_Longivity,
    }],
    [{
      text: commandsHearing.Back,
      callback_data: 'back'
    }]
  ]

  ctx.reply('Settings', {
    reply_markup: {
      keyboard: userButtons,
      one_time_keyboard: true,
      resize_keyboard: true
    }
  });
}

// Command: /start
bot.start((ctx) => {
  console.log(ctx?.message?.chat?.username, 'USER connected')
  goToMainMenu(ctx)
});

// User clicks "View All Users" button
bot.hears(commandsHearing.View_All_Users, (ctx) => {
  const userButtons = fakeUsers.map((user) => ([{
    text: `${user.name}`,
    callback_data: `view_${user.id}`
  }]));

  // Add the "Back" button to go back
  userButtons.push([{
    text: commandsHearing.Back,
    callback_data: 'back'
  }]);

  ctx.reply('Here are the available users you can view:', {
    reply_markup: {
      inline_keyboard: userButtons
    }
  });
});

// User clicks "Leave message to support" button
bot.hears(commandsHearing.Settings, async (ctx) => {
  goToSettings(ctx)
});

bot.hears(commandsHearing.Backup_Longivity, async (ctx) => {
  const userButtons = [30, 90, 180].map((period) => ([{
    text: `${period} days `,
    callback_data: `backup_${period}`
  }]));

  // Add the "Back" button to go back
  userButtons.push([{
    text: commandsHearing.Back,
    callback_data: 'back'
  }]);

  ctx.reply('You can choose one of the options from this list:', {
    reply_markup: {
      inline_keyboard: userButtons
    }
  });
})

bot.hears(commandsHearing.Notification_Period, async (ctx) => {
  const userButtons = [1, 2, 24, 48].map((period) => ([{
    text: `${period} hours `,
    callback_data: `notificationPeriod_${period}`
  }]));

  // Add the "Back" button to go back
  userButtons.push([{
    text: commandsHearing.Back,
    callback_data: 'back'
  }]);

  ctx.reply('You can choose one of the options from this list:', {
    reply_markup: {
      inline_keyboard: userButtons
    }
  });
})

// User clicks "Leave message to support" button
bot.hears(commandsHearing.Language, async (ctx) => {
  const userButtons = [
    [
      {
        text: commandsHearing.Uzbek,
      },
      {
        text: commandsHearing.Russian,
      },
      {
        text: commandsHearing.English,
      }
    ],
    [
      {
        text: commandsHearing.Back_to_Settings,
      }
    ]
  ]

  ctx.reply('Settings', {
    reply_markup: {
      keyboard: userButtons,
      one_time_keyboard: true,
      resize_keyboard: true,
      selective: true
    }
  });
});

bot.hears(commandsHearing.Uzbek, async (ctx) => {
  const htmlContent = ` <b>🌟 This feature coming soon! 🌟</b>`
  ctx.reply(htmlContent, { parse_mode: 'HTML' });
  goToSettings(ctx)
})
bot.hears(commandsHearing.Russian, async (ctx) => {
  const htmlContent = ` <b>🌟 This feature coming soon! 🌟</b>`
  ctx.reply(htmlContent, { parse_mode: 'HTML' });
  goToSettings(ctx)
})
bot.hears(commandsHearing.English, async (ctx) => {
  const htmlContent = ` <b>🌟 This feature coming soon! 🌟</b>`
  ctx.reply(htmlContent, { parse_mode: 'HTML' });
  goToSettings(ctx)
})

// User clicks "Statistics" button
bot.hears(commandsHearing.Statistics, async (ctx) => {
  const pieChartImage = await generatePieChart();
  ctx.replyWithPhoto({ source: pieChartImage });
});

bot.hears(commandsHearing.Back, async (ctx) => {
  goToMainMenu(ctx)
});

bot.hears(commandsHearing.Back_to_Settings, async (ctx) => {
  goToSettings(ctx)
});

bot.hears(commandsHearing.About, async (ctx) => {
  const htmlContent = `
    <b>🌟 Welcome to Our Telegram Bot! 🌟</b>

    <i>Thank you for choosing our services. Here is a little information about us:</i>

    <b>👥 Who We Are</b>
    We are a <b>creative team</b> of developers, designers, and technology experts who are passionate about building innovative bots, apps, and automating processes to help businesses grow. 🚀
    <i>Our mission</i> is to bring technology closer to people and help companies achieve their digital transformation goals. 💡

    <b>🛠️ Our Services</b>
    <b>1. Custom Telegram Bot Development:</b> We specialize in building intelligent bots tailored to your business needs. 🤖
    <b>2. Automation Solutions:</b> Automating workflows and processes to save you time and effort. ⏳
    <b>3. Web and App Development:</b> Full-stack development for websites and applications. 🌐
    <b>4. Technical Support:</b> Providing reliable support to ensure your business stays running smoothly. 📞

    <b>📬 Contact Us</b>
    If you have any questions or would like to discuss how we can help your business, feel free to reach out! 💬

    <b>🌍 Follow Us on Social Media</b>
    Stay connected and get updates on our latest offerings
    <i>We look forward to working with you! 🙌</i>
  `;

  ctx.reply(htmlContent, { parse_mode: 'HTML' });
});

// Callback query handler for selecting a user
bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === 'back') {
    goToMainMenu(ctx)
    return;
  }

  // Check if the callback data starts with "view_"
  if (data.startsWith('view_')) {
    const userId = data.split('_')[1];
    const selectedUser = fakeUsers.find(user => user.id === userId);

    if (selectedUser) {
      let userDetails = `📒 User Details for ${selectedUser.name}:\n`;
      userDetails += `💰 Balance: 💲${selectedUser.balance}\n`;
      userDetails += '🗳 Transaction History:\n';

      selectedUser.transactions.forEach((transaction) => {
        userDetails += `⏳${transaction.date} ▶️ $${transaction.amount} (${transaction.description})\n`;
      });

      ctx.answerCbQuery();
      ctx.reply(userDetails);
    } else {
      ctx.reply('User not found.');
    }
  }

  if (data.startsWith('backup_')) {
    const period = data.split('_')[1];
    ctx.answerCbQuery();

    const htmlContent = `
    <b> The backup is configured for up to ⏳ ${period} days </b>
    <i>Please do not forget to check and update your data so as not to lose important information 📜</i>
  `;
    ctx.reply(htmlContent, { parse_mode: 'HTML' });
  }

  if (data.startsWith('notificationPeriod_')) {
    const period = data.split('_')[1];
    ctx.answerCbQuery();

    const htmlContent = `
    <b> The notification is configured for up to ⏳ ${period} hours </b>
    <i>You will get notification message every ${period} hours 📜</i>
  `;
    ctx.reply(htmlContent, { parse_mode: 'HTML' });
  }
});

// Generate pie chart image using chartjs-node-canvas with manually added percentage labels
async function generatePieChart() {
  const width = 400; // Width of the chart
  const height = 400; // Height of the chart

  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  // Create the data for the pie chart (e.g., user balances distribution)
  const balances = fakeUsers.map(user => user.balance);
  const labels = fakeUsers.map(user => user.name);

  const chartData = {
    labels: labels,
    datasets: [{
      data: balances,
      backgroundColor: ['#FF5733', '#33FF57', '#3357FF'],
      borderColor: '#000000',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  const configuration = {
    type: 'pie',
    data: chartData,
    options: chartOptions
  };

  // Generate the chart as a buffer
  const imageBuffer = await chartJSNodeCanvas.renderToBuffer(configuration);

  // Now let's add the percentages manually to the image
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw the original pie chart on our new canvas
  const image = await loadImage(imageBuffer);
  ctx.drawImage(image, 0, 0);

  // Calculate percentages and positions for each label
  const total = balances.reduce((sum, value) => sum + value, 0);
  let startAngle = 0;

  fakeUsers.forEach((user, index) => {
    const percentage = ((balances[index] / total) * 100).toFixed(2); // Calculate percentage for each slice
    const sliceAngle = (Math.PI * 2 * (balances[index] / total));

    // Calculate the label's position near the slice (the middle of each slice)
    const middleAngle = startAngle + sliceAngle / 2;
    const labelRadius = 100;  // Adjust this to place text outside the pie
    const x = width / 2 + labelRadius * Math.cos(middleAngle);
    const y = height / 2 + labelRadius * Math.sin(middleAngle);

    // Draw the name and percentage label near the slice
    ctx.font = 'bold 12px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`${percentage}%`, x, y);

    // Update the start angle for the next slice
    startAngle += sliceAngle;
  });

  // Return the image with percentages added
  return canvas.toBuffer();
}

// Start the bot
bot.launch()
console.log('Telegram bot is running...')

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
