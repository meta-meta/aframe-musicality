import _ from 'lodash';
import React from 'react';
import { toSymbol } from "./util";
import PC from "./pc";

const MultTableMod12 = () => (
  <div style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  }}>
    {_.range(6).map(n => (
      <div style={{
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
  </div>);

export default MultTableMod12;
