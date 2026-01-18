import React, { useState } from "react";
import { Redirect, Route } from "react-router-dom";
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
import AddWeightModal from "./components/AddWeightModal"; // ADD THIS
import AddFoodModal from "./components/AddFoodModal"; // ADD THIS

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

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { openAddFood, openAddWeight, openAddFoodLibrary } = useUIStore();
  const [showActionModal, setShowActionModal] = useState(false);

  // Central logic for the Action Modal
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

              {/* High-End Tab Bar */}
              <IonTabBar
                slot="bottom"
                className="border-t border-slate-100 relative h-20"
              >
                <IonTabButton
                  tab="diary"
                  href="/tabs/diary"
                  className="bg-transparent"
                >
                  <BookText size={22} />
                  <IonLabel className="text-[10px] font-bold uppercase tracking-widest mt-1">
                    Diary
                  </IonLabel>
                </IonTabButton>

                <IonTabButton
                  tab="progress"
                  href="/tabs/progress"
                  className="bg-transparent"
                >
                  <TrendingUp size={22} />
                  <IonLabel className="text-[10px] font-bold uppercase tracking-widest mt-1">
                    Progress
                  </IonLabel>
                </IonTabButton>

                {/* CENTER ACTION BUTTON - Simple centered tab */}
                <IonTabButton
                  tab="add"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowActionModal(true);
                  }}
                  className="bg-transparent"
                >
                  <div
                    className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center"
                    style={{ borderRadius: "1.25rem" }}
                  >
                    <Plus size={28} strokeWidth={3} />
                  </div>
                </IonTabButton>

                <IonTabButton
                  tab="foods"
                  href="/tabs/foods"
                  className="bg-transparent"
                >
                  <Library size={22} />
                  <IonLabel className="text-[10px] font-bold uppercase tracking-widest mt-1">
                    Library
                  </IonLabel>
                </IonTabButton>

                <IonTabButton
                  tab="profile"
                  href="/tabs/profile"
                  className="bg-transparent"
                >
                  <User size={22} />
                  <IonLabel className="text-[10px] font-bold uppercase tracking-widest mt-1">
                    Profile
                  </IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>

            {/* The global modal that pops up when "+" is clicked */}
            <GlobalActionModal
              isOpen={showActionModal}
              onClose={() => setShowActionModal(false)}
              onAction={handleGlobalAction}
            />
            <AddWeightModal />
          </>
        )}
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
