"""
Discord Bot Integration for RiftMarket
Uses Discord REST API via the bot token to:
1. Create ticket channels for each order
2. Post order details in ticket channels
3. Post notifications in staff channel
"""
import os
import httpx
import logging

logger = logging.getLogger(__name__)

DISCORD_API = "https://discord.com/api/v10"

def _headers():
    token = os.environ.get("DISCORD_BOT_TOKEN", "").strip()
    return {
        "Authorization": f"Bot {token}",
        "Content-Type": "application/json",
    }

def _guild_id():
    return os.environ.get("DISCORD_GUILD_ID", "").strip()

def _staff_channel_id():
    return os.environ.get("DISCORD_STAFF_CHANNEL_ID", "").strip()


async def find_or_create_orders_category() -> str:
    """Find or create an 'Orders' category in the guild."""
    guild_id = _guild_id()
    if not guild_id:
        return ""
    
    try:
        async with httpx.AsyncClient() as client:
            # List existing channels to find category
            resp = await client.get(
                f"{DISCORD_API}/guilds/{guild_id}/channels",
                headers=_headers(),
                timeout=10,
            )
            if resp.status_code != 200:
                logger.error(f"Failed to list channels: {resp.status_code} {resp.text}")
                return ""
            
            channels = resp.json()
            # Find existing "Orders" or "ORDERS" category (type 4 = category)
            for ch in channels:
                if ch.get("type") == 4 and ch.get("name", "").lower() in ("orders", "order-tickets"):
                    return ch["id"]
            
            # Create category
            resp = await client.post(
                f"{DISCORD_API}/guilds/{guild_id}/channels",
                headers=_headers(),
                json={"name": "Order Tickets", "type": 4},
                timeout=10,
            )
            if resp.status_code in (200, 201):
                cat = resp.json()
                logger.info(f"Created 'Order Tickets' category: {cat['id']}")
                return cat["id"]
            else:
                logger.error(f"Failed to create category: {resp.status_code} {resp.text}")
                return ""
    except Exception as e:
        logger.error(f"Error finding/creating category: {e}")
        return ""


async def create_order_ticket(order: dict) -> dict:
    """
    Create a ticket channel for an order and post details.
    Returns {"channel_id": "...", "channel_url": "..."} or empty dict on failure.
    """
    guild_id = _guild_id()
    bot_token = os.environ.get("DISCORD_BOT_TOKEN", "").strip()
    
    if not guild_id or not bot_token:
        logger.info("Discord bot not configured, skipping ticket creation")
        return {}
    
    try:
        category_id = await find_or_create_orders_category()
        
        # Create the ticket channel
        channel_name = f"order-{order['order_number'].lower()}"
        channel_data = {
            "name": channel_name,
            "type": 0,  # Text channel
            "topic": f"Order {order['order_number']} | {order['customer_name']} | {order.get('roblox_username', 'N/A')}",
        }
        if category_id:
            channel_data["parent_id"] = category_id
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                f"{DISCORD_API}/guilds/{guild_id}/channels",
                headers=_headers(),
                json=channel_data,
                timeout=10,
            )
            
            if resp.status_code not in (200, 201):
                logger.error(f"Failed to create ticket channel: {resp.status_code} {resp.text}")
                return {}
            
            channel = resp.json()
            channel_id = channel["id"]
            channel_url = f"https://discord.com/channels/{guild_id}/{channel_id}"
            logger.info(f"Created ticket channel: #{channel_name} ({channel_id})")
            
            # Build items list
            items_text = "\n".join([
                f"- **{item['product_name']}** x{item['quantity']}"
                for item in order.get("items", [])
            ])
            
            # Post order details embed in the ticket channel
            order_embed = {
                "embeds": [{
                    "title": f"Order Details",
                    "color": 16770048,  # #FFE800
                    "fields": [
                        {"name": "ID", "value": order["order_number"], "inline": True},
                        {"name": "Roblox Username", "value": order.get("roblox_username", "N/A") or "N/A", "inline": True},
                        {"name": "Total", "value": f"${order['total_amount']:.2f}", "inline": True},
                        {"name": "Email", "value": order.get("customer_email", "N/A"), "inline": True},
                        {"name": "Status", "value": order.get("status", "pending").upper(), "inline": True},
                        {"name": "Customer", "value": order.get("customer_name", "N/A"), "inline": True},
                        {"name": "Items", "value": items_text or "None", "inline": False},
                    ],
                    "footer": {"text": f"RiftMarket | Created {order.get('created_at', '')[:19]}"},
                }]
            }
            
            await client.post(
                f"{DISCORD_API}/channels/{channel_id}/messages",
                headers=_headers(),
                json=order_embed,
                timeout=10,
            )
            
            # Post instructions
            instructions = {
                "embeds": [{
                    "title": "Instructions",
                    "description": "Look at the instructions below.",
                    "color": 3447003,  # Blue
                    "fields": [
                        {
                            "name": "Steps",
                            "value": (
                                "1. Wait for a staff member to send you a private server link.\n"
                                "2. Please be patient — delivery times vary based on the current ticket queue and the item type.\n\n"
                                "**Make sure you're online and ready!**"
                            ),
                        },
                    ],
                }]
            }
            
            await client.post(
                f"{DISCORD_API}/channels/{channel_id}/messages",
                headers=_headers(),
                json=instructions,
                timeout=10,
            )
            
            # Post in staff channel
            staff_channel_id = _staff_channel_id()
            if staff_channel_id:
                staff_msg = {
                    "content": f"@here New order ticket from **{order.get('customer_name', 'Unknown')}**",
                    "embeds": [{
                        "title": f"Order {order['order_number']}",
                        "color": 16770048,
                        "fields": [
                            {"name": "ID", "value": order["order_number"], "inline": True},
                            {"name": "Roblox Username", "value": order.get("roblox_username", "N/A") or "N/A", "inline": True},
                            {"name": "Total", "value": f"${order['total_amount']:.2f}", "inline": True},
                            {"name": "Items", "value": items_text or "None", "inline": False},
                            {"name": "Ticket", "value": f"<#{channel_id}>", "inline": False},
                        ],
                        "footer": {"text": "RiftMarket"},
                    }]
                }
                
                await client.post(
                    f"{DISCORD_API}/channels/{staff_channel_id}/messages",
                    headers=_headers(),
                    json=staff_msg,
                    timeout=10,
                )
                logger.info(f"Staff notification sent for {order['order_number']}")
            
            return {
                "channel_id": channel_id,
                "channel_url": channel_url,
            }
    
    except Exception as e:
        logger.error(f"Error creating order ticket: {e}")
        return {}
