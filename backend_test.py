#!/usr/bin/env python3
"""
RiftMarket Backend API Testing
Tests all backend endpoints for the Roblox marketplace
"""

import requests
import sys
import json
from datetime import datetime

class RiftMarketAPITester:
    def __init__(self, base_url="https://game-exchange-22.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session = requests.Session()  # Use session for cookie handling
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_user = None
        self.created_game_id = None
        self.created_product_id = None
        self.created_order_id = None

    def log(self, message):
        print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                self.log(f"❌ {name} - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    self.log(f"   Error: {error_data}")
                except:
                    self.log(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            self.log(f"❌ {name} - Exception: {str(e)}")
            return False, {}

    def test_public_endpoints(self):
        """Test public endpoints that don't require authentication"""
        self.log("\n=== Testing Public Endpoints ===")
        
        # Test games endpoint (should return empty array initially)
        success, data = self.run_test("Get Games", "GET", "games", 200)
        if success and isinstance(data, list):
            self.log(f"   Found {len(data)} games")
        
        # Test public stats
        success, data = self.run_test("Get Public Stats", "GET", "stats/public", 200)
        if success:
            self.log(f"   Stats: {data}")
        
        # Test best sellers
        success, data = self.run_test("Get Best Sellers", "GET", "products/best-sellers", 200)
        if success and isinstance(data, list):
            self.log(f"   Found {len(data)} best sellers")

    def test_admin_auth(self):
        """Test admin authentication"""
        self.log("\n=== Testing Admin Authentication ===")
        
        # Test login with correct credentials
        login_data = {
            "email": "admin@riftmarket.com",
            "password": "RiftAdmin2026!"
        }
        success, response = self.run_test("Admin Login", "POST", "auth/login", 200, login_data)
        if success:
            self.admin_user = response
            self.log(f"   Logged in as: {response.get('email')} (Role: {response.get('role')})")
            
            # Test /auth/me endpoint
            success, me_data = self.run_test("Get Current User", "GET", "auth/me", 200)
            if success:
                self.log(f"   Current user: {me_data}")
        
        # Test login with wrong credentials
        wrong_login = {
            "email": "admin@riftmarket.com", 
            "password": "wrongpassword"
        }
        self.run_test("Wrong Password Login", "POST", "auth/login", 401, wrong_login)

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        self.log("\n=== Testing Admin Stats ===")
        success, data = self.run_test("Get Admin Stats", "GET", "admin/stats", 200)
        if success:
            self.log(f"   Admin stats: {data}")

    def test_game_management(self):
        """Test game CRUD operations"""
        self.log("\n=== Testing Game Management ===")
        
        # Create a test game
        game_data = {
            "name": "Test Game",
            "slug": "test-game",
            "description": "A test game for API testing",
            "image_url": "https://example.com/test-game.jpg",
            "is_active": True
        }
        success, response = self.run_test("Create Game", "POST", "admin/games", 200, game_data)
        if success:
            self.created_game_id = response.get('id')
            self.log(f"   Created game with ID: {self.created_game_id}")
        
        # Get the created game
        if self.created_game_id:
            success, data = self.run_test("Get Game by Slug", "GET", f"games/test-game", 200)
            if success:
                self.log(f"   Retrieved game: {data.get('name')}")
        
        # Update the game
        if self.created_game_id:
            update_data = {"description": "Updated test game description"}
            success, data = self.run_test("Update Game", "PUT", f"admin/games/{self.created_game_id}", 200, update_data)
            if success:
                self.log(f"   Updated game description")

    def test_product_management(self):
        """Test product CRUD operations"""
        self.log("\n=== Testing Product Management ===")
        
        if not self.created_game_id:
            self.log("❌ No game created, skipping product tests")
            return
        
        # Create a test product
        product_data = {
            "game_id": self.created_game_id,
            "name": "Test Product",
            "description": "A test product for API testing",
            "image_url": "https://example.com/test-product.jpg",
            "price": 9.99,
            "original_price": 19.99,
            "stock": 100,
            "is_active": True
        }
        success, response = self.run_test("Create Product", "POST", "admin/products", 200, product_data)
        if success:
            self.created_product_id = response.get('id')
            self.log(f"   Created product with ID: {self.created_product_id}")
        
        # Get products for the game
        success, data = self.run_test("Get Products by Game", "GET", f"products?game_id={self.created_game_id}", 200)
        if success and isinstance(data, list):
            self.log(f"   Found {len(data)} products for the game")
        
        # Update the product
        if self.created_product_id:
            update_data = {"price": 7.99}
            success, data = self.run_test("Update Product", "PUT", f"admin/products/{self.created_product_id}", 200, update_data)
            if success:
                self.log(f"   Updated product price")

    def test_roblox_validation(self):
        """Test Roblox username validation (NEW in iteration 3)"""
        self.log("\n=== Testing Roblox Username Validation ===")
        
        # Test valid Roblox username
        valid_data = {"username": "Roblox"}
        success, response = self.run_test("Validate Roblox Username (Valid)", "POST", "roblox/validate", 200, valid_data)
        if success:
            if response.get('valid'):
                self.log(f"   Valid user found: {response.get('name')} (ID: {response.get('user_id')})")
                if response.get('avatar_url'):
                    self.log(f"   Avatar URL: {response.get('avatar_url')}")
            else:
                self.log(f"   Validation failed: {response.get('error')}")
        
        # Test invalid Roblox username
        invalid_data = {"username": "xyznotexist999"}
        success, response = self.run_test("Validate Roblox Username (Invalid)", "POST", "roblox/validate", 200, invalid_data)
        if success:
            if not response.get('valid'):
                self.log(f"   Invalid user correctly rejected: {response.get('error')}")
            else:
                self.log(f"   Unexpected: Invalid username was validated")
        
        # Test short username
        short_data = {"username": "ab"}
        success, response = self.run_test("Validate Roblox Username (Too Short)", "POST", "roblox/validate", 200, short_data)
        if success and not response.get('valid'):
            self.log(f"   Short username correctly rejected: {response.get('error')}")

    def test_proofs_management(self):
        """Test proofs CRUD operations (NEW in iteration 3)"""
        self.log("\n=== Testing Proofs Management ===")
        
        # Get proofs (should be empty initially)
        success, data = self.run_test("Get Proofs", "GET", "proofs", 200)
        if success and isinstance(data, list):
            self.log(f"   Found {len(data)} existing proofs")
        
        # Create a proof (admin only)
        proof_data = {
            "order_number": "RIFT-TEST123",
            "product_name": "Test Item",
            "price": 9.99,
            "image_url": "https://example.com/proof.jpg",
            "game_name": "Test Game"
        }
        success, response = self.run_test("Create Proof", "POST", "admin/proofs", 200, proof_data)
        created_proof_id = None
        if success:
            created_proof_id = response.get('id')
            self.log(f"   Created proof with ID: {created_proof_id}")
        
        # Get proofs again to verify creation
        success, data = self.run_test("Get Proofs After Creation", "GET", "proofs", 200)
        if success and isinstance(data, list):
            self.log(f"   Now found {len(data)} proofs")
        
        # Delete the proof
        if created_proof_id:
            success, _ = self.run_test("Delete Proof", "DELETE", f"admin/proofs/{created_proof_id}", 200)
            if success:
                self.log("   Deleted test proof")

    def test_order_flow(self):
        """Test order creation and management (UPDATED for iteration 3)"""
        self.log("\n=== Testing Order Flow ===")
        
        if not self.created_product_id:
            self.log("❌ No product created, skipping order tests")
            return
        
        # Create an order with Roblox username (NEW field)
        order_data = {
            "items": [
                {
                    "product_id": self.created_product_id,
                    "quantity": 2
                }
            ],
            "customer_name": "Test Customer",
            "customer_email": "test@example.com",
            "roblox_username": "TestRobloxUser"  # NEW field in iteration 3
        }
        success, response = self.run_test("Create Order with Roblox Username", "POST", "orders/checkout", 200, order_data)
        if success:
            order = response.get('order', {})
            self.created_order_id = order.get('id')
            order_number = order.get('order_number')
            roblox_username = order.get('roblox_username')
            self.log(f"   Created order: {order_number} (ID: {self.created_order_id})")
            self.log(f"   Roblox username: {roblox_username}")
            
            # Get the order by order number
            if order_number:
                success, data = self.run_test("Get Order", "GET", f"orders/{order_number}", 200)
                if success:
                    self.log(f"   Retrieved order: {data.get('order_number')}")
                    # Verify roblox_username is included
                    if data.get('roblox_username'):
                        self.log(f"   Order includes Roblox username: {data.get('roblox_username')}")
        
        # Test admin orders list
        success, data = self.run_test("List Admin Orders", "GET", "admin/orders", 200)
        if success:
            orders = data.get('orders', [])
            total = data.get('total', 0)
            self.log(f"   Found {len(orders)} orders (total: {total})")
        
        # Update order status
        if self.created_order_id:
            status_data = {"status": "paid"}
            success, data = self.run_test("Update Order Status", "PUT", f"admin/orders/{self.created_order_id}/status", 200, status_data)
            if success:
                self.log(f"   Updated order status to: {data.get('status')}")

    def test_error_cases(self):
        """Test error handling"""
        self.log("\n=== Testing Error Cases ===")
        
        # Test non-existent game
        self.run_test("Get Non-existent Game", "GET", "games/non-existent", 404)
        
        # Test non-existent product
        self.run_test("Get Non-existent Product", "GET", "products/non-existent", 404)
        
        # Test non-existent order
        self.run_test("Get Non-existent Order", "GET", "orders/NON-EXISTENT", 404)
        
        # Test error handling (without session cookies)
        old_session = self.session
        self.session = requests.Session()  # New session without cookies
        self.run_test("Unauthorized Admin Stats", "GET", "admin/stats", 401)
        self.session = old_session

    def cleanup(self):
        """Clean up created test data"""
        self.log("\n=== Cleaning Up Test Data ===")
        
        # Delete created product
        if self.created_product_id:
            success, _ = self.run_test("Delete Test Product", "DELETE", f"admin/products/{self.created_product_id}", 200)
            if success:
                self.log("   Deleted test product")
        
        # Delete created game
        if self.created_game_id:
            success, _ = self.run_test("Delete Test Game", "DELETE", f"admin/games/{self.created_game_id}", 200)
            if success:
                self.log("   Deleted test game")

    def run_all_tests(self):
        """Run all tests"""
        self.log("🚀 Starting RiftMarket API Tests")
        self.log(f"Testing against: {self.base_url}")
        
        try:
            self.test_public_endpoints()
            self.test_admin_auth()
            self.test_admin_stats()
            self.test_roblox_validation()  # NEW in iteration 3
            self.test_proofs_management()  # NEW in iteration 3
            self.test_game_management()
            self.test_product_management()
            self.test_order_flow()
            self.test_error_cases()
            self.cleanup()
            
        except Exception as e:
            self.log(f"❌ Test suite failed with exception: {str(e)}")
        
        # Print results
        self.log(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        self.log(f"Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = RiftMarketAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())