# 📱 Calorie Tracker - Ionic React App

## 🚀 Quick Start

### 1. Create Project

```bash
ionic start calorie-tracker blank --type=react --capacitor
cd calorie-tracker
```

### 2. Install Dependencies

```bash
npm install axios zustand date-fns
npm install -D @types/node
```

### 3. Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript types
├── services/
│   └── api.ts                # API service layer
├── store/
│   └── authStore.ts          # Zustand state management
├── pages/
│   ├── Login.tsx             # Login/Register
│   ├── Diary.tsx             # Food diary (main screen)
│   ├── Foods.tsx             # Food database
│   ├── Progress.tsx          # Weight & progress
│   └── Profile.tsx           # User profile
├── components/
│   ├── FoodLogItem.tsx       # Food log item component
│   ├── MacroBar.tsx          # Macro progress bar
│   └── AddFoodModal.tsx      # Add food modal
└── App.tsx                   # Main app with routing
```

### 4. Create Files

Copy the artifacts I created:

1. `.env` - Environment variables
2. `src/types/index.ts` - TypeScript types
3. `src/services/api.ts` - API service
4. `src/store/authStore.ts` - Auth state
5. `src/pages/Login.tsx` - Login screen

### 5. Update App.tsx

```typescript
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { book, restaurant, trendingUp, person } from "ionicons/icons";

import Login from "./pages/Login";
import Diary from "./pages/Diary";
import Foods from "./pages/Foods";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";

import { useAuthStore } from "./store/authStore";

/* Core CSS required for Ionic components */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <IonApp>
      <IonReactRouter>
        {!isAuthenticated ? (
          <IonRouterOutlet>
            <Route exact path="/login" component={Login} />
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
          </IonRouterOutlet>
        ) : (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tabs/diary" component={Diary} />
              <Route exact path="/tabs/foods" component={Foods} />
              <Route exact path="/tabs/progress" component={Progress} />
              <Route exact path="/tabs/profile" component={Profile} />
              <Route exact path="/">
                <Redirect to="/tabs/diary" />
              </Route>
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              <IonTabButton tab="diary" href="/tabs/diary">
                <IonIcon icon={book} />
                <IonLabel>Diary</IonLabel>
              </IonTabButton>

              <IonTabButton tab="foods" href="/tabs/foods">
                <IonIcon icon={restaurant} />
                <IonLabel>Foods</IonLabel>
              </IonTabButton>

              <IonTabButton tab="progress" href="/tabs/progress">
                <IonIcon icon={trendingUp} />
                <IonLabel>Progress</IonLabel>
              </IonTabButton>

              <IonTabButton tab="profile" href="/tabs/profile">
                <IonIcon icon={person} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
```

### 6. Run the App

```bash
# Make sure your backend is running
cd ../calorie-backend-ts
npm run dev

# In another terminal, run the mobile app
cd ../calorie-tracker
ionic serve
```

Open: **http://localhost:8100**

---

## 📱 Key Features

### ✅ Authentication

- Login/Register with JWT
- Persistent auth state with Zustand
- Auto-redirect based on auth status

### ✅ Food Diary (Main Screen)

- Daily calorie/macro tracking
- Add foods by meal type
- Real-time summary
- Progress bars

### ✅ Food Database

- Search and filter foods
- Add custom foods
- Edit/delete foods
- Quick add to diary

### ✅ Progress Tracking

- Weight history
- Trend charts
- Goal tracking
- Visual progress

### ✅ User Profile

- Update goals
- Calculate TDEE
- Activity level
- Macro targets

---

## 🎨 Ionic Components Used

- `IonTabs` - Bottom tab navigation
- `IonList` - Lists of items
- `IonCard` - Content cards
- `IonModal` - Modals for adding/editing
- `IonAlert` - Confirmations
- `IonToast` - Notifications
- `IonProgressBar` - Progress indicators
- `IonSearchbar` - Search functionality

---

## 🔄 State Management

### Zustand Store (Auth)

```typescript
const { token, user, isAuthenticated, setAuth, logout } = useAuthStore();
```

### React Query (Server State) - Coming Next

```typescript
const { data: foods } = useQuery(["foods"], () => foodsAPI.getAll());
const { data: dailyData } = useQuery(["daily", date], () =>
  logsAPI.getDaily(date)
);
```

---

## 📦 Next Steps

I'll create for you:

1. ✅ **Diary Page** - Main food logging screen
2. ✅ **Foods Page** - Food database management
3. ✅ **Progress Page** - Weight tracking
4. ✅ **Profile Page** - User settings
5. ✅ **Components** - Reusable UI components

Want me to continue building the pages? Let's do the Diary page next! 🚀
