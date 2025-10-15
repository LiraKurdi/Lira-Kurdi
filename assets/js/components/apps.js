// assets/js/components/apps.js - TAM DOSYA İÇERİĞİ

import { PROJECT_APPS } from '../config.js';

const Apps = {
    render: () => {
        // Ana başlık kaldırıldı. Sadece ana taşıyıcı div var.
        return `
            <div id="apps-page-container" class="space-y-6">
                </div>
        `;
    },
    init: () => {
        const container = document.getElementById('apps-page-container');
        if (!container) return;

        // 1. Adım: Uygulamaları kategorilerine göre grupla
        const groupedApps = PROJECT_APPS.reduce((acc, app) => {
            const category = app.category;
            if (!acc[category]) {
                acc[category] = []; // Eğer kategori daha önce görülmediyse, boş bir dizi oluştur
            }
            acc[category].push(app); // Uygulamayı ilgili kategori dizisine ekle
            return acc;
        }, {});

        // 2. Adım: Gruplanmış veriyi kullanarak HTML oluştur
        container.innerHTML = Object.keys(groupedApps).map(category => {
            // Her bir kategori için uygulama listesini oluştur
            const appsInCategoryHTML = groupedApps[category].map(app => `
                <div class="app-item">
                    <div class="flex items-center gap-4 flex-1 min-w-0">
                        <img src="${app.logo}" alt="${app.name}" class="w-14 h-14 rounded-full object-cover flex-shrink-0">
                        <div class="flex-1 min-w-0">
                            <p class="font-bold truncate">${app.name}</p>
                            <p class="text-sm hint-color truncate">${app.description}</p>
                        </div>
                    </div>
                    <a href="${app.url}" target="_blank" class="bg-[var(--primary-color)] text-[var(--primary-text-color)] rounded-full px-5 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90 flex-shrink-0">
                        Aç
                    </a>
                </div>
            `).join('');

            // Her bir kategori için ana kartı oluştur ve içini uygulama listesiyle doldur
            return `
                <div class="card p-4 rounded-2xl shadow-sm">
                    <h3 class="category-title">${category}</h3>
                    <div class="mt-2">
                        ${appsInCategoryHTML}
                    </div>
                </div>
            `;
        }).join('');
    }
};

export default Apps;