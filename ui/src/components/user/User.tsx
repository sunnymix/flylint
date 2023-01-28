import { useAppSelector, useAppDispatch } from "@/hook/hook";
import { Button, Input } from 'antd';
import user, { User as UserData } from "@/store/user";
import React, { useState } from "react";

const User = () => {
  const dispatch = useAppDispatch();
  return (
    <div>
      <h1>Users</h1>
      <div>
        <Button onClick={() => dispatch(user.actions.load())}>Load</Button>
      </div>
      <UserList />
      <Rename />
    </div>
  );
};

const UserList = () => {
  const users = useAppSelector(state => state.user.users);
  return (
    <div>
      {users.map((user: UserData, i: number) => <UserItem key={i} user={user} />)}
    </div>
  );
};

const UserItem = (props: {user: UserData}) => {
  return (
    <div>
      <Input value={props.user.name} />
    </div>
  );
};

const Rename = () => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  return (
    <div>
      <h2>Rename</h2>
      <Input placeholder='name' value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder='new name' value={newName} onChange={(e) => setNewName(e.target.value)} />
      <Button onClick={() => dispatch(user.actions.rename({name, newName}))}>Rename</Button>
    </div>
  )
};

export default User;
