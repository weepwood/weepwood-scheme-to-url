// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Change from 'components/Change.vue'


const routes = [
    { path: '/', name: 'change', component: Change },
    { path: '/history', name: 'history', component: () => import('components/History.vue') },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 全局前置守卫
// router.afterEach((to, from) => {
//     // 获取当前时间
//     let time = Date.now();
//     // 获取跳转的 scheme
//     let scheme = window.location.hash.substring(1);

//     toScheme(scheme);

//     // URL 跳转
//     function toScheme(scheme) {
//         let hash = document.getElementById("hash");
//         if (scheme) {
//             window.location.replace(scheme);
//             // window.open(scheme);
//             hash.innerHTML = `URL Scheme Link: <a href=${scheme}>${decodeURIComponent(
//                 scheme
//             )}</a>`;
//             update_history();
//         } else {
//             hash.innerHTML = `URL Scheme Link: NONE`;
//         }
//     }

//     // 监听 url 中 hash 变化，变化后跳转
//     window.addEventListener("hashchange", function (event) {
//         scheme = window.location.hash.substring(1);
//         toScheme(scheme);
//     });

//     // 更新历史记录
//     function update_history() {
//         let scheme_history = JSON.parse(localStorage.getItem("scheme_history"));
//         // 如果没有历史记录
//         if (!scheme_history) {
//             const scheme_info = {
//                 scheme: scheme,
//                 count: 1,
//                 recently: time,
//             };
//             localStorage.setItem("scheme_history", JSON.stringify([scheme_info]));
//         } else {
//             let scheme_index = scheme_history.findIndex(
//                 (obj) => obj.scheme === scheme
//             );
//             if (scheme_index === -1) {
//                 // 历史记录不存在 scheme 对象，则创建新对象并添加到数组中
//                 scheme_history.push({ scheme: scheme, count: 1, recently: time });
//             } else {
//                 // 更新历史记录
//                 scheme_history[scheme_index].count++;
//                 scheme_history[scheme_index].recently = time;
//             }

//             // 保存到 localStorage
//             localStorage.setItem(
//                 "scheme_history",
//                 JSON.stringify(scheme_history)
//             );
//         }
//     }

//     let historyDiv = document.getElementById("history");
//     let scheme_history = JSON.parse(localStorage.getItem("scheme_history"));
//     historyDiv.innerHTML = JSON.stringify(scheme_history);
// })

export default router
