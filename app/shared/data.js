/**
 * 共享数据模块 v2.2 - 双模块系统（包厢点菜 + 招待物资）
 * 支持供应商比价、价格显示控制、批量导入
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
    { id: 'a1', category: 'appetizer', name: '口水鸡', price: 48, unit: '份' },
    { id: 'a2', category: 'appetizer', name: '蒜泥白肉', price: 42, unit: '份' },
    { id: 'a3', category: 'appetizer', name: '凉拌黄瓜', price: 18, unit: '份' },
    { id: 'm1', category: 'main', name: '红烧肉', price: 68, unit: '份' },
    { id: 'm2', category: 'main', name: '清蒸鲈鱼', price: 128, unit: '条' },
    { id: 'm3', category: 'main', name: '宫保鸡丁', price: 48, unit: '份' },
    { id: 'm4', category: 'main', name: '糖醋里脊', price: 52, unit: '份' },
    { id: 'm5', category: 'main', name: '清炒时蔬', price: 28, unit: '份' },
    { id: 's1', category: 'soup', name: '老火靓汤', price: 88, unit: '例' },
    { id: 's2', category: 'soup', name: '西湖牛肉羹', price: 48, unit: '份' },
    { id: 'st1', category: 'staple', name: '扬州炒饭', price: 28, unit: '份' },
    { id: 'st2', category: 'staple', name: '手工水饺', price: 32, unit: '份' },
    { id: 'd1', category: 'dessert', name: '双皮奶', price: 18, unit: '份' },
    { id: 'f1', category: 'fruit', name: '果盘拼盘', price: 68, unit: '份' },
    { id: 'b1', category: 'beverage', name: '鲜榨橙汁', price: 28, unit: '扎' },
    { id: 'b2', category: 'beverage', name: '可乐/雪碧', price: 8, unit: '瓶' },
    { id: 'b3', category: 'beverage', name: '矿泉水', price: 5, unit: '瓶' }
];

// ============ 默认供应商 ============
const defaultSuppliers = [
    { id: 'sup1', name: '鑫鲜果业', contact: '138-0000-0001', note: '本地最大水果批发' },
    { id: 'sup2', name: '甜蜜水果', contact: '139-0000-0002', note: '进口水果为主' },
    { id: 'sup3', name: '饮品天地', contact: '137-0000-0003', note: '饮料专供' }
];

// ============ 默认采购物资（含多家报价）============
const defaultProcurement = [
    {
        id: 'pf1', category: 'fruit', name: '苹果', spec: '红富士/大', unit: 'kg', perCapita: 0.2,
        quotes: [
            { supplierId: 'sup1', price: 8.5 },
            { supplierId: 'sup2', price: 9.0 }
        ],
        winnerId: 'sup1'
    },
    {
        id: 'pf2', category: 'fruit', name: '香蕉', spec: '菲律宾/中', unit: 'kg', perCapita: 0.15,
        quotes: [
            { supplierId: 'sup1', price: 6.0 },
            { supplierId: 'sup2', price: 5.8 }
        ],
        winnerId: 'sup2'
    },
    {
        id: 'pf3', category: 'fruit', name: '橙子', spec: '赣南脐橙/大', unit: 'kg', perCapita: 0.2,
        quotes: [
            { supplierId: 'sup1', price: 9.0 },
            { supplierId: 'sup2', price: 8.5 }
        ],
        winnerId: 'sup2'
    },
    {
        id: 'pb1', category: 'beverage', name: '可乐', spec: '330ml罐装', unit: '罐', perCapita: 0.5,
        quotes: [
            { supplierId: 'sup3', price: 2.5 }
        ],
        winnerId: 'sup3'
    },
    {
        id: 'pb2', category: 'beverage', name: '矿泉水', spec: '550ml瓶装', unit: '瓶', perCapita: 1,
        quotes: [
            { supplierId: 'sup3', price: 1.5 }
        ],
        winnerId: 'sup3'
    }
];

// ============ 系统配置 ============
const appConfig = {
    appName: '宴会订餐系统',
    version: '2.2',
    currency: '¥',
    defaultGuests: 10,
    storageKey: 'banquetEnterpriseV2'
};

// ============ 默认设置 ============
const defaultSettings = {
    showPriceToStaff: false,      // 是否给员工显示菜品价格
    showSupplierToStaff: false,   // 员工端不显示供应商信息
    adminPassword: 'admin888'
};

// ============ 数据管理器 ============
const DataManager = {
    getData() {
        const saved = localStorage.getItem(appConfig.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            // 确保新字段存在
            if (!data.suppliers) data.suppliers = [...defaultSuppliers];
            if (!data.settings) data.settings = { ...defaultSettings };
            if (!data.procurementSubmissions) data.procurementSubmissions = [];
            return data;
        }
        return {
            menuItems: [...defaultMenuItems],
            procurement: [...defaultProcurement],
            suppliers: [...defaultSuppliers],
            submissions: [],                    // 包厢点菜订单
            procurementSubmissions: [],         // 招待物资订单
            settings: { ...defaultSettings },
            guestCount: appConfig.defaultGuests
        };
    },

    saveData(data) {
        localStorage.setItem(appConfig.storageKey, JSON.stringify(data));
    },

    // ========== 菜单相关 ==========
    getMenuItems() {
        return this.getData().menuItems;
    },

    updateMenuItems(items) {
        const data = this.getData();
        data.menuItems = items;
        this.saveData(data);
    },

    // ========== 设置相关 ==========
    getSettings() {
        return this.getData().settings;
    },

    updateSettings(newSettings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...newSettings };
        this.saveData(data);
    },

    // ========== 供应商相关 ==========
    getSuppliers() {
        return this.getData().suppliers;
    },

    addSupplier(supplier) {
        const data = this.getData();
        supplier.id = 'sup_' + Date.now();
        data.suppliers.push(supplier);
        this.saveData(data);
        return supplier.id;
    },

    updateSupplier(id, updates) {
        const data = this.getData();
        const sup = data.suppliers.find(s => s.id === id);
        if (sup) Object.assign(sup, updates);
        this.saveData(data);
    },

    deleteSupplier(id) {
        const data = this.getData();
        data.suppliers = data.suppliers.filter(s => s.id !== id);
        this.saveData(data);
    },

    // ========== 采购物资相关 ==========
    getProcurement() {
        return this.getData().procurement;
    },

    updateProcurement(items) {
        const data = this.getData();
        data.procurement = items;
        this.saveData(data);
    },

    // 批量导入水果（从粘贴文本）
    bulkImportFruits(textLines, category = 'fruit') {
        const data = this.getData();
        const lines = textLines.split('\n').map(l => l.trim()).filter(l => l);

        lines.forEach(name => {
            if (!name) return;
            data.procurement.push({
                id: 'p_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                category,
                name,
                spec: '',
                unit: 'kg',
                perCapita: 0.2,
                quotes: [],
                winnerId: null
            });
        });

        this.saveData(data);
        return lines.length;
    },

    // 设置中标供应商
    setWinner(procurementId, supplierId) {
        const data = this.getData();
        const item = data.procurement.find(p => p.id === procurementId);
        if (item) {
            item.winnerId = supplierId;
            this.saveData(data);
        }
    },

    // 添加报价
    addQuote(procurementId, supplierId, price) {
        const data = this.getData();
        const item = data.procurement.find(p => p.id === procurementId);
        if (item) {
            if (!item.quotes) item.quotes = [];
            const existing = item.quotes.find(q => q.supplierId === supplierId);
            if (existing) {
                existing.price = price;
            } else {
                item.quotes.push({ supplierId, price });
            }
            this.saveData(data);
        }
    },

    // ========== 订单提交 ==========
    addSubmission(submission) {
        const data = this.getData();
        submission.id = 'sub_' + Date.now();
        submission.timestamp = new Date().toISOString();
        submission.status = 'pending';
        data.submissions.push(submission);
        this.saveData(data);
        return submission.id;
    },

    addProcurementSubmission(submission) {
        const data = this.getData();
        submission.id = 'psub_' + Date.now();
        submission.timestamp = new Date().toISOString();
        submission.status = 'pending';
        data.procurementSubmissions.push(submission);
        this.saveData(data);
        return submission.id;
    },

    getSubmissions() {
        return this.getData().submissions || [];
    },

    getProcurementSubmissions() {
        return this.getData().procurementSubmissions || [];
    },

    // ========== 密码验证 ==========
    verifyAdminPassword(password) {
        return password === this.getSettings().adminPassword;
    },

    changeAdminPassword(newPassword) {
        this.updateSettings({ adminPassword: newPassword });
    },

    // ========== 备份恢复 ==========
    exportBackup() {
        const data = this.getData();
        data.exportTime = new Date().toISOString();
        return JSON.stringify(data, null, 2);
    },

    importBackup(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.menuItems) {
                this.saveData(data);
                return true;
            }
            return false;
        } catch (e) {
            return false;
        }
    }
};
