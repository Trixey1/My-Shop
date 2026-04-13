from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, BackgroundTasks, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import bcrypt
import jwt
import secrets
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from bson import ObjectId

# JWT Config
JWT_ALGORITHM = "HS256"

def get_jwt_secret():
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=60), "type": "access"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=7), "type": "refresh"}
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# MongoDB
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Auth helper
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["_id"] = str(user["_id"])
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(request: Request) -> dict:
    user = await get_current_user(request)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ---- Models ----
class LoginRequest(BaseModel):
    email: str
    password: str

class GameCreate(BaseModel):
    name: str
    slug: str
    description: str = ""
    image_url: str = ""
    is_active: bool = True

class GameUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class ProductCreate(BaseModel):
    game_id: str
    name: str
    description: str = ""
    image_url: str = ""
    price: float
    original_price: Optional[float] = None
    stock: int = -1
    is_active: bool = True

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None

class CartItem(BaseModel):
    product_id: str
    quantity: int = 1

class CheckoutRequest(BaseModel):
    items: List[CartItem]
    customer_name: str
    customer_email: str

class OrderStatusUpdate(BaseModel):
    status: str

# ---- Auth Routes ----
@api_router.post("/auth/login")
async def login(req: LoginRequest):
    from starlette.responses import JSONResponse
    email = req.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(req.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    uid = str(user["_id"])
    access_token = create_access_token(uid, email)
    refresh_token = create_refresh_token(uid)
    
    resp = JSONResponse(content={
        "id": uid, "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "user")
    })
    resp.set_cookie(key="access_token", value=access_token, httponly=True, secure=False, samesite="lax", max_age=3600, path="/")
    resp.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=False, samesite="lax", max_age=604800, path="/")
    return resp

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return {"id": user["_id"], "email": user["email"], "name": user.get("name", ""), "role": user.get("role", "user")}

@api_router.post("/auth/logout")
async def logout():
    from starlette.responses import JSONResponse
    resp = JSONResponse(content={"message": "Logged out"})
    resp.delete_cookie("access_token", path="/")
    resp.delete_cookie("refresh_token", path="/")
    return resp

# ---- Games Routes ----
@api_router.get("/games")
async def list_games(active_only: bool = True):
    query = {"is_active": True} if active_only else {}
    games = await db.games.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    return games

@api_router.get("/games/{slug}")
async def get_game(slug: str):
    game = await db.games.find_one({"slug": slug}, {"_id": 0})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    return game

