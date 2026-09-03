// 原生能力桥接（打包为 native.bundle.js，暴露 window.Native）
import { App } from '@capacitor/app';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

function isNative() {
  return !!(Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
}

// 返回键：注册回调，回调收到 canGoBack（WebView 是否有历史）
function onBackButton(cb) {
  App.addListener('backButton', ({ canGoBack }) => {
    cb(!!canGoBack);
  });
}

function exitApp() {
  App.exitApp();
}

// 数据备份：写/读到应用 Documents 目录（覆盖安装会保留，卸载才清）
async function writeBackup(json) {
  await Filesystem.writeFile({
    path: 'guanji-backup.json',
    data: json,
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
  return true;
}

async function readBackup() {
  const res = await Filesystem.readFile({
    path: 'guanji-backup.json',
    directory: Directory.Documents,
    encoding: Encoding.UTF8,
  });
  return res.data;
}

window.Native = { isNative, onBackButton, exitApp, writeBackup, readBackup };
