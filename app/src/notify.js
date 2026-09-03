// 本地通知调度模块（打包为 notify.bundle.js，供 index.html 以全局 window.Notify 调用）
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

const REMIND_ID = 1001;

function isNative() {
  return !!(Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
}

async function requestPermission() {
  const res = await LocalNotifications.requestPermissions();
  return res.display === 'granted';
}

async function scheduleDaily(hour, minute) {
  // 先清掉旧的提醒，避免重复
  await cancelRemind();
  await LocalNotifications.schedule({
    notifications: [{
      id: REMIND_ID,
      title: '观己 · 记录精力',
      body: '今天还没记录精力状态，来打个分吧 🌿',
      schedule: {
        on: { hour, minute },
        allowWhileIdle: true,
        repeats: true,
      },
    }],
  });
  return true;
}

async function cancelRemind() {
  await LocalNotifications.cancel({ notifications: [{ id: REMIND_ID }] });
  return true;
}

// 暴露给纯静态前端
window.Notify = {
  isNative,
  requestPermission,
  scheduleDaily,
  cancelRemind,
};
