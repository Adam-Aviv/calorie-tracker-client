import React, { useState } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { BookText, Library, TrendingUp, User, Plus } from "lucide-react";

import Login from "./pages/Login";
import Diary from "./pages/Diary";
import Foods from "./pages/Foods";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import GlobalActionModal from "./components/GlobalActionModal";
import AddWeightModal from "./components/AddWeightModal";
import AddFoodModal from "./components/AddFoodModal";
import AddFoodLibraryModal from "./components/AddFoodLibraryModal";

import { useAuthStore } from "./store/authStore";
import { useUIStore } from "./store/uiStore";

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

/* Custom Theme */
import "./theme/variables.css";
import "./theme/animations.css";
import "./theme/glassmorphism.css";

setupIonicReact();

const ACTIVE_TAB_COLOR = "#4f46e5";
const INACTIVE_TAB_COLOR = "#94a3b8";

const labelStyle = (color: string): React.CSSProperties => ({
  color,
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginTop: "4px",
});

const AuthenticatedRoutes: React.FC = () => {
  const { pathname } = useLocation();

  if (!pathname.startsWith("/tabs")) {
    return <Redirect to="/tabs/diary" />;
  }

  return <MainTabs />;
};

const MainTabs: React.FC = () => {
  const { pathname } = useLocation();
  const { openAddFood, openAddWeight, openAddFoodLibrary } = useUIStore();
  const [showActionModal, setShowActionModal] = useState(false);

  const tabColor = (path: string) =>
    pathname === path ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR;

  const handleGlobalAction = (
    type: "weight" | "library" | "breakfast" | "lunch" | "dinner" | "snack"
  ) => {
    setShowActionModal(false);
    if (
      type === "breakfast" ||
      type === "lunch" ||
      type === "dinner" ||
      type === "snack"
    ) {
      openAddFood(type);
    } else if (type === "weight") {
      openAddWeight();
    } else if (type === "library") {
      openAddFoodLibrary();
    }
  };

  return (
    <>
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

        <IonTabBar
          slot="bottom"
          className="border-t border-slate-100 relative h-20"
        >
          <IonTabButton tab="diary" href="/tabs/diary">
            <BookText
              size={22}
              color={tabColor("/tabs/diary")}
              strokeWidth={pathname === "/tabs/diary" ? 2.5 : 2}
            />
            <IonLabel style={labelStyle(tabColor("/tabs/diary"))}>
              Diary
            </IonLabel>
          </IonTabButton>

          <IonTabButton tab="progress" href="/tabs/progress">
            <TrendingUp
              size={22}
              color={tabColor("/tabs/progress")}
              strokeWidth={pathname === "/tabs/progress" ? 2.5 : 2}
            />
            <IonLabel style={labelStyle(tabColor("/tabs/progress"))}>
              Progress
            </IonLabel>
          </IonTabButton>

          <IonTabButton
            tab="add"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowActionModal(true);
            }}
          >
            <div
              className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center"
              style={{ borderRadius: "1.25rem" }}
            >
              <Plus size={28} strokeWidth={3} />
            </div>
          </IonTabButton>

          <IonTabButton tab="foods" href="/tabs/foods">
            <Library
              size={22}
              color={tabColor("/tabs/foods")}
              strokeWidth={pathname === "/tabs/foods" ? 2.5 : 2}
            />
            <IonLabel style={labelStyle(tabColor("/tabs/foods"))}>
              Library
            </IonLabel>
          </IonTabButton>

          <IonTabButton tab="profile" href="/tabs/profile">
            <User
              size={22}
              color={tabColor("/tabs/profile")}
              strokeWidth={pathname === "/tabs/profile" ? 2.5 : 2}
            />
            <IonLabel style={labelStyle(tabColor("/tabs/profile"))}>
              Profile
            </IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>

      <GlobalActionModal
        isOpen={showActionModal}
        onClose={() => setShowActionModal(false)}
        onAction={handleGlobalAction}
      />
      <AddFoodModal />
      <AddFoodLibraryModal />
      <AddWeightModal />
    </>
  );
};

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
          <AuthenticatedRoutes />
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
