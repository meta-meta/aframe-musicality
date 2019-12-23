import _ from 'lodash';
import React from 'react';
import { toSymbol } from "./util";

const Tonnetz = () => (
  <pre style={{lineHeight: 3}}>

    {_.range(20).map(y => (
      <>
        {y % 2 > 0 && (
          <span style={{paddingRight: 21}}>
            {' '}
          </span>
        )}

        {_.range(30).map(x => (
          <span key={x} style={{padding: 21}}>
            {toSymbol(((y % 2 > 0
              ? ((y - 1) / 2) * 11 + 3
              : (y / 2) * 11) + x * 7))}
          </span>
        ))}
        <br/>
      </>
    ))}

</pre>);

export default Tonnetz;
