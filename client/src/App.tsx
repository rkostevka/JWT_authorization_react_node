import React, {FC, useContext, useEffect} from 'react';
import { Context } from './index';
import LoginForm  from './components/LoginForm';
import { observer } from 'mobx-react-lite';

const App: FC = () => {

  const {store} = useContext(Context);

  useEffect(() => {
    if(localStorage.getItem('refreshToken')) {
      store.checkAuth();
    }
  }, [])

  if(store.isLoading) {
    <div>Loading...</div>
  }

  if(!store.isAuth) {
    return (
      <LoginForm />
    )
  }

  return (
    <div className="App">
      <h1>{store.isAuth ? `User is authorized from: ${store.user.email}` : 'Authorization'}</h1>
      <button onClick={() => {store.logout()}}>Logout</button>
    </div>
  );
}

export default observer(App);
