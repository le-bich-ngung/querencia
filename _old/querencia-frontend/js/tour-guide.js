/**
 * QUERENCIA PRODUCT TOUR
 * Tự động hóa hướng dẫn 4 ngôn ngữ, lưu trạng thái để không làm phiền.
 */

const TourGuide = {
    steps: [
        {
            element: '.nav-logo',
            vi: 'Chào mừng bạn đến với Querencia - Nơi thắp sáng tri thức.',
            en: 'Welcome to Querencia - Where wisdom is ignited.',
            ja: 'Querenciaへようこそ - 知識が灯る場所。',
            es: 'Bienvenido a Querencia - Donde la sabiduría se enciende.'
        },
        {
            element: '#tools-grid',
            vi: 'Tại đây có 36 công cụ chuyên nghiệp phục vụ nhu cầu của bạn.',
            en: 'Here are 36 professional tools to serve your needs.',
            ja: 'あなたのニーズに応える36の専門ツールがここにあります。',
            es: 'Aquí hay 36 herramientas profesionales para sus necesidades.'
        },
        {
            element: '#sf-fab', // Nút của smart-find.js
            vi: 'Đừng quên dùng "Smart Find" để tìm kiếm nhanh trên điện thoại nhé.',
            en: 'Don\'t forget to use "Smart Find" for quick searching on mobile.',
            ja: 'モバイルでのクイック検索には「Smart Find」をお忘れなく。',
            es: 'No olvide usar "Smart Find" para búsquedas rápidas en el móvil.'
        },
        {
            element: 'a[href="pricing.html"]',
            vi: 'Chỉ $1/tuần để sở hữu trọn bộ vũ khí Pro mạnh mẽ.',
            en: 'Only $1/week to own the full set of powerful Pro tools.',
            ja: 'たったの週1ドルで、強力なProツールをすべて手に入れましょう。',
            es: 'Solo $1/semana para poseer el conjunto completo de herramientas Pro.'
        }
    ],

    init() {
        const hasSeenTour = localStorage.getItem('querencia_tour_seen');
        if (!hasSeenTour) {
            this.start();
        }
    },

    start() {
        const lang = localStorage.getItem('querencia_lang') || 'en';
        console.log(`Bắt đầu Tour hướng dẫn bằng tiếng: ${lang}`);
        
        // Logic hiển thị Tour (Ngưng có thể dùng Driver.js hoặc tự viết UI nổi)
        this.renderStep(0, lang);
    },

    renderStep(index, lang) {
        if (index >= this.steps.length) {
            localStorage.setItem('querencia_tour_seen', 'true');
            return;
        }

        const step = this.steps[index];
        const el = document.querySelector(step.element);
        if (!el) return this.renderStep(index + 1, lang);

        // Hiển thị bong bóng hướng dẫn (Tooltip)
        const tooltip = document.createElement('div');
        tooltip.className = 'querencia-tour-tip';
        tooltip.innerHTML = `
            <div style="padding:15px; background:var(--sage-pale); border:1px solid var(--sage); border-radius:12px; position:absolute; z-index:10001;">
                <p style="color:var(--sage-dark); font-size:0.9rem;">${step[lang]}</p>
                <button onclick="this.parentElement.remove(); TourGuide.renderStep(${index + 1}, '${lang}')" 
                        style="margin-top:10px; border:none; background:var(--sage); color:white; padding:5px 10px; border-radius:5px; cursor:pointer;">
                    ${lang === 'vi' ? 'Tiếp tục' : 'Next'}
                </button>
            </div>
        `;
        
        // Gắn vào gần Element
        const rect = el.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        document.body.appendChild(tooltip);
    }
};

window.addEventListener('DOMContentLoaded', () => TourGuide.init());