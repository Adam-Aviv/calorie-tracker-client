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
import "./theme/animations.css";
import "./theme/glassmorphism.css";

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
