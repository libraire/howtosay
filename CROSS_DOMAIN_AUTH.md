# 跨域认证配置指南

## 问题描述
- **登录服务**: `app.bytegush.com` (Laravel backend)
- **前端应用**: `say.bytegush.com` (Next.js on Vercel)
- **需求**: 在 app.bytegush.com 登录后，say.bytegush.com 能够获取登录状态

## 解决方案

### 1. 后端配置 (app.bytegush.com - Laravel)

#### 1.1 设置 Cookie Domain
在 `config/session.php` 中配置：

```php
'domain' => env('SESSION_DOMAIN', '.bytegush.com'),
'secure' => env('SESSION_SECURE_COOKIE', true),
'same_site' => 'none', // 允许跨站点发送 cookie
```

在 `.env` 中添加：
```env
SESSION_DOMAIN=.bytegush.com
SESSION_SECURE_COOKIE=true
```

#### 1.2 配置 CORS
在 `config/cors.php` 中：

```php
'paths' => ['api/*', 'hts/api/*'],
'allowed_origins' => [
    'https://say.bytegush.com',
    'http://localhost:3000', // 开发环境
],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true, // 重要：允许发送 credentials
```

#### 1.3 登录成功后重定向
在登录控制器中，登录成功后重定向到前端并带上成功标记：

```php
public function login(Request $request)
{
    // ... 验证和登录逻辑 ...
    
    $redirectUrl = $request->input('redirect_url', 'https://say.bytegush.com');
    
    // 添加成功标记
    $redirectUrl .= (parse_url($redirectUrl, PHP_URL_QUERY) ? '&' : '?') . 'login_success=true';
    
    return redirect($redirectUrl);
}
```

#### 1.4 添加用户信息接口
创建一个接口用于验证 session 并返回用户信息：

```php
// routes/api.php 或 routes/web.php
Route::get('/hts/api/v1/user/profile', function (Request $request) {
    if (!Auth::check()) {
        return response()->json(['error' => 'Unauthorized'], 401);
    }
    
    $user = Auth::user();
    
    return response()->json([
        'email' => $user->email,
        'isPro' => $user->isPro ?? false,
        'expire' => $user->expire ?? null,
    ]);
})->middleware('auth');
```

#### 1.5 添加登出接口
```php
Route::post('/hts/api/v1/auth/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    
    return response()->json(['success' => true]);
})->middleware('auth');
```

### 2. 前端配置 (say.bytegush.com - Next.js)

#### 2.1 已完成的更改
✅ 创建了 `CustomAuthProvider` 来管理跨域认证状态
✅ 更新了 `AuthButton` 使用自定义认证
✅ 在 `layout.tsx` 中添加了 `CustomAuthProvider`

#### 2.2 Next.js 配置
在 `next.config.mjs` 中添加 API 代理（如果需要）：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/hts/api/:path*',
        destination: 'https://app.bytegush.com/hts/api/:path*',
      },
    ]
  },
}

export default nextConfig
```

### 3. 测试流程

1. **登录流程**:
   - 用户在 `say.bytegush.com` 点击 "Sign In"
   - 跳转到 `app.bytegush.com/auth/login?redirect_url=https://say.bytegush.com/current-page`
   - 用户在 `app.bytegush.com` 完成登录
   - 后端设置 `bytegush_session` cookie (domain=.bytegush.com)
   - 重定向回 `say.bytegush.com/current-page?login_success=true`
   - 前端检测到 `login_success=true`，调用 `/hts/api/v1/user/profile` 获取用户信息
   - UI 更新显示用户邮箱

2. **登出流程**:
   - 用户点击 "Sign Out"
   - 调用 `/hts/api/v1/auth/logout`
   - 清除本地 cookie
   - UI 更新显示 "Sign In"

### 4. 调试检查清单

- [ ] Cookie domain 设置为 `.bytegush.com`
- [ ] Cookie secure 设置为 `true` (HTTPS)
- [ ] Cookie SameSite 设置为 `none`
- [ ] CORS 配置允许 `say.bytegush.com`
- [ ] CORS 配置 `supports_credentials` 为 `true`
- [ ] 登录后重定向 URL 包含 `login_success=true`
- [ ] `/hts/api/v1/user/profile` 接口返回正确的用户信息
- [ ] 浏览器开发者工具中可以看到 `bytegush_session` cookie

### 5. 常见问题

**Q: Cookie 无法跨域共享？**
A: 确保 cookie domain 设置为 `.bytegush.com`（注意前面的点），并且 secure 和 SameSite 配置正确。

**Q: CORS 错误？**
A: 检查后端 CORS 配置，确保 `supports_credentials` 为 `true`，并且前端请求带上 `credentials: 'include'`。

**Q: 登录后状态不更新？**
A: 检查是否正确重定向并带上 `login_success=true` 参数，前端会监听这个参数来刷新认证状态。

**Q: 开发环境测试？**
A: 本地开发时可能需要修改 hosts 文件或使用 ngrok 等工具来模拟域名环境。
