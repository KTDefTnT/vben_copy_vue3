export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

/**
 * @description: default layout
 */
export const LAYOUT = () => import('src/layouts/default/index.vue');
// export const IFRAME = () => import('src/views/sys/iframe/FrameBlank.vue');
// export const EXCEPTION_COMPONENT = () => import('src/views/sys/exception/Exception.vue');

/**
 * @description: parent-layout 
 * ! 未知
 */
 export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};