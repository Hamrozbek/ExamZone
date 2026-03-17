import axios from 'axios';

const api = axios.create({
    baseURL: typeof window !== 'undefined' ? '/api' : process.env.NEXT_PUBLIC_API_BASE_URL,
});

// REQUEST INTERCEPTOR (Token qo'shish uchun)
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('admin_token');
        config.headers['ngrok-skip-browser-warning'] = 'true';
        config.headers['Accept'] = 'application/json';

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => Promise.reject(error));

// RESPONSE INTERCEPTOR (Xatolarni ushlash uchun - FAQAT BIR MARTA YOZILADI)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 xatosi (avtorizatsiyadan o'tmagan bo'lsa)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.clear();
                window.location.href = '/login';
            }
        }

        // Redux payload xatosini oldini olish uchun xatoni to'g'ri shaklda qaytarish
        const errorMessage = error.response?.data || error.message || "Noma'lum xatolik";
        return Promise.reject(errorMessage);
    }
);

export default api;