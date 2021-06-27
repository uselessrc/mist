import React, {FC, useState} from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line no-restricted-imports
import {Mist} from '../src/library';

const C: FC = ({children}) => (
  <>
    <div>1</div>
    <div>2</div>
    {children}
  </>
);

const App: FC = () => {
  const [mist, setMist] = useState(false);

  const content = (
    <C>
      <div
        style={{
          width: 400,
          height: 400,
          backgroundImage:
            'url(https://i.loli.net/2021/06/27/ePcuHXl7L3sWEFN.jpg)',
          backgroundSize: 'cover',
        }}
      />
    </C>
  );

  return (
    <div>
      {mist ? <Mist>{content}</Mist> : content}
      <div
        style={{
          width: 'max-content',
          borderRadius: 4,
          padding: '4px 12px',
          marginTop: 12,
          backgroundColor: '#296dff',
          color: '#fff',
          cursor: 'pointer',
        }}
        onClick={() => setMist(true)}
      >
        起雾
      </div>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
