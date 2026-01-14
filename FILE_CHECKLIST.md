# 📋 File Checklist - Calorie Tracker

## ✅ Files You Already Have

- [x] `src/App.tsx` (update with new version)
- [x] `src/store/authStore.ts`
- [x] `src/services/api.ts`
- [x] `src/types/index.ts`
- [x] `src/pages/Login.tsx`

## 📝 Files to Create

### Components (6 files)

1. **`src/components/MacroBar.tsx`**

   - Progress bar component for macros
   - Shows current vs goal with percentage

2. **`src/components/MacroBar.css`**

   - Styles for MacroBar component

3. **`src/components/FoodLogItem.tsx`**

   - Individual food log entry
   - Displays food name, servings, macros
   - Swipe to delete functionality

4. **`src/components/FoodLogItem.css`**

   - Styles for FoodLogItem

5. **`src/components/AddFoodModal.tsx`**

   - Modal for adding foods to diary
   - Search existing foods or quick add
   - Adjustable servings

6. **`src/components/AddFoodModal.css`**
   - Styles for AddFoodModal

### Pages (8 files)

7. **`src/pages/Login.css`**

   - Styles for Login page

8. **`src/pages/Diary.tsx`**

   - Main food diary page
   - Daily summary and meal sections
   - Date navigation

9. **`src/pages/Diary.css`**

   - Styles for Diary page

10. **`src/pages/Foods.tsx`**

    - Food database management
    - Search, filter, CRUD operations

11. **`src/pages/Foods.css`**

    - Styles for Foods page

12. **`src/pages/Progress.tsx`**

    - Weight tracking page
    - Stats and history

13. **`src/pages/Progress.css`**

    - Styles for Progress page

14. **`src/pages/Profile.tsx`**

    - User profile and settings
    - Goals and TDEE calculator

15. **`src/pages/Profile.css`**
    - Styles for Profile page

## 📦 Dependencies to Install

```bash
npm install date-fns
```

## 🔄 Files to Update

### `src/App.tsx`

Update to uncomment the page imports and routes:

```typescript
import Diary from "./pages/Diary";
import Foods from "./pages/Foods";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
```

And uncomment the routes:

```typescript
<Route exact path="/tabs/diary" component={Diary} />
<Route exact path="/tabs/foods" component={Foods} />
<Route exact path="/tabs/progress" component={Progress} />
<Route exact path="/tabs/profile" component={Profile} />
```

## 🎯 Quick Setup Commands

```bash
# 1. Create component directory
mkdir -p src/components

# 2. Create all component files
touch src/components/MacroBar.tsx
touch src/components/MacroBar.css
touch src/components/FoodLogItem.tsx
touch src/components/FoodLogItem.css
touch src/components/AddFoodModal.tsx
touch src/components/AddFoodModal.css

# 3. Create page CSS files
touch src/pages/Login.css
touch src/pages/Diary.tsx
touch src/pages/Diary.css
touch src/pages/Foods.tsx
touch src/pages/Foods.css
touch src/pages/Progress.tsx
touch src/pages/Progress.css
touch src/pages/Profile.tsx
touch src/pages/Profile.css

# 4. Install dependencies
npm install date-fns

# 5. Start the app
npm start
```

## ✨ Testing Checklist

After setup, test these features:

1. **Authentication**

   - [ ] Register a new user
   - [ ] Login with credentials
   - [ ] Logout

2. **Diary**

   - [ ] Navigate dates
   - [ ] Add food to breakfast
   - [ ] Add food to lunch/dinner/snack
   - [ ] Search for foods
   - [ ] Quick add calories
   - [ ] Delete a food log
   - [ ] Check macro progress bars

3. **Foods**

   - [ ] View food list
   - [ ] Search foods
   - [ ] Filter by category
   - [ ] Add a new food
   - [ ] Edit existing food
   - [ ] Delete a food

4. **Progress**

   - [ ] View current stats
   - [ ] Add weight entry
   - [ ] View weight history
   - [ ] Delete weight entry
   - [ ] Check trends

5. **Profile**
   - [ ] Update personal info
   - [ ] Calculate TDEE
   - [ ] Update goals
   - [ ] Save changes
   - [ ] Logout

## 🎊 You're Ready!

Once all files are created and copied from the artifacts, your app will be fully functional!
