/**
 * 宴会管理系统 - 数据库
 * Banquet Master v2.0 - Data Configuration
 */

// ============ 菜品分类 ============
const categories = [
    { id: 'appetizer', name: '凉菜 Cold Dishes', icon: 'bi-snow' },
    { id: 'main', name: '热菜 Hot Dishes', icon: 'bi-fire' },
    { id: 'soup', name: '汤品 Soups', icon: 'bi-cup-hot' },
    { id: 'staple', name: '主食 Staples', icon: 'bi-basket' },
    { id: 'dessert', name: '甜点 Desserts', icon: 'bi-cake2' },
    { id: 'fruit', name: '水果 Fruits', icon: 'bi-apple' },
    { id: 'beverage', name: '饮料 Beverages', icon: 'bi-cup-straw' }
];

// ============ 菜品数据 ============
const menuItems = [
    // === 凉菜 ===
    {
        id: 'a1',
        category: 'appetizer',
        name: '口水鸡',
        price: 48,
        unit: '份',
        description: '四川风味，麻辣鲜香'
    },
    {
        id: 'a2',
        category: 'appetizer',
        name: '蒜泥白肉',
        price: 42,
        unit: '份',
        description: '蒜香浓郁，肥瘦相间'
    },
    {
        id: 'a3',
        category: 'appetizer',
        name: '凉拌黄瓜',
        price: 18,
        unit: '份',
        description: '清脆爽口，开胃必备'
    },

    // === 热菜 ===
    {
        id: 'm1',
        category: 'main',
        name: '红烧肉',
        price: 68,
        unit: '份',
        description: '肥而不腻，入口即化'
    },
    {
        id: 'm2',
        category: 'main',
        name: '清蒸鲈鱼',
        price: 128,
        unit: '条',
        description: '新鲜活鱼，经典粤式'
    },
    {
        id: 'm3',
        category: 'main',
        name: '宫保鸡丁',
        price: 48,
        unit: '份',
        description: '香辣可口，花生酥脆'
    },
    {
        id: 'm4',
        category: 'main',
        name: '糖醋里脊',
        price: 52,
        unit: '份',
        description: '酸甜适中，外酥里嫩'
    },
    {
        id: 'm5',
        category: 'main',
        name: '清炒时蔬',
        price: 28,
        unit: '份',
        description: '当季时令，清淡健康'
    },

    // === 汤品 ===
    {
        id: 's1',
        category: 'soup',
        name: '老火靓汤',
        price: 88,
        unit: '例',
        description: '慢火熬制，营养丰富'
    },
    {
        id: 's2',
        category: 'soup',
        name: '西湖牛肉羹',
        price: 48,
        unit: '份',
        description: '鲜嫩滑口，经典名菜'
    },

    // === 主食 ===
    {
        id: 'st1',
        category: 'staple',
        name: '扬州炒饭',
        price: 28,
        unit: '份',
        description: '粒粒分明，配料丰富'
    },
    {
        id: 'st2',
        category: 'staple',
        name: '手工水饺',
        price: 32,
        unit: '份',
        description: '皮薄馅大，鲜香多汁'
    },

    // === 甜点 ===
    {
        id: 'd1',
        category: 'dessert',
        name: '双皮奶',
        price: 18,
        unit: '份',
        description: '香滑细腻，经典港式'
    },

    // === 水果 ===
    {
        id: 'f1',
        category: 'fruit',
        name: '果盘拼盘',
        price: 68,
        unit: '份',
        description: '时令水果，精美摆盘'
    },
    {
        id: 'f2',
        category: 'fruit',
        name: '进口车厘子',
        price: 128,
        unit: '份',
        description: '智利进口，颗颗饱满'
    },

    // === 饮料 ===
    {
        id: 'b1',
        category: 'beverage',
        name: '鲜榨橙汁',
        price: 28,
        unit: '扎',
        description: '新鲜现榨，纯天然'
    },
    {
        id: 'b2',
        category: 'beverage',
        name: '可乐/雪碧',
        price: 8,
        unit: '瓶',
        description: '冰镇更佳'
    },
    {
        id: 'b3',
        category: 'beverage',
        name: '矿泉水',
        price: 5,
        unit: '瓶',
        description: '饮用纯净'
    },
    {
        id: 'b4',
        category: 'beverage',
        name: '青岛啤酒',
        price: 15,
        unit: '瓶',
        description: '冰镇提供'
    }
];

// ============ 采购物资数据（独立于菜品）============
const procurementItems = [
    // === 水果采购 ===
    {
        id: 'pf1',
        category: 'fruit',
        name: '苹果 (红富士)',
        unit: 'kg',
        price: 8.5,
        perCapita: 0.2
    },
    {
        id: 'pf2',
        category: 'fruit',
        name: '香蕉',
        unit: 'kg',
        price: 6.0,
        perCapita: 0.15
    },
    {
        id: 'pf3',
        category: 'fruit',
        name: '橙子',
        unit: 'kg',
        price: 9.0,
        perCapita: 0.2
    },
    {
        id: 'pf4',
        category: 'fruit',
        name: '葡萄',
        unit: 'kg',
        price: 18.0,
        perCapita: 0.15
    },

    // === 饮料采购 ===
    {
        id: 'pb1',
        category: 'beverage',
        name: '可口可乐 (330ml)',
        unit: '瓶',
        price: 3.0,
        perCapita: 0.5
    },
    {
        id: 'pb2',
        category: 'beverage',
        name: '雪碧 (330ml)',
        unit: '瓶',
        price: 3.0,
        perCapita: 0.3
    },
    {
        id: 'pb3',
        category: 'beverage',
        name: '农夫山泉 (550ml)',
        unit: '瓶',
        price: 2.0,
        perCapita: 1
    },
    {
        id: 'pb4',
        category: 'beverage',
        name: '王老吉',
        unit: '罐',
        price: 5.0,
        perCapita: 0.3
    },

    // === 其他物资 ===
    {
        id: 'po1',
        category: 'other',
        name: '餐巾纸',
        unit: '包',
        price: 5.0,
        perCapita: 0.2
    },
    {
        id: 'po2',
        category: 'other',
        name: '牙签',
        unit: '盒',
        price: 3.0,
        perCapita: 0.1
    }
];

// ============ 系统配置 ============
const appConfig = {
    appName: '宴会管理系统',
    version: '2.0',
    currency: '¥',
    defaultGuests: 10,
    storageKey: 'banquetMasterV2'
};