@api_router.post("/admin/games")
async def create_game(game: GameCreate, request: Request):
    await require_admin(request)
    existing = await db.games.find_one({"slug": game.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists")
    doc = {
        "id": str(uuid.uuid4()),
        "name": game.name,
        "slug": game.slug,
        "description": game.description,
        "image_url": game.image_url,
        "is_active": game.is_active,
        "product_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.games.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.put("/admin/games/{game_id}")
async def update_game(game_id: str, update: GameUpdate, request: Request):
    await require_admin(request)
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.games.update_one({"id": game_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    game = await db.games.find_one({"id": game_id}, {"_id": 0})
    return game

@api_router.delete("/admin/games/{game_id}")
async def delete_game(game_id: str, request: Request):
    await require_admin(request)
    result = await db.games.delete_one({"id": game_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Game not found")
    await db.products.delete_many({"game_id": game_id})
    return {"message": "Game and associated products deleted"}

# ---- Products Routes ----
@api_router.get("/products/best-sellers")
async def get_best_sellers(limit: int = 12):
    products = await db.products.find({"is_active": True}, {"_id": 0}).sort("sold_count", -1).limit(limit).to_list(limit)
    return products

@api_router.get("/products")
async def list_products(game_id: Optional[str] = None, game_slug: Optional[str] = None, active_only: bool = True):
    query = {}
    if active_only:
        query["is_active"] = True
    if game_id:
        query["game_id"] = game_id
    elif game_slug:
        game = await db.games.find_one({"slug": game_slug})
        if game:
            query["game_id"] = game["id"]
    products = await db.products.find(query, {"_id": 0}).sort("sold_count", -1).to_list(500)
    return products

@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.post("/admin/products")
async def create_product(product: ProductCreate, request: Request):
    await require_admin(request)
    game = await db.games.find_one({"id": product.game_id})
    if not game:
        raise HTTPException(status_code=404, detail="Game not found")
    doc = {
        "id": str(uuid.uuid4()),
        "game_id": product.game_id,
        "name": product.name,
        "description": product.description,
        "image_url": product.image_url,
        "price": product.price,
        "original_price": product.original_price or product.price,
        "stock": product.stock,
        "is_active": product.is_active,
        "sold_count": 0,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.products.insert_one(doc)
    await db.games.update_one({"id": product.game_id}, {"$inc": {"product_count": 1}})
    doc.pop("_id", None)
    return doc

@api_router.put("/admin/products/{product_id}")
async def update_product(product_id: str, update: ProductUpdate, request: Request):
    await require_admin(request)
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.products.update_one({"id": product_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    return product

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, request: Request):
    await require_admin(request)
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    await db.products.delete_one({"id": product_id})
    await db.games.update_one({"id": product["game_id"]}, {"$inc": {"product_count": -1}})
    return {"message": "Product deleted"}

# ---- Orders Routes ----
def generate_order_number():
    return f"RIFT-{secrets.token_hex(4).upper()}"

@api_router.post("/orders/checkout")
async def create_order(req: CheckoutRequest):
    items_details = []
    total = 0.0
    for item in req.items:
        product = await db.products.find_one({"id": item.product_id}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if not product.get("is_active", True):
            raise HTTPException(status_code=400, detail=f"Product {product['name']} is not available")
        if product.get("stock", -1) != -1 and product["stock"] < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product['name']}")
        line_total = product["price"] * item.quantity
        total += line_total
        items_details.append({
            "product_id": product["id"],
            "product_name": product["name"],
            "game_id": product.get("game_id", ""),
            "price": product["price"],
            "quantity": item.quantity,
            "line_total": line_total,
            "image_url": product.get("image_url", ""),
        })
    
    order_number = generate_order_number()
    order = {
        "id": str(uuid.uuid4()),
        "order_number": order_number,
        "items": items_details,
        "customer_name": req.customer_name,
        "customer_email": req.customer_email,
        "total_amount": round(total, 2),
        "status": "pending",
        "payment_id": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.orders.insert_one(order)
    order.pop("_id", None)
    
    # Update sold counts and stock
    for item in req.items:
        await db.products.update_one(
            {"id": item.product_id},
            {"$inc": {"sold_count": item.quantity, "stock": -item.quantity if (await db.products.find_one({"id": item.product_id})).get("stock", -1) != -1 else 0}}
        )
    
    # Try Dodo Payments if configured
    dodo_key = os.environ.get("DODO_PAYMENTS_API_KEY", "").strip()
    checkout_url = None
    if dodo_key:
        try:
            from dodopayments import DodoPayments
            dodo_env = os.environ.get("DODO_PAYMENTS_ENVIRONMENT", "test_mode")
            dodo_client = DodoPayments(bearer_token=dodo_key, environment=dodo_env)
            # Note: In production, products would be created in Dodo dashboard
            # For now, we just return the order for Discord-based delivery
            logger.info(f"Dodo Payments configured but using Discord delivery flow")
        except Exception as e:
            logger.warning(f"Dodo Payments error: {e}")
    
    return {
        "order": order,
        "checkout_url": checkout_url,
        "message": "Order created successfully"
    }

@api_router.get("/orders/{order_number}")
async def get_order(order_number: str):
    order = await db.orders.find_one({"order_number": order_number}, {"_id": 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@api_router.get("/admin/orders")
async def list_orders(request: Request, status: Optional[str] = None, limit: int = 50, skip: int = 0):
    await require_admin(request)
    query = {}
    if status:
        query["status"] = status
    orders = await db.orders.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    total = await db.orders.count_documents(query)
    return {"orders": orders, "total": total}

@api_router.put("/admin/orders/{order_id}/status")
async def update_order_status(order_id: str, update: OrderStatusUpdate, request: Request):
    await require_admin(request)
    valid_statuses = ["pending", "paid", "delivered", "cancelled"]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of: {valid_statuses}")
    result = await db.orders.update_one(
        {"id": order_id},
        {"$set": {"status": update.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    return order

# ---- Stats ----
@api_router.get("/admin/stats")
async def get_stats(request: Request):
    await require_admin(request)
    total_orders = await db.orders.count_documents({})
    total_revenue_pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}]
    revenue_result = await db.orders.aggregate(total_revenue_pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    total_games = await db.games.count_documents({})
    total_products = await db.products.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    return {
        "total_orders": total_orders,
        "total_revenue": round(total_revenue, 2),
        "total_games": total_games,
        "total_products": total_products,
        "pending_orders": pending_orders,
    }

@api_router.get("/stats/public")
async def get_public_stats():
    total_orders = await db.orders.count_documents({})
    total_products = await db.products.count_documents({"is_active": True})
    total_games = await db.games.count_documents({"is_active": True})
    return {
        "orders_delivered": total_orders,
        "products_in_stock": total_products,
        "games_available": total_games,
    }

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("FRONTEND_URL", "http://localhost:3000"), "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup
@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.games.create_index("slug", unique=True)
    await db.games.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.products.create_index("game_id")
    await db.orders.create_index("order_number", unique=True)
    await db.orders.create_index("id", unique=True)
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@riftmarket.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "RiftAdmin2026!")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin user seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated")
    
    # Write test credentials
    creds_path = Path("/app/memory/test_credentials.md")
    creds_path.parent.mkdir(parents=True, exist_ok=True)
    creds_path.write_text(f"# Test Credentials\n\n## Admin\n- Email: {admin_email}\n- Password: {admin_password}\n- Role: admin\n\n## Endpoints\n- Login: POST /api/auth/login\n- Me: GET /api/auth/me\n- Logout: POST /api/auth/logout\n")
    logger.info("RiftMarket backend started")

@app.on_event("shutdown")
async def shutdown():
    client.close()
