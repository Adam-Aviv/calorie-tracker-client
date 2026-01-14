# 🍎 Calorie Tracker - Complete Setup Guide

## 📁 Project Structure

Your project should have this structure:

```
calorie-tracker/
├── src/
│   ├── components/
│   │   ├── MacroBar.tsx
│   │   ├── MacroBar.css
│   │   ├── FoodLogItem.tsx
│   │   ├── FoodLogItem.css
│   │   ├── AddFoodModal.tsx
│   │   └── AddFoodModal.css
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Login.css
│   │   ├── Diary.tsx
│   │   ├── Diary.css
│   │   ├── Foods.tsx
│   │   ├── Foods.css
│   │   ├── Progress.tsx
│   │   ├── Progress.css
│   │   ├── Profile.tsx
│   │   └── Profile.css
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   └── authStore.ts
│   ├── types/
│   │   └── index.ts
│   └── App.tsx
├── package.json
└── .env
```

## 🚀 Step-by-Step Setup

### 1. Update App.tsx

Replace your current App.tsx with the complete version that includes all page imports:

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

### 2. Create All Component Files

Copy each artifact I created into the corresponding file:

#### Components:

1. `src/components/MacroBar.tsx` + `MacroBar.css`
2. `src/components/FoodLogItem.tsx` + `FoodLogItem.css`
3. `src/components/AddFoodModal.tsx` + `AddFoodModal.css`

#### Pages:

1. `src/pages/Login.tsx` + `Login.css` (you already have this)
2. `src/pages/Diary.tsx` + `Diary.css`
3. `src/pages/Foods.tsx` + `Foods.css`
4. `src/pages/Progress.tsx` + `Progress.css`
5. `src/pages/Profile.tsx` + `Profile.css`

### 3. Install Missing Dependencies

```bash
npm install date-fns
```

### 4. Verify Your Backend is Running

Make sure your backend is running on `http://localhost:5001`:

```bash
cd ../calorie-backend-ts
npm run dev
```

### 5. Start the App

```bash
npm start
# or
ionic serve
```

The app should open at `http://localhost:8100`

## ✅ Features Checklist

### Authentication

- [x] Login page with email/password
- [x] Register new users
- [x] JWT token storage
- [x] Auto-redirect based on auth state

### Diary Page

- [x] Daily calorie and macro summary
- [x] Date navigation (previous/next day)
- [x] Meal sections (breakfast, lunch, dinner, snacks)
- [x] Add food modal with search
- [x] Quick add calories
- [x] Delete food logs (swipe to delete)
- [x] Real-time progress bars

### Foods Page

- [x] View all foods
- [x] Search foods
- [x] Filter by category
- [x] Add new foods
- [x] Edit existing foods
- [x] Delete foods (swipe to delete)

### Progress Page

- [x] Current weight stats
- [x] Goal weight tracking
- [x] Weight history with trends
- [x] Add weight entries
- [x] Delete weight entries
- [x] Visual indicators for progress

### Profile Page

- [x] Personal information
- [x] Body metrics (weight, height, age, gender)
- [x] Activity level
- [x] TDEE calculator
- [x] Nutrition goals (calories, protein, carbs, fats)
- [x] Logout

## 🎨 UI Components Used

- **IonTabs** - Bottom tab navigation
- **IonCard** - Content sections
- **IonList** - Food and weight lists
- **IonModal** - Add/edit dialogs
- **IonFab** - Floating action button
- **IonActionSheet** - Meal type selection
- **IonItemSliding** - Swipe to delete
- **IonProgressBar** - Macro tracking
- **IonSearchbar** - Food search
- **IonSegment** - Category filters
- **IonAlert** - Confirmations
- **IonToast** - Notifications
- **IonRefresher** - Pull to refresh

## 🔧 Troubleshooting

### Backend Connection Issues

- Ensure backend is running on port 5001
- Check `src/services/api.ts` has correct API_URL
- Verify CORS is enabled in backend

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Ionic cache
ionic build --clean
```

### Authentication Issues

- Check browser console for errors
- Verify JWT token is being stored in localStorage
- Test backend endpoints with Postman/Thunder Client

### Date Issues

- Make sure `date-fns` is installed
- Check date format is 'yyyy-MM-dd'

## 📱 Next Steps

### Testing

1. Register a new user
2. Add some foods to the database
3. Log foods for today
4. Add weight entries
5. Update your profile and goals

### Enhancements (Future)

- [ ] Charts for progress visualization
- [ ] Meal templates
- [ ] Barcode scanning
- [ ] Photo food logging
- [ ] Social features
- [ ] Recipe management
- [ ] Export data

## 🎉 You're Done!

Your calorie tracker app is now complete with:

- ✅ Authentication
- ✅ Food diary with macros
- ✅ Food database management
- ✅ Weight tracking
- ✅ User profile and goals

Enjoy tracking your nutrition! 🍎💪
