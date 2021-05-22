import React, {useState, createContext} from 'react';
export const DatingAppContext = createContext(null);
const initialState = {
  profileInfo: {},
};
export function Context(props) {
  const [state, setState] = useState(initialState);
  return (
    <DatingAppContext.Provider value={{state, setState}}>
      {props.children}
    </DatingAppContext.Provider>
  );
}
