import _ from 'lodash';
import React from 'react';
import { toSymbol } from "./util";

const MultTableMod12 = () => (
  <>
    {_.range(6).map(n => (
      <pre>
        {_.range(13).map(y => (
          <>
            {_.range(13).map(x => (
              <span key={x} style={{ padding: 3 }}>
                {toSymbol(n + x * y)}
              </span>
            ))}
            <br />
          </>
        ))}

      </pre>
    ))}
  </>);

export default MultTableMod12;
