"""
RiftMarket Discord Bot - Persistent Gateway Bot
Handles:
- Welcome DM on member join (with pending order lookup)
- Order lookup commands
- DM users when their order is created (if Discord ID is known)
"""
import discord
import os
import asyncio
import logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("rift-bot")

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = discord.Client(intents=intents)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')
mongo_client = AsyncIOMotorClient(mongo_url)
db = mongo_client[db_name]

GUILD_ID = int(os.environ.get("DISCORD_GUILD_ID", "0"))


@bot.event
async def on_ready():
    logger.info(f"RIFT Bot connected as {bot.user} (ID: {bot.user.id})")
    logger.info(f"Watching guild: {GUILD_ID}")


@bot.event
async def on_member_join(member):
    """When a new member joins, check if they have a pending order and DM them."""
    if member.bot:
        return
    
    logger.info(f"New member joined: {member.name} ({member.id})")
    
    # Check if this Discord user has a pending order (by discord_user_id)
    order = await db.orders.find_one(
        {"discord_user_id": str(member.id), "status": {"$in": ["pending", "paid"]}},
        {"_id": 0}
    )
    
    try:
        if order:
            # They have a pending order - send them their order details
            items_text = "\n".join([
                f"- **{item['product_name']}** x{item['quantity']}"
                for item in order.get("items", [])
            ])
            
            embed = discord.Embed(
                title=f"Your order ticket has been created!",
                color=0xFFE800,
            )
            embed.add_field(name="Order ID", value=order["order_number"], inline=True)
            embed.add_field(name="Roblox Username", value=order.get("roblox_username", "N/A"), inline=True)
            embed.add_field(name="Total", value=f"${order['total_amount']:.2f}", inline=True)
            embed.add_field(name="Items", value=items_text or "None", inline=False)
            
            ticket_url = order.get("discord_channel_url", "")
            if ticket_url:
                embed.add_field(name="Your Ticket", value=f"[Open Ticket Channel]({ticket_url})", inline=False)
            
            embed.set_footer(text="RiftMarket | Please wait for staff to deliver your items")
            
            await member.send(
                content=f"Welcome to **RiftMarket**! We found your order.",
                embed=embed,
            )
            logger.info(f"Sent order DM to {member.name} for order {order['order_number']}")
            
            # Also set permissions on the ticket channel so they can see it
            channel_id = order.get("discord_channel_id")
            if channel_id:
                try:
                    guild = bot.get_guild(GUILD_ID)
                    if guild:
                        channel = guild.get_channel(int(channel_id))
                        if channel:
                            await channel.set_permissions(member, read_messages=True, send_messages=True)
                            await channel.send(f"<@{member.id}> has joined the server! Order: **{order['order_number']}**")
                            logger.info(f"Set permissions for {member.name} on ticket {channel_id}")
                except Exception as e:
                    logger.error(f"Error setting channel permissions: {e}")
        else:
            # No pending order - send welcome message
            embed = discord.Embed(
                title="Welcome to RiftMarket!",
                description=(
                    "Thanks for joining! Here's how to get started:\n\n"
                    "**If you placed an order:**\n"
                    "Your ticket channel has been created automatically in the **Order Tickets** category. "
                    "Look for a channel named `#order-rift-xxxxxxxx`.\n\n"
                    "**If you're just browsing:**\n"
                    "Check out our shop at the website and find the items you need!\n\n"
                    "Need help? Open a ticket or ask in the support channel."
                ),
                color=0xFFE800,
            )
            embed.set_footer(text="RiftMarket | Your trusted Roblox item marketplace")
            
            await member.send(embed=embed)
            logger.info(f"Sent welcome DM to {member.name}")
    except discord.Forbidden:
        logger.warning(f"Cannot DM {member.name} - DMs disabled")
    except Exception as e:
        logger.error(f"Error sending DM to {member.name}: {e}")


@bot.event
async def on_message(message):
    """Handle DM messages - order lookup."""
    if message.author.bot:
        return
    
    # Only respond to DMs
    if not isinstance(message.channel, discord.DMChannel):
        return
    
    content = message.content.strip().upper()
    
    # Check if it looks like an order number
    if content.startswith("RIFT-"):
        order = await db.orders.find_one({"order_number": content}, {"_id": 0})
        if order:
            items_text = "\n".join([
                f"- **{item['product_name']}** x{item['quantity']}"
                for item in order.get("items", [])
            ])
            
            embed = discord.Embed(title=f"Order: {order['order_number']}", color=0xFFE800)
            embed.add_field(name="Status", value=order["status"].upper(), inline=True)
            embed.add_field(name="Total", value=f"${order['total_amount']:.2f}", inline=True)
            embed.add_field(name="Roblox", value=order.get("roblox_username", "N/A"), inline=True)
            embed.add_field(name="Items", value=items_text or "None", inline=False)
            
            ticket_url = order.get("discord_channel_url", "")
            if ticket_url:
                embed.add_field(name="Ticket", value=f"[Open Channel]({ticket_url})", inline=False)
            
            await message.reply(embed=embed)
        else:
            await message.reply("Order not found. Please check the order number and try again.")
    elif any(kw in content.lower() for kw in ["help", "order", "hi", "hello"]):
        await message.reply(
            "**RiftMarket Bot**\n\n"
            "Send me your **Order ID** (e.g. `RIFT-A1B2C3D4`) and I'll look it up for you!\n\n"
            "If you need help, please use the support channels in the server."
        )


def run_bot():
    token = os.environ.get("DISCORD_BOT_TOKEN", "").strip()
    if not token:
        logger.error("DISCORD_BOT_TOKEN not set, bot cannot start")
        return
    
    logger.info("Starting RIFT Discord Bot...")
    bot.run(token)


if __name__ == "__main__":
    run_bot()
