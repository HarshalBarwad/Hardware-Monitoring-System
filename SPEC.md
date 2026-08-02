# DeviceGuard - Enterprise Hardware Monitoring System

## 1. Concept & Vision

DeviceGuard is a sophisticated enterprise cybersecurity platform that provides real-time hardware device monitoring across organizational endpoints. The system embodies a "command center" aesthetic—projecting confidence, security, and professional authority. It feels like stepping into a high-tech security operations center where every device event is tracked, analyzed, and acted upon with precision.

## 2. Design Language

### Aesthetic Direction
**Reference**: Modern SOC (Security Operations Center) dashboards with a fusion of glassmorphism and enterprise professionalism. Think Bloomberg Terminal meets modern SaaS design—data-dense yet elegantly organized.

### Color Palette
- **Primary**: `#1E40AF` (Deep Blue) - Trust, security, authority
- **Primary Light**: `#3B82F6` (Bright Blue) - Interactive elements
- **Secondary**: `#0F172A` (Dark Slate) - Sidebar, headers
- **Accent**: `#06B6D4` (Cyan) - Alerts, highlights, live indicators
- **Success**: `#10B981` (Emerald) - Connected, active states
- **Warning**: `#F59E0B` (Amber) - Warnings, moderate alerts
- **Danger**: `#EF4444` (Red) - Critical alerts, disconnected
- **Background**: `#F1F5F9` (Slate 100) - Main content area
- **Surface**: `#FFFFFF` (White) - Cards, panels
- **Text Primary**: `#1E293B` (Slate 800)
- **Text Secondary**: `#64748B` (Slate 500)
- **Border**: `#E2E8F0` (Slate 200)

### Typography
- **Headings**: Inter (700, 600) - Clean, professional
- **Body**: Inter (400, 500) - Excellent readability
- **Monospace**: JetBrains Mono - Serial numbers, IP addresses, code
- **Fallbacks**: system-ui, -apple-system, sans-serif

### Spatial System
- Base unit: 4px
- Card padding: 24px
- Section gaps: 32px
- Border radius: 12px (cards), 8px (buttons), 6px (inputs)
- Sidebar width: 280px

### Motion Philosophy
- **Micro-interactions**: 150ms ease-out for hovers, button presses
- **Page transitions**: 300ms fade with subtle scale
- **Data updates**: 200ms for live indicators, value changes
- **Sidebar**: 250ms slide with ease-in-out
- **Staggered lists**: 50ms delay between items on load
- **Charts**: 600ms draw animation on mount

### Visual Assets
- **Icons**: Lucide React - consistent, professional line icons
- **Charts**: Recharts with custom theme colors
- **Decorative**: Gradient overlays, subtle grid patterns, glow effects on critical elements
- **Status indicators**: Pulsing dots for live data, solid badges for states

## 3. Layout & Structure

