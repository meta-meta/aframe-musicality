import _ from 'lodash';
import React from 'react';

const MultTableMod12 = () => (
  <>
    {_.range(6).map(n => (
      <pre>
        {_.range(13).map(y => (
          <>
            {_.range(13).map(x => (
              <span key={x} style={{ padding: 3 }}>
                {_.padStart((n + x * y) % 12, 2, '0')}
              </span>
            ))}
            <br />
          </>
        ))}

      </pre>
    ))}
  </>);

export default MultTableMod12;