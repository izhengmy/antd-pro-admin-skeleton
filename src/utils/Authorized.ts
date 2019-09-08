import RenderAuthorize from '@/components/Authorized';
import { getPermissions } from '@/utils/permission';
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/no-mutable-exports */
let Authorized = RenderAuthorize(getPermissions());

// Reload the rights component
const reloadAuthorized = (): void => {
  Authorized = RenderAuthorize(getPermissions());
};

export { reloadAuthorized };
export default Authorized;
