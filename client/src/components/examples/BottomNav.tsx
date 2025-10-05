import { Route, Switch } from 'wouter';
import BottomNav from '../BottomNav';

export default function BottomNavExample() {
  return (
    <div className="h-screen w-full bg-background">
      <div className="pt-20 pb-24 px-4">
        <Switch>
          <Route path="/">
            <div className="text-center">Страница карты</div>
          </Route>
          <Route path="/locations">
            <div className="text-center">Страница локаций</div>
          </Route>
          <Route path="/achievements">
            <div className="text-center">Страница наград</div>
          </Route>
          <Route path="/rating">
            <div className="text-center">Страница рейтинга</div>
          </Route>
          <Route path="/profile">
            <div className="text-center">Страница профиля</div>
          </Route>
        </Switch>
      </div>
      <BottomNav />
    </div>
  );
}
