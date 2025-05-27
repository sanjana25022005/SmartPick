# SmartPick - Modern E-commerce Stationery Store

A complete online shopping platform for stationery products built with React.js. Perfect for students and professionals who need quality stationery items with a smooth shopping experience.

## ✨ What You Get

**For Shoppers:**
- Browse and search thousands of stationery products
- Add items to cart and wishlist with one click
- Secure user accounts with order history
- Voice search - just speak to find products
- Mobile-friendly design that works anywhere
- Dark/light themes for comfortable browsing

**For Store Owners:**
- Complete admin dashboard to manage everything
- Add/edit products easily
- Track orders and customer information
- View sales analytics and reports

## 🛠️ Built With

- **React.js** - Modern web framework
- **Bootstrap** - Beautiful, responsive design
- **Local Storage** - Your data stays safe in browser
- **Voice Search** - Speak to search products
- **Context API** - Smart state management

## 🚀 Quick Start

1. **Download the project**
   ```bash
   git clone https://github.com/yourusername/smartpick.git
   cd smartpick/client
   ```

2. **Install and run**
   ```bash
   npm install
   npm start
   ```

3. **Open your browser to** `http://localhost:3000`

That's it! You're ready to shop or manage the store.

## 🎯 Key Features

### Shopping Made Easy
- **Smart Search** - Find products by typing or speaking
- **Wishlist** - Save items for later with heart button
- **Shopping Cart** - Add, remove, change quantities
- **Quick Checkout** - Simple 3-step ordering process
- **Order Tracking** - See your order status anytime

### Beautiful Design
- **Responsive** - Works on phones, tablets, computers
- **Accessible** - Easy to use for everyone
- **Fast** - Smooth animations and quick loading
- **Modern UI** - Clean, professional look

### Admin Tools
- **Product Management** - Add new items with photos
- **Order Management** - Process and track all orders
- **User Management** - Handle customer accounts
- **Dashboard** - See sales and performance data

## 👤 Demo Accounts

**Try as a Customer:**
- Email: `user@example.com`
- Password: `password123`

**Try as Admin:**
- Email: `admin@example.com` 
- Password: `admin123`

## 📱 How to Use

### As a Customer:
1. **Sign up** or use demo account
2. **Browse products** on homepage or products page
3. **Add to cart** by clicking the cart button
4. **Save favorites** by clicking the heart icon
5. **Checkout** when ready to buy
6. **Track orders** in your profile

### As Admin:
1. **Login** with admin account
2. **Manage products** - add, edit, delete items
3. **Handle orders** - update status, track shipments
4. **View analytics** - see sales and customer data

## 🌟 Special Features

- **Voice Search** - Click microphone and speak your search
- **Theme Toggle** - Switch between light and dark modes
- **Real-time Updates** - Cart and wishlist update instantly
- **Order History** - Keep track of all purchases
- **Mobile Optimized** - Touch-friendly on all devices

## 🔧 Key Technologies

- **React Router** for navigation
- **Context API** for data sharing
- **Bootstrap** for styling
- **Font Awesome** for icons
- **Web Speech API** for voice search

## 🐛 Need Help?

### Common Solutions:
- **Won't start?** Make sure Node.js is installed
- **Features broken?** Clear browser cache
- **Voice search not working?** Check microphone permissions
- **Styling issues?** Try refreshing the page

### Get Support:
- Check browser console for errors
- Try incognito mode
- Make sure JavaScript is enabled

## 📈 What's Next?

Future improvements planned:
- Real payment processing
- Email notifications
- Mobile app version
- More product categories
- Advanced search filters
- Social media sharing

## 🎓 Perfect For

- **Learning React** - Well-structured, commented code
- **Portfolio Projects** - Professional-looking e-commerce site
- **Small Businesses** - Ready-to-use online store
- **Students** - Great example of modern web development

## 💡 Why SmartPick?

- **Complete Solution** - Everything you need for online selling
- **Easy to Use** - Simple for both customers and admins
- **Modern Design** - Looks professional and trustworthy
- **Well Documented** - Easy to understand and modify
- **Mobile Ready** - Works perfectly on all devices

## Login Page Changes

```javascript
<Container>
  <Row className="justify-content-center">
    <Col md={6} lg={4}>
      <Card className="shadow">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
            <h2 className="mb-0">Welcome Back</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {message && (
            <Alert variant="danger" className="d-flex align-items-center">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-envelope me-2 text-muted"></i>
                Email Address
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  className="ps-5"
                />
                <i className="fas fa-envelope position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <i className="fas fa-lock me-2 text-muted"></i>
                Password
              </Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="ps-5"
                />
                <i className="fas fa-lock position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#6c757d'}}></i>
              </div>
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Sign In
                </>
              )}
            </Button>
          </Form>

          <div className="text-center">
            <p className="mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none">
                <i className="fas fa-user-plus me-1"></i>
                Create Account
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Col>
  </Row>
</Container>
```