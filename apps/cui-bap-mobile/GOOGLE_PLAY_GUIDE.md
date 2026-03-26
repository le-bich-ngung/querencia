# Đưa Cùi Bắp lên Google Play — React Native CLI

## Cần chuẩn bị
- [ ] Android Studio (https://developer.android.com/studio)
- [ ] JDK 17+ (Android Studio thường cài sẵn)
- [ ] Google Play Console account ($25 một lần)
- [ ] Google Firebase project (cho FCM push notification)

---

## Bước 1 — Setup môi trường (1 lần)

```bash
# Cài Android Studio → mở SDK Manager → cài Android 14 SDK
# Thêm vào ~/.zshrc hoặc ~/.bashrc:
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Verify
adb --version
```

---

## Bước 2 — Install dependencies

```bash
cd apps/cui-bap-mobile
npm install

# iOS (chỉ cần nếu build iOS sau này)
# cd ios && pod install
```

---

## Bước 3 — Firebase setup (FCM)

1. Vào https://console.firebase.google.com → Tạo project "cuibap"
2. Add Android app: `com.querencia.cuibap`
3. Download `google-services.json` → bỏ vào `android/app/`
4. Trong Firebase Console → Cloud Messaging → bật FCM v1

---

## Bước 4 — Test trên emulator hoặc điện thoại thật

```bash
# Cắm điện thoại vào máy tính (bật USB debugging)
npm run android

# Hoặc dùng emulator Android Studio
```

---

## Bước 5 — Tạo keystore để ký app (1 lần duy nhất)

```bash
cd android
keytool -genkey -v -keystore querencia-release.keystore \
  -alias cuibap -keyalg RSA -keysize 2048 -validity 10000

# Điền thông tin (quan trọng: lưu password keystore này lại)
# Bỏ file querencia-release.keystore vào android/app/
```

Thêm vào `android/gradle.properties`:
```properties
MYAPP_UPLOAD_STORE_FILE=querencia-release.keystore
MYAPP_UPLOAD_KEY_ALIAS=cuibap
MYAPP_UPLOAD_STORE_PASSWORD=YOUR_STORE_PASSWORD
MYAPP_UPLOAD_KEY_PASSWORD=YOUR_KEY_PASSWORD
```

Thêm vào `android/app/build.gradle`:
```gradle
android {
  ...
  signingConfigs {
    release {
      storeFile file(MYAPP_UPLOAD_STORE_FILE)
      storePassword MYAPP_UPLOAD_STORE_PASSWORD
      keyAlias MYAPP_UPLOAD_KEY_ALIAS
      keyPassword MYAPP_UPLOAD_KEY_PASSWORD
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      shrinkResources true
    }
  }
}
```

---

## Bước 6 — Build AAB (Android App Bundle)

```bash
cd android
./gradlew bundleRelease

# File output: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Bước 7 — Upload lên Google Play Console

1. https://play.google.com/console → Create app
2. App name: **Cui Bap** (không dấu để search được)
3. Default language: Vietnamese — hiện "Cùi Bắp" cho người dùng VN
4. Category: Communication, Free

### Content rating questionnaire:
- Không có user-generated content bạo lực
- Có user chat → chọn "Social" → rating sẽ là Everyone/Teen

### Upload assets:
- Icon 512x512 PNG (chạy `node scripts/generate-logo.js` để tạo)
- Feature graphic 1024x500 PNG
- Screenshots điện thoại (ít nhất 2)

### Short description (80 chars):
```
Nhắn tin riêng tư, không quảng cáo. Hệ sinh thái Querencia.
```

---

## Bước 8 — Release tracks

1. **Internal testing** → upload .aab → thêm email test của bạn → test 1-2 ngày
2. **Closed testing (Alpha)** → mở rộng thêm người test
3. **Production** → Google review 1-3 ngày → live

---

## App name localization (tên có dấu cho người dùng VN)

File `android/app/src/main/res/values/strings.xml` (đã có):
```xml
<string name="app_name">Cui Bap</string>  <!-- Google Play search -->
```

File `android/app/src/main/res/values-vi/strings.xml` (đã có):
```xml
<string name="app_name">Cùi Bắp</string>  <!-- Hiện trên điện thoại đặt tiếng Việt -->
```

→ **Kết quả:** Người search "Cui Bap" hoặc "Cùi Bắp" đều tìm thấy.
   Người dùng VN thấy tên app là "Cùi Bắp" trên màn hình chính.

---

## Lưu ý bảo mật

⚠️ **KHÔNG commit những file này lên Git:**
- `android/app/querencia-release.keystore`
- `android/gradle.properties` (chứa password)
- `android/app/google-services.json`

Thêm vào `.gitignore`:
```
android/app/*.keystore
android/app/google-services.json
android/gradle.properties
```

---

## Update app (release mới)

1. Tăng `versionCode` và `versionName` trong `android/app/build.gradle`
2. Build lại: `./gradlew bundleRelease`
3. Upload .aab mới lên Google Play Console → Production


---

# iOS Setup — App Store với Apple Sign-In

## Yêu cầu
- Apple Developer account: $99/năm (https://developer.apple.com)
- Xcode 15+ (chỉ chạy trên macOS)

## Bước 1 — Apple Developer Console

1. https://developer.apple.com/account → **Identifiers** → `+` → **App IDs**
2. Bundle ID: `com.querencia.cuibap`
3. Capabilities: bật **Sign In with Apple**

## Bước 2 — Enable trong Xcode

Mở `ios/CuiBap.xcworkspace` trong Xcode:
1. Target → **Signing & Capabilities** → `+` → **Sign In with Apple**
2. Xcode tự thêm entitlement

## Bước 3 — Build iOS

```bash
cd ios && pod install
cd ..
npx react-native run-ios
```

## Bước 4 — App Store Connect

1. https://appstoreconnect.apple.com → New App
2. Bundle ID: `com.querencia.cuibap`
3. Tên: **Cùi Bắp** (App Store hỗ trợ Unicode đầy đủ, khác Google Play)
4. Primary language: Vietnamese
5. Category: Social Networking

## App Store Review Guidelines — App 4.8 (Sign In with Apple)

App Store yêu cầu: nếu app có third-party login (Google), **PHẢI** có Apple Sign-In.
Thứ tự hiển thị: Apple phải xuất hiện trước Google (đã làm đúng trong LoginScreen).

## Localization — tên app iOS

Trong `ios/CuiBap/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>Cùi Bắp</string>
```

iOS hỗ trợ Unicode nên tên hiển thị có dấu đầy đủ không cần workaround.
