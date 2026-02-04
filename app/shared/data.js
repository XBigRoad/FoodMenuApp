/**
 * 共享数据模块 - 管理员和员工共用
 * Shared Data Module
 */

// ============ 菜品分类 ============
const categories = [
    { id: 'appetizer', name: '凉菜', icon: 'bi-snow' },
    { id: 'main', name: '热菜', icon: 'bi-fire' },
    { id: 'soup', name: '汤品', icon: 'bi-cup-hot' },
    { id: 'staple', name: '主食', icon: 'bi-basket' },
    { id: 'dessert', name: '甜点', icon: 'bi-cake2' },
    { id: 'fruit', name: '水果', icon: 'bi-apple' },
    { id: 'beverage', name: '饮料', icon: 'bi-cup-straw' }
];

// ============ 默认菜品数据 ============
const defaultMenuItems = [
    // 凉菜
    { id: 'a1', category: 'appetizer', name: '口水鸡', price: 48, unit: '份' },
    { id: 'a2', category: 'appetizer', name: '蒜泥白肉', price: 42, unit: '份' },
    { id: 'a3', category: 'appetizer', name: '凉拌黄瓜', price: 18, unit: '份' },
    // 热菜
    { id: 'm1', category: 'main', name: '红烧肉', price: 68, unit: '份' },
    { id: 'm2', category: 'main', name: '清蒸鲈鱼', price: 128, unit: '条' },
    { id: 'm3', category: 'main', name: '宫保鸡丁', price: 48, unit: '份' },
    { id: 'm4', category: 'main', name: '糖醋里脊', price: 52, unit: '份' },
    { id: 'm5', category: 'main', name: '清炒时蔬', price: 28, unit: '份' },
    // 汤品
    { id: 's1', category: 'soup', name: '老火靓汤', price: 88, unit: '例' },
    { id: 's2', category: 'soup', name: '西湖牛肉羹', price: 48, unit: '份' },
    // 主食
    { id: 'st1', category: 'staple', name: '扬州炒饭', price: 28, unit: '份' },
    { id: 'st2', category: 'staple', name: '手工水饺', price: 32, unit: '份' },
    // 甜点
    { id: 'd1', category: 'dessert', name: '双皮奶', price: 18, unit: '份' },
    // 水果
    { id: 'f1', category: 'fruit', name: '果盘拼盘', price: 68, unit: '份' },
    // 饮料
    { id: 'b1', category: 'beverage', name: '鲜榨橙汁', price: 28, unit: '扎' },
    { id: 'b2', category: 'beverage', name: '可乐/雪碧', price: 8, unit: '瓶' },
    { id: 'b3', category: 'beverage', name: '矿泉水', price: 5, unit: '瓶' }
];

// ============ 采购物资数据 ============
const defaultProcurementItems = [
    { id: 'pf1', category: 'fruit', name: '苹果', unit: 'kg', price: 8.5, perCapita: 0.2 },
    { id: 'pf2', category: 'fruit', name: '香蕉', unit: 'kg', price: 6.0, perCapita: 0.15 },
    { id: 'pf3', category: 'fruit', name: '橙子', unit: 'kg', price: 9.0, perCapita: 0.2 },
    { id: 'pb1', category: 'beverage', name: '可乐330ml', unit: '瓶', price: 3.0, perCapita: 0.5 },
    { id: 'pb2', category: 'beverage', name: '矿泉水550ml', unit: '瓶', price: 2.0, perCapita: 1 },
    { id: 'po1', category: 'other', name: '餐巾纸', unit: '包', price: 5.0, perCapita: 0.2 }
];

// ============ 系统配置 ============
const appConfig = {
    appName: '宴会订餐系统',
    version: '2.1',
    currency: '¥',
    defaultGuests: 10,
    storageKey: 'banquetEnterpriseV2',
    adminPassword: 'admin888' // 管理员密码，可在管理页面修改
};

// ============ 数据管理器 ============
const DataManager = {
    // 获取所有数据
    getData() {
        const saved = localStorage.getItem(appConfig.storageKey);
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            menuItems: [...defaultMenuItems],
            procurement: [...defaultProcurementItems],
            submissions: [], // 员工提交的订单
            guestCount: appConfig.defaultGuests,
            adminPassword: appConfig.adminPassword
        };
    },

    // 保存数据
    saveData(data) {
        localStorage.setItem(appConfig.storageKey, JSON.stringify(data));
    },

    // 获取菜单
    getMenuItems() {
        return this.getData().menuItems;
    },

    // 更新菜单
    updateMenuItems(items) {
        const data = this.getData();
        data.menuItems = items;
        this.saveData(data);
    },

    // 添加员工提交
    addSubmission(submission) {
        const data = this.getData();
        submission.id = 'sub_' + Date.now();
        submission.timestamp = new Date().toISOString();
        submission.status = 'pending'; // pending, confirmed, completed
        data.submissions.push(submission);
        this.saveData(data);
        return submission.id;
    },

    // 获取所有提交
    getSubmissions() {
        return this.getData().submissions || [];
    },

    // 验证管理员密码
    verifyAdminPassword(password) {
        const data = this.getData();
        return password === data.adminPassword;
    },

    // 修改管理员密码
    changeAdminPassword(newPassword) {
        const data = this.getData();
        data.adminPassword = newPassword;
        this.saveData(data);
    },

    // 导出备份
    exportBackup() {
        const data = this.getData();
        data.exportTime = new Date().toISOString();
        return JSON.stringify(data, null, 2);
    },

    // 导入备份
    importBackup(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.menuItems && data.submissions !== undefined) {
                this.saveData(data);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
};
