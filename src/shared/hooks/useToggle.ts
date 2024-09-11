/**
 * The useToggle hook provides functionality to manage a boolean value
 * and toggle between true and false states.
 *
 * @param {boolean} initialValue - The initial value for the toggle state.
 * @returns {[boolean, () => void]} - An array containing the current state value and the toggle function.
 * Current value - the current state of the toggle.
 * Toggle function - switches the state between true and false.
 *
 * @example
 * Usage in a functional component:
 *
 * const [isToggled, toggle] = useToggle(true);
 *
 * return (
 *   <div>
 *     <p>Toggle State: {isToggled ? 'On' : 'Off'}</p>
 *     <button onClick={toggle}>Toggle</button>
 *   </div>
 * );
 */

import { useState } from 'react';

type TValueReturns = [boolean, () => void, (value: boolean) => void];

const useToggle = (initialValue = false): TValueReturns => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => {
    setValue(!value);
  };

  return [value, toggle, setValue];
};

export { useToggle };
