interface TreeHelperConfig {
  id: string;
  children: string;
  pid: string;
}

const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  children: 'children',
  pid: 'pid',
};

// 获取树节点的数据
const getConfig = (config: Partial<TreeHelperConfig>) => Object.assign({}, DEFAULT_CONFIG, config);

/**
 * @description 深度优先,筛选说树形结构中符合条件的所有枝条,子节点符合则父节点也符合
 * @param tree 需要遍历的树形结构
 * @param callback 筛选方法
 * @param config 默认遍历的属性
 * @returns 返回满足条件的数据
 */
export function filter<T = any>(
  tree: T[],
  callback: (n: T) => boolean,
  config: Partial<TreeHelperConfig> = {},
) {
  config = getConfig(config);
  // 需要遍历的属性值
  const children = config.children as string;

  // 遍历筛选 第一级没有进行遍历
  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter(node => {
        // ! 深度遍历
        // 判断当前节点是否存在子节点，若存在子节点则继续遍历  获取返回的节点数据
        node[children] = node[children] && listFilter(node[children]);
        // 返回复核筛选条件的数据, 若子节点存在符合条件的数据 则返回子节点
        return callback(node) || (node[children] && node[children].length);
      });
  }
  return listFilter(tree);
}


// 返回指定树形结构
export function treeMap<T = any>(treeData: T[], opt: { children?: string; conversion: Function }): T[] {
  return treeData.map((item) => treeMapEach<T>(item, opt));
}

export function treeMapEach<T>(data: T, { children = 'children', conversion }: { children?: string; conversion: Function }) {
  // 判断当前对象是否存在子元素
  const hasChildren = Array.isArray(data[children]) && data[children].length > 0;
  // 传入节点 或者对应所需的树形结构
  const conversionData = conversion(data) || {};
  if (hasChildren) {
    return {
      ...conversionData,
      [children]: data[children].map((item: T) => 
        // 继续遍历子元素 构建子树结构
        treeMapEach(item, {
          children,
          conversion,
        })
      )
    }
  } else {
    return {
      ...conversionData
    };
  }
}
