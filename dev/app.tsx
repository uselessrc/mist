import React, {FC} from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line no-restricted-imports
import {Mist} from '../src/library';

const App: FC = () => {
  return (
    <div>
      <Mist>
        <div
          style={{
            width: 400,
            height: 800,
            backgroundImage:
              'url(https://i.loli.net/2021/06/27/ePcuHXl7L3sWEFN.jpg)',
            backgroundSize: 'cover',
          }}
        />
      </Mist>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
