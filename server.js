import { Telegraf } from 'telegraf'
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { createCanvas, loadImage } from 'canvas';
import dotenv from 'dotenv'

dotenv.config()

const telegramToken = process.env.TGBOT_TOKEN

// Replace with your actual bot token from @BotFather
const bot = new Telegraf(telegramToken);

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

// Command: /start
bot.start((ctx) => {
  const keyboard = [
    [{ text: 'View All Users' }],
    [{ text: 'Statistics' }]
  ];

  ctx.reply('Welcome to the Payment System Reporting Bot! Please choose an option below:', {
    reply_markup: {
      keyboard: keyboard,
      one_time_keyboard: true
    }
  });
});

// User clicks "View All Users" button
bot.hears('View All Users', (ctx) => {
  const userButtons = fakeUsers.map((user) => ({
    text: `${user.name}`,
    callback_data: `view_${user.id}`
  }));

  // Add the "Back" button to go back
  userButtons.push({
    text: 'Back',
    callback_data: 'back'
  });

  ctx.reply('Here are the available users you can view:', {
    reply_markup: {
      inline_keyboard: [userButtons]
    }
  });
});

// User clicks "Statistics" button
bot.hears('Statistics', async (ctx) => {
  const pieChartImage = await generatePieChart();
  ctx.replyWithPhoto({ source: pieChartImage });
});

// Callback query handler for selecting a user
bot.on('callback_query', (ctx) => {
  const data = ctx.callbackQuery.data;

  if (data === 'back') {
    ctx.answerCbQuery();
    ctx.reply('You can always click "View All Users" to view the users again.');
    return;
  }

  // Check if the callback data starts with "view_"
  if (data.startsWith('view_')) {
    const userId = data.split('_')[1];
    const selectedUser = fakeUsers.find(user => user.id === userId);

    if (selectedUser) {
      let userDetails = `User Details for ${selectedUser.name}:\n`;
      userDetails += `Balance: $${selectedUser.balance}\n`;
      userDetails += 'Transaction History:\n';

      selectedUser.transactions.forEach((transaction) => {
        userDetails += `${transaction.date} - $${transaction.amount} (${transaction.description})\n`;
      });

      ctx.answerCbQuery();
      ctx.reply(userDetails);
    } else {
      ctx.reply('User not found.');
    }
  }
});

// Helper function to calculate percentage
function calculatePercentage(balance) {
  const totalBalance = fakeUsers.reduce((sum, user) => sum + user.balance, 0);
  const percentage = ((balance / totalBalance) * 100).toFixed(2);
  return percentage;
}

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
