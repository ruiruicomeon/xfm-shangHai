import React from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception401 = () => (
  <Exception
    type="401"
    desc={formatMessage({ id: 'app.exception.description.401' })}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception401;
