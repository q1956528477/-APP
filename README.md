# 观己

这是「观己」Android 应用的工程仓库。应用使用 Capacitor 6 封装静态网页，核心代码在 `app/` 目录。

## 多终端协作

请以 Git 远程仓库作为唯一的工程交接方式，不再以压缩包传递源码。每次开始前先同步最新代码；完成一个可验证的小改动后，提交一条清晰的提交记录并推送。APK、AAB 和用户的备份数据应作为发布附件或单独文件传递，不应提交到源码仓库。

建议每次交接随提交说明写清：本次目标、改动文件、验证结果、尚未完成的事项，以及是否需要重新同步 Android 工程。

## 本地准备

需要 Node.js、JDK 17 和 Android SDK。配置好 JDK 后，`JAVA_HOME` 应指向 JDK 17 的安装目录。

```powershell
cd app
npm ci
npm run test
npm run build:bridges
npm run cap:sync
```

生成调试包：

```powershell
cd app/android
.\gradlew.bat assembleDebug
```

产物通常位于 `app/android/app/build/outputs/apk/debug/`。

生成正式发布包前，将 `app/android/signing.properties.example` 复制为 `app/android/signing.properties`，并仅在本机填入签名信息。该私密文件已被 Git 忽略。

```powershell
Copy-Item app/android/signing.properties.example app/android/signing.properties
```

## 安全约定

Android 签名私钥和各类本机配置不进入 Git 仓库。发布机器通过受控的私密渠道保存签名文件与配置；不要将它们打进源码压缩包或上传到远程仓库。
