import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  name: string;
};

export interface UserState {
  users: User[];
};

export interface Rename {
  name: string,
  newName: string,
}

const initialState: UserState = {
  users: [],
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    load: (state: UserState) => {
      const users = [
        {name: 'Alice'},
        {name: 'Bruce'},
        {name: 'Candy'},
      ];
      return {...state, users};
    },
    rename: (state: UserState, action: PayloadAction<Rename>) => {
      const users = state.users.map((user: User) => {
        if (user.name == action.payload.name) {
          return {
            ...user,
            name: action.payload.newName,
          };
        }
        return user;
      });
      return {...state, users};
    },
  }
});

export default user;
