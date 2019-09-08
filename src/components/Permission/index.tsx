import React, { ComponentType } from 'react';

import { Tooltip } from 'antd';
import { hasPermission } from '@/utils/permission';
import { objectExcept } from '@/utils/utils';

interface WithPermissionsProps {
  forceDenied?: boolean;
}

interface DeniedProps {
  [propName: string]: any;
}

export const withPermissions = (permissions: string[], deniedProps: DeniedProps = { disabled: true }) => <
  P extends WithPermissionsProps
>(
  WrappedComponent: ComponentType<P>,
) => (props: P) => {
  const rest = objectExcept(props, [...Object.keys(deniedProps), 'forceDenied']);
  if (hasPermission(permissions) && !props.forceDenied) {
    return <WrappedComponent {...(rest as P)} />;
  }
  return (
    <Tooltip title="您没有相关权限">
      <WrappedComponent {...(rest as P)} {...deniedProps} />
    </Tooltip>
  );
};
