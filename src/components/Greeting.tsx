import React from 'react';

interface IGreeting {
  name: string;
}

const Greeting = ({ name }: IGreeting): JSX.Element => {
  return <div>Hello {name}</div>;
};

export default Greeting;