### Overall Architecture
```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (Fixed)  │           Main Content Area             │
│  ┌─────────────┐  │  ┌─────────────────────────────────────┐│
│  │   Logo      │  │  │  Top Navbar (Search, Profile, Notif)││
│  ├─────────────┤  │  ├─────────────────────────────────────┤│
│  │  Navigation │  │  │                                     ││
│  │  - Dashboard│  │  │         Page Content                ││
│  │  - Devices  │  │  │         (Scrollable)                ││
│  │  - Events   │  │  │                                     ││
│  │  - Computers│  │  │                                     ││
│  │  - Alerts   │  │  │                                     ││
│  │  - Reports  │  │  │                                     ││
│  │  - Settings │  │  │                                     ││
│  ├─────────────┤  │  │                                     ││
│  │  User Info  │  │  │                                     ││
│  └─────────────┘  │  └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Page Structure

**Landing Page** (Public)
- Hero: Full-width gradient with animated particles
- Features grid: 3-column on desktop
- How it works: Step-by-step timeline
- Client flow: Interactive diagram
- FAQ: Accordion style
- Contact: Clean form with map background
- Footer: Multi-column links

**Dashboard** (Protected)
- 6 stat cards in responsive grid
- 4 charts in 2x2 grid on desktop
- Recent events table with live updates
- Quick actions panel

**Data Pages** (Devices, Events, Computers)
- Filter bar with search and dropdowns
- Data table with sorting, pagination
- Export controls
- Detail slide-over panels

### Responsive Strategy
- **Desktop (1280px+)**: Full sidebar, 4-column grids
- **Tablet (768-1279px)**: Collapsible sidebar, 2-column grids
- **Mobile (<768px)**: Bottom navigation, single column, stacked cards

## 4. Features & Interactions

### Authentication
- JWT-based login with access/refresh tokens
- Remember me extends token expiry to 30 days
- Password visibility toggle with eye icon
- Form validation on blur and submit
- Redirect to dashboard on success
- Show error toast on failure
- Protected route middleware

### Dashboard
- Real-time event counter with pulse animation
- Click on stat card filters related data
- Charts update on time range change (7d, 30d, 90d)
- Events table auto-scrolls for new items (pausable)
- Alert badges show unread count

### Device Management
- Search debounced at 300ms
- Multi-select for bulk actions
- Status filter: All, Connected, Disconnected, Enabled, Disabled
- Type filter: All types in dropdown
- Click row opens detail panel
- Actions: View, Edit, Disable, Remove

### Event Logs
- Advanced search with date range picker
- Severity filter: All, Critical, Warning, Info
- Export selections or all filtered
- Print with custom print stylesheet
- Click event shows full details modal

### Alerts
- Real-time WebSocket-style polling (5s interval)
- Severity-based color coding
- Acknowledge/Dismiss actions
- Filter by type and severity
- Mark all as read

### Settings
- Logo upload with preview
- Toggle switches for notifications
- Theme preference persisted
- Password change with confirmation

### Error Handling
- 404: Custom illustration with navigation back
- 500: Error message with retry button
- Network error: Toast with retry option
- Form errors: Inline validation messages
- Empty states: Helpful illustration with action

## 5. Component Inventory

### StatCard
- **Default**: White background, icon, value, label, trend indicator
- **Hover**: Subtle shadow lift, icon color intensifies
- **Loading**: Skeleton pulse animation
- **Clickable**: Cursor pointer, subtle scale on hover

### DataTable
- **Default**: Striped rows, hover highlight
- **Empty**: Centered illustration, message, action button
- **Loading**: Skeleton rows
- **Sorted**: Arrow indicator on column header
- **Selected**: Checkbox checked, row highlighted

### AlertBadge
- **Critical**: Red background, white text, pulse animation
- **Warning**: Amber background, dark text
- **Success**: Green background, white text
- **Info**: Blue background, white text

### Button
- **Primary**: Blue background, white text
- **Secondary**: White background, blue border, blue text
- **Danger**: Red background, white text
- **Ghost**: Transparent, text color on hover
- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Spinner replacing text

### Input
- **Default**: White background, gray border
- **Focus**: Blue border, subtle shadow
- **Error**: Red border, error message below
- **Disabled**: Gray background

### Sidebar
- **Desktop**: Fixed, always visible
- **Tablet**: Toggle button, overlay when open
- **Mobile**: Hidden, hamburger menu opens overlay

### Toast Notification
- **Success**: Green left border, check icon
- **Error**: Red left border, X icon
- **Warning**: Amber left border, alert icon
- **Info**: Blue left border, info icon
- **Animation**: Slide in from right, auto-dismiss 5s

## 6. Technical Approach

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom theme
- **State**: React Context + useReducer for auth, local state for UI
- **Data Fetching**: Axios with interceptors for auth
- **Charts**: Recharts with custom theme
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

### Backend (API Routes)
RESTful API design with consistent response format:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "pagination": { "page": 1, "limit": 10, "total": 100 }
}
```

### Database Schema (PostgreSQL + Drizzle)

**users**
- id, email, password_hash, name, role, avatar, phone, department, created_at, updated_at

**computers**
- id, name, username, ip_address, mac_address, os, status, last_online, organization_id, created_at

**devices**
- id, name, type, computer_id, serial_number, vendor, status, last_seen, created_at

**device_events**
- id, device_id, computer_id, user_id, event_type, severity, location, ip_address, timestamp, details

**alerts**
- id, type, severity, title, description, status, computer_id, device_id, user_id, created_at, acknowledged_at

**settings**
- id, organization_name, logo_url, theme, email_alerts, sms_alerts, language

**reports**
- id, type, period_start, period_end, generated_by, file_url, created_at

### API Endpoints

**Auth**
- POST /api/auth/login - User login
- POST /api/auth/logout - User logout
- GET /api/auth/me - Get current user

**Users**
- GET /api/users - List users (paginated)
- POST /api/users - Create user
- GET /api/users/:id - Get user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

**Computers**
- GET /api/computers - List computers
- POST /api/computers - Register computer
- GET /api/computers/:id - Get computer
- PUT /api/computers/:id - Update computer
- DELETE /api/computers/:id - Remove computer

**Devices**
- GET /api/devices - List devices (with filters)
- POST /api/devices - Add device
- GET /api/devices/:id - Get device
- PUT /api/devices/:id - Update device
- DELETE /api/devices/:id - Remove device

**Events**
- GET /api/events - List events (paginated, filterable)
- POST /api/events - Create event (from client agent)
- GET /api/events/stats - Get event statistics

**Alerts**
- GET /api/alerts - List alerts
- PUT /api/alerts/:id/acknowledge - Acknowledge alert
- PUT /api/alerts/:id/dismiss - Dismiss alert
- PUT /api/alerts/read-all - Mark all read

**Reports**
- GET /api/reports - List reports
- POST /api/reports/generate - Generate report
- GET /api/reports/:id/download - Download report

**Settings**
- GET /api/settings - Get settings
- PUT /api/settings - Update settings
- PUT /api/settings/password - Change password

### Data Generation
- 100 computers with realistic names (OFFICE-PC-001, etc.)
- 300 devices distributed across computers
- 1000 events with timestamps over 30 days
- 50 alerts of various severities
- 10 admin/system users
