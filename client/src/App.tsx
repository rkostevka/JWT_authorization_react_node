import React, {FC, useContext, useEffect, useState} from 'react';
import { Context } from './index';
import LoginForm  from './components/LoginForm';
import { observer } from 'mobx-react-lite';
import { IUser } from '../models/IUser';
import UserService from './services/UserService';

const App: FC = () => {

  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if(localStorage.getItem('refreshToken')) {
      store.checkAuth();
    }
  }, [])

  async function getUsers() {
    try {
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    } catch(e) {
      console.log(e);
    }
  }

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
      <div className="about">{store.isAuth ? `User is authorized from: ${store.user.email}` : 'Authorization'}</div>
      <div className="about">{store.user.isActivated ? `Account is confirmed from: ${store.user.email}` : 'You need to confirm your email!'}</div>
      <button className="button" onClick={() => {store.logout()}}>Logout</button>
      <button className="button" onClick={getUsers}>Get All Users</button>
      <div>
        {users.map(user => 
          <div key={user.email}>{user.email}</div>
        )}
      </div>
      
    </div>
  );
}

export default observer(App);
