/**
 * 宴会管理系统 v2.0 - 应用逻辑
 * Banquet Master v2.0 - Main Application
 */

// ============ 应用状态 ============
const app = {
    currentView: 'menu',
    currentCategory: 'all',
    procurementCategory: 'all',
    guestCount: 10,
    cart: [],
    procurement: [],

    // DOM 缓存
    elements: {},

    // ============ 初始化 ============
    init() {
        this.cacheElements();
        this.loadData();
        this.bindEvents();
        this.renderCategoryTabs();
        this.renderMenu();
        this.renderProcurement();
        this.updateCartUI();
        console.log('🎉 宴会管理系统 v2.0 已启动');
    },

    cacheElements() {
        this.elements = {
            // Navigation
            navBtns: document.querySelectorAll('.nav-btn'),
            views: document.querySelectorAll('.view'),

            // Menu
            categoryTabs: document.getElementById('categoryTabs'),
            menuGrid: document.getElementById('menuGrid'),
            guestCount: document.getElementById('guestCount'),
            guestMinus: document.getElementById('guestMinus'),
            guestPlus: document.getElementById('guestPlus'),

            // Procurement
            procTabs: document.querySelectorAll('.proc-tab'),
            procBody: document.getElementById('procurementBody'),
            totalBudget: document.getElementById('totalBudget'),
            exportCSV: document.getElementById('exportCSV'),
            printList: document.getElementById('printList'),
            addProcItem: document.getElementById('addProcurementItem'),

            // Cart
            cartToggle: document.getElementById('cartToggle'),
            cartOverlay: document.getElementById('cartOverlay'),
            cartSidebar: document.getElementById('cartSidebar'),
            closeCart: document.getElementById('closeCart'),
            cartItems: document.getElementById('cartItems'),
            cartCount: document.getElementById('cartCount'),
            itemCount: document.getElementById('itemCount'),
            totalPrice: document.getElementById('totalPrice'),
            clearCart: document.getElementById('clearCart'),
            printMenu: document.getElementById('printMenu'),

            // Other
            themeToggle: document.getElementById('themeToggle'),
            toast: document.getElementById('toast'),
            printArea: document.getElementById('printArea')
        };
    },

    // ============ 数据管理 ============
    loadData() {
        const saved = localStorage.getItem(appConfig.storageKey);
        if (saved) {
            const data = JSON.parse(saved);
            this.cart = data.cart || [];
            this.procurement = data.procurement || [...procurementItems];
            this.guestCount = data.guestCount || 10;
        } else {
            this.procurement = [...procurementItems];
        }
        this.elements.guestCount.value = this.guestCount;
    },

    saveData() {
        localStorage.setItem(appConfig.storageKey, JSON.stringify({
            cart: this.cart,
            procurement: this.procurement,
            guestCount: this.guestCount
        }));
    },

    // ============ 事件绑定 ============
    bindEvents() {
        // Navigation
        this.elements.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchView(btn.dataset.view));
        });

        // Guest Count
        this.elements.guestMinus.addEventListener('click', () => this.adjustGuests(-1));
        this.elements.guestPlus.addEventListener('click', () => this.adjustGuests(1));
        this.elements.guestCount.addEventListener('change', (e) => {
            this.guestCount = Math.max(1, Math.min(100, parseInt(e.target.value) || 10));
            e.target.value = this.guestCount;
            this.saveData();
            this.renderProcurement();
        });

        // Procurement Tabs
        this.elements.procTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.elements.procTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.procurementCategory = tab.dataset.category;
                this.renderProcurement();
            });
        });

        // Cart
        this.elements.cartToggle.addEventListener('click', () => this.toggleCart());
        this.elements.cartOverlay.addEventListener('click', () => this.toggleCart());
        this.elements.closeCart.addEventListener('click', () => this.toggleCart());
        this.elements.clearCart.addEventListener('click', () => this.clearCart());
        this.elements.printMenu.addEventListener('click', () => this.printSelectedMenu());

        // Procurement Actions
        this.elements.exportCSV.addEventListener('click', () => this.exportCSV());
        this.elements.printList.addEventListener('click', () => this.printProcurement());
        this.elements.addProcItem.addEventListener('click', () => this.addProcurementItem());

        // Theme
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
    },

    // ============ 视图切换 ============
    switchView(viewId) {
        this.elements.navBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewId);
        });
        this.elements.views.forEach(view => {
            view.classList.toggle('active', view.id === viewId + 'View');
        });
        this.currentView = viewId;
    },

    // ============ 分类标签渲染 ============
    renderCategoryTabs() {
        let html = '<button class="category-tab active" data-category="all"><i class="bi bi-grid"></i> 全部</button>';
        categories.forEach(cat => {
            html += `
                <button class="category-tab" data-category="${cat.id}">
                    <i class="bi ${cat.icon}"></i>
                    ${cat.name.split(' ')[0]}
                </button>
            `;
        });
        this.elements.categoryTabs.innerHTML = html;

        // Bind events
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCategory = tab.dataset.category;
                this.renderMenu();
            });
        });
    },

    // ============ 菜单渲染 ============
    renderMenu() {
        const filtered = this.currentCategory === 'all'
            ? menuItems
            : menuItems.filter(item => item.category === this.currentCategory);

        if (filtered.length === 0) {
            this.elements.menuGrid.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-inbox"></i>
                    <p>该分类暂无菜品</p>
                </div>
            `;
            return;
        }

        this.elements.menuGrid.innerHTML = filtered.map(item => {
            const inCart = this.cart.find(c => c.id === item.id);
            const qty = inCart ? inCart.qty : 0;
            const isSelected = qty > 0;

            return `
                <div class="menu-item ${isSelected ? 'selected' : ''}" data-id="${item.id}">
                    <div class="item-check"><i class="bi bi-check"></i></div>
                    <div class="item-header">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">${appConfig.currency}${item.price}</span>
                    </div>
                    <div class="item-desc">${item.description}</div>
                    <div class="item-footer">
                        <span class="item-unit">/${item.unit}</span>
                        <div class="item-quantity">
                            <button class="qty-btn" onclick="app.adjustQty('${item.id}', -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <span class="qty-value">${qty}</span>
                            <button class="qty-btn" onclick="app.adjustQty('${item.id}', 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    // ============ 购物车操作 ============
    adjustQty(id, delta) {
        const item = menuItems.find(m => m.id === id);
        if (!item) return;

        let cartItem = this.cart.find(c => c.id === id);

        if (cartItem) {
            cartItem.qty += delta;
            if (cartItem.qty <= 0) {
                this.cart = this.cart.filter(c => c.id !== id);
            }
        } else if (delta > 0) {
            this.cart.push({ id, qty: 1 });
        }

        this.saveData();
        this.renderMenu();
        this.updateCartUI();
    },

    toggleCart() {
        this.elements.cartOverlay.classList.toggle('active');
        this.elements.cartSidebar.classList.toggle('active');
    },

    updateCartUI() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
        this.elements.cartCount.textContent = totalItems;

        if (this.cart.length === 0) {
            this.elements.cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="bi bi-cart-x"></i>
                    <p>购物车是空的</p>
                </div>
            `;
            this.elements.itemCount.textContent = '0 道';
            this.elements.totalPrice.textContent = `${appConfig.currency}0`;
            return;
        }

        let totalPrice = 0;
        this.elements.cartItems.innerHTML = this.cart.map(cartItem => {
            const item = menuItems.find(m => m.id === cartItem.id);
            if (!item) return '';

            const subtotal = item.price * cartItem.qty;
            totalPrice += subtotal;

            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">${appConfig.currency}${item.price} × ${cartItem.qty} = ${appConfig.currency}${subtotal}</div>
                    </div>
                    <div class="cart-item-qty">
                        <button class="qty-btn" onclick="app.adjustQty('${item.id}', -1)">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span>${cartItem.qty}</span>
                        <button class="qty-btn" onclick="app.adjustQty('${item.id}', 1)">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        this.elements.itemCount.textContent = `${this.cart.length} 道`;
        this.elements.totalPrice.textContent = `${appConfig.currency}${totalPrice}`;
    },

    clearCart() {
        if (this.cart.length === 0) return;
        if (!confirm('确定清空购物车吗？')) return;

        this.cart = [];
        this.saveData();
        this.renderMenu();
        this.updateCartUI();
        this.toast('✅ 购物车已清空');
    },

    // ============ 采购管理 ============
    renderProcurement() {
        const filtered = this.procurementCategory === 'all'
            ? this.procurement
            : this.procurement.filter(p => p.category === this.procurementCategory);

        if (filtered.length === 0) {
            this.elements.procBody.innerHTML = `
                <tr><td colspan="7" style="text-align:center; padding:40px; color:var(--text-muted);">
                    <i class="bi bi-inbox" style="font-size:32px; display:block; margin-bottom:10px;"></i>
                    暂无数据
                </td></tr>
            `;
            this.elements.totalBudget.textContent = `${appConfig.currency}0.00`;
            return;
        }

        let total = 0;
        this.elements.procBody.innerHTML = filtered.map((item, idx) => {
            const totalQty = item.perCapita * this.guestCount;
            const budget = totalQty * item.price;
            total += budget;

            return `
                <tr data-id="${item.id}">
                    <td><input type="text" value="${item.name}" onchange="app.updateProcItem('${item.id}', 'name', this.value)"></td>
                    <td><input type="number" step="0.1" value="${item.perCapita}" style="width:60px;" onchange="app.updateProcItem('${item.id}', 'perCapita', parseFloat(this.value))"></td>
                    <td>${item.unit}</td>
                    <td>${totalQty.toFixed(1)}</td>
                    <td><input type="number" step="0.1" value="${item.price}" style="width:70px;" onchange="app.updateProcItem('${item.id}', 'price', parseFloat(this.value))"></td>
                    <td><strong>${appConfig.currency}${budget.toFixed(2)}</strong></td>
                    <td>
                        <button class="delete-btn" onclick="app.deleteProcItem('${item.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        this.elements.totalBudget.textContent = `${appConfig.currency}${total.toFixed(2)}`;
    },

    updateProcItem(id, field, value) {
        const item = this.procurement.find(p => p.id === id);
        if (item) {
            item[field] = value;
            this.saveData();
            this.renderProcurement();
        }
    },

    deleteProcItem(id) {
        if (!confirm('确定删除此项？')) return;
        this.procurement = this.procurement.filter(p => p.id !== id);
        this.saveData();
        this.renderProcurement();
        this.toast('✅ 已删除');
    },

    addProcurementItem() {
        const name = prompt('物资名称:');
        if (!name?.trim()) return;

        const category = prompt('分类 (fruit/beverage/other):', 'other') || 'other';
        const unit = prompt('单位 (kg/瓶/箱等):', '份') || '份';
        const price = parseFloat(prompt('单价:', '10')) || 10;
        const perCapita = parseFloat(prompt('人均用量:', '0.2')) || 0.2;

        this.procurement.push({
            id: 'p' + Date.now(),
            category: category.trim(),
            name: name.trim(),
            unit: unit.trim(),
            price,
            perCapita
        });

        this.saveData();
        this.renderProcurement();
        this.toast('✅ 已添加');
    },

    // ============ 人数调整 ============
    adjustGuests(delta) {
        this.guestCount = Math.max(1, Math.min(100, this.guestCount + delta));
        this.elements.guestCount.value = this.guestCount;
        this.saveData();
        this.renderProcurement();
    },

    // ============ 导出CSV ============
    exportCSV() {
        const BOM = '\uFEFF';
        let csv = BOM + '品名,人均用量,单位,总需求,单价(¥),预算(¥)\n';

        this.procurement.forEach(item => {
            const totalQty = (item.perCapita * this.guestCount).toFixed(1);
            const budget = (item.perCapita * this.guestCount * item.price).toFixed(2);
            csv += `"${item.name}",${item.perCapita},${item.unit},${totalQty},${item.price},${budget}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `采购清单_${new Date().toLocaleDateString()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(link.href), 100);

        this.toast('✅ CSV已导出');
    },

    // ============ 打印功能 ============
    printProcurement() {
        let html = `
            <div class="print-page">
                <h1 class="print-title">物资采购清单</h1>
                <p class="print-subtitle">用餐人数: ${this.guestCount}人 | 日期: ${new Date().toLocaleDateString()}</p>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>品名</th>
                            <th>人均</th>
                            <th>总需求</th>
                            <th>单价</th>
                            <th>预算</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let total = 0;
        this.procurement.forEach((item, idx) => {
            const totalQty = (item.perCapita * this.guestCount).toFixed(1);
            const budget = item.perCapita * this.guestCount * item.price;
            total += budget;

            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.perCapita}${item.unit}/人</td>
                    <td>${totalQty}${item.unit}</td>
                    <td>¥${item.price}</td>
                    <td>¥${budget.toFixed(2)}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="5" style="text-align:right;"><strong>总预算</strong></td>
                            <td><strong>¥${total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
                <p style="margin-top:30pt; text-align:right;">签收人: __________ 日期: __________</p>
            </div>
        `;

        this.elements.printArea.innerHTML = html;
        window.print();
    },

    printSelectedMenu() {
        if (this.cart.length === 0) {
            this.toast('⚠️ 请先选择菜品');
            return;
        }

        let html = `
            <div class="print-page">
                <h1 class="print-title">宴会菜单</h1>
                <p class="print-subtitle">用餐人数: ${this.guestCount}人 | 日期: ${new Date().toLocaleDateString()}</p>
                <table class="print-table">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>菜品名称</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>小计</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        let total = 0;
        this.cart.forEach((cartItem, idx) => {
            const item = menuItems.find(m => m.id === cartItem.id);
            if (!item) return;

            const subtotal = item.price * cartItem.qty;
            total += subtotal;

            html += `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${item.name}</td>
                    <td>¥${item.price}/${item.unit}</td>
                    <td>${cartItem.qty}</td>
                    <td>¥${subtotal}</td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="4" style="text-align:right;"><strong>合计</strong></td>
                            <td><strong>¥${total}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;

        this.elements.printArea.innerHTML = html;
        this.toggleCart();
        setTimeout(() => window.print(), 100);
    },

    // ============ 主题切换 ============
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        this.elements.themeToggle.innerHTML = isDark
            ? '<i class="bi bi-sun-fill"></i>'
            : '<i class="bi bi-moon-fill"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    },

    // ============ Toast提示 ============
    toast(message) {
        this.elements.toast.textContent = message;
        this.elements.toast.classList.add('show');
        setTimeout(() => this.elements.toast.classList.remove('show'), 2500);
    }
};

// ============ 启动应用 ============
document.addEventListener('DOMContentLoaded', () => {
    // Load theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    app.init();
});
