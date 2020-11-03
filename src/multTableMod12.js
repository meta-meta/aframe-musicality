import _ from 'lodash';
import React from 'react';
import { toSymbol } from "./util";
import PC from "./pc";

const MultTableMod12 = () => (
  <>
    {_.range(6).map(n => (
      <div style={{
        display: 'block',
        flexShrink: 0,
        margin: '1em',
      }}>
        {_.range(13).map(y => (
          <>
            {_.range(13).map(x => (
              <PC key={x} n={n + x * y} />
            ))}
            <br />
          </>
        ))}

      </div>
    ))}
  </>);

export default MultTableMod12;
