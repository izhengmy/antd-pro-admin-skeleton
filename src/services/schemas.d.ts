export interface Permission {
  id: number;
  name: string;
  cnName: string;
  guardName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: number;
  name: string;
  cnName: string;
  guardName: string;
  permissions?: Permission[];
  menus?: Menu[];
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: number;
  username: string;
  mobileNumber: string;
  realName: string;
  enabled: boolean;
  roles?: Role[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface Menu {
  id: number;
  parentId: number | null;
  path: string;
  name: string;
  icon: string;
  sort: number;
  newWindow: boolean;
  enabled: boolean;
  children?: Menu[];
}

export interface Profile {
  id: number;
  username: string;
  mobileNumber: string;
  realName: string;
  roles: Role[];
  notificationCount: number;
}

export interface EasySmsLog {
  id: string;
  mobileNumber: string;
  message: {
    data: {
      [propName: string]: any;
    };
    content: string;
    gateways: string[];
    template: string;
    messageType: string;
  };
  results: {
    status: 'success' | 'failure';
    gateway: string;
    result?: {
      [propName: string]: any;
    };
    exception?: {
      code: number;
      message: string;
    };
  };
  successful: boolean;
  createdAt: string;
  updatedAt: string;
}
