Deployed Link
https://dashboardbuildervk.netlify.app/
Demo Video
https://drive.google.com/file/d/1sl6IYABk4RShao3-T_xHdx2D1tsYn56e/view?usp=drivesdk
# 📊 DataDash — Full Stack Dashboard Builder

A full-stack analytics dashboard with drag-and-drop builder, customer order CRUD, and responsive layout.

---

## 🧱 Tech Stack

| Layer     | Tech                                         |
|-----------|----------------------------------------------|
| Frontend  | React + Vite, Tailwind CSS                  |
| Charts    | Recharts                                     |
| Drag/Drop | react-grid-layout                           |
| Forms     | react-hook-form                             |
| Backend   | Node.js + Express                           |
| Database  | MongoDB + Mongoose                          |
| HTTP      | Axios                                        |

---

## 🗂️ Project Structure

```
dashboard-project/
├── backend/
│   ├── models/
│   │   ├── CustomerOrder.js      # Order schema + totalAmount auto-calc
│   │   └── DashboardLayout.js    # Widget layout persistence
│   ├── routes/
│   │   ├── orders.js             # Full CRUD + date filter + seed
│   │   └── dashboard.js          # Save/load layout
│   ├── server.js
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── KPIWidget.jsx     # Metric cards
    │   │   ├── ChartWidget.jsx   # Bar/Line/Area/Scatter/Pie
    │   │   └── TableWidget.jsx   # Paginated data table
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Read-only view with date filter
    │   │   ├── ConfigureDashboard.jsx  # Drag/resize/configure builder
    │   │   └── Orders.jsx        # Full CRUD with search & filters
    │   ├── services/
    │   │   └── api.js            # Axios calls to backend
    │   ├── widgets/
    │   │   └── widgetConfig.js   # Types, metrics, aggregation logic
    │   └── App.jsx               # Layout + navigation
    └── ...
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or use MongoDB Atlas)

### 1. Start the Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your MONGO_URI if needed
npm install
npm run dev
# → Server on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# → App on http://localhost:5173
```

### 3. Seed Demo Data

In the **Orders** page, click **🌱 Seed Demo** to load 15 sample orders.

---

## 📡 API Endpoints

### Orders
| Method | Path                  | Description            |
|--------|-----------------------|------------------------|
| GET    | /api/orders           | List all (+ dateFilter)|
| POST   | /api/orders           | Create order           |
| PUT    | /api/orders/:id       | Update order           |
| DELETE | /api/orders/:id       | Delete order           |
| POST   | /api/orders/seed/demo | Load demo data         |

### Dashboard
| Method | Path           | Description      |
|--------|----------------|------------------|
| GET    | /api/dashboard | Load layout      |
| POST   | /api/dashboard | Save layout      |

---

## 🎛️ Features

### ✅ Customer Orders (CRUD)
- Create / Edit / Delete orders via modal form
- Search by name, email, product, city
- Date range filter (Today / 7 / 30 / 90 days / All)
- Status badges (pending → processing → shipped → delivered → cancelled)
- Auto-calculates `totalAmount = quantity × unitPrice`

### ✅ Dashboard Builder
- **Drag & drop** widgets anywhere on the grid
- **Resize** widgets by dragging the corner handle
- **Configure** each widget (title, metric, axes, color)
- **Save layout** persisted to MongoDB
- Widget types: KPI Card, Bar, Line, Area, Scatter, Pie, Table

### ✅ Responsive Grid
| Breakpoint | Columns |
|------------|---------|
| Desktop (≥1200px) | 12 |
| Tablet (≥996px)   | 8  |
| Mobile (<768px)   | 4  |

---

## 📦 Widget Types

| Widget       | Config Options           |
|--------------|--------------------------|
| KPI Card     | Metric (revenue, orders, avg, pending…) |
| Bar Chart    | X axis, Y axis, Color    |
| Line Chart   | X axis, Y axis, Color    |
| Area Chart   | X axis, Y axis, Color    |
| Scatter Chart| X axis, Y axis, Color    |
| Pie Chart    | X axis, Y axis           |
| Data Table   | Paginated, 6 rows/page   |

---

## 🧮 KPI Metrics Available
- Total Revenue
- Total Orders
- Average Order Value
- Pending Orders
- Delivered Orders
- Cancelled Orders
- Total Quantity Sold

---

## 🗄️ Database Schemas

### CustomerOrder
```js
{
  firstName, lastName, email, phone,
  address, city, state, postalCode, country,
  product, quantity, unitPrice,
  totalAmount,  // auto-calculated
  status,       // pending|processing|shipped|delivered|cancelled
  createdBy,
  createdAt, updatedAt
}
```

### DashboardLayout
```js
{
  userId: "demo",
  name: "My Dashboard",
  widgets: [{
    id, type, title,
    metric,        // for KPI cards
    xAxis, yAxis,  // for charts
    color, width, height,
    position: { x, y }
  }]
}
```
