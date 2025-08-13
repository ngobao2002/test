# Vulnerable Web Application

## ⚠️ CẢNH BÁO BẢO MẬT

**ỨNG DỤNG NÀY ĐƯỢC THIẾT KẾ VỚI CÁC LỖ HỔNG BẢO MẬT CHỦ Ý!**

Ứng dụng này được tạo ra chỉ cho mục đích học tập, đào tạo bảo mật và kiểm thử các công cụ phân tích bảo mật như SonarQube, Semgrep. **KHÔNG BAO GIỜ** sử dụng trong môi trường production!

## Kiến trúc

- **Backend**: ASP.NET Core Web API (.NET 9) 
- **Frontend**: Angular 14 với TypeScript
- **Database**: SQL Server (LocalDB hoặc SQL Server Express)

## Các lỗ hổng bảo mật được thêm chủ ý

### 1. SQL Injection
- **Vị trí**: `VulnerableApp.API/Services/UserService.cs`
- **Mô tả**: Sử dụng raw SQL với string concatenation
- **Ví dụ**: Thử nhập `' OR '1'='1' --` vào trường username

### 2. Hardcoded Credentials
- **Vị trí**: Nhiều nơi trong code
  - `Program.cs`: Connection string và JWT secret
  - `appsettings.json`: Admin credentials
  - `environment.ts`: API keys và passwords
- **Mô tả**: Thông tin đăng nhập được ghi cứng trong source code

### 3. Cross-Site Scripting (XSS)
- **Vị trí**: Angular components
  - `login.component.ts`: Welcome message và comments
  - `profile.component.ts`: User bio
  - `dashboard.component.ts`: Search results
- **Ví dụ**: Thử nhập `<script>alert('XSS')</script>` vào các trường input

### 4. Insecure JWT Handling
- **Vị trí**: `Program.cs` và `UserService.cs`
- **Lỗi**:
  - Tắt tất cả JWT validation
  - Token có thời hạn 1 năm
  - Secret key được hardcode

### 5. Insecure Deserialization
- **Vị trí**: `AuthController.cs` - endpoint `/deserialize`
- **Mô tả**: Sử dụng Newtonsoft.Json với `TypeNameHandling.All`

### 6. Thư viện có lỗ hổng
- **jQuery 2.1.4**: Có nhiều lỗ hổng XSS đã biết
- **Lodash 4.17.4**: Có lỗ hổng prototype pollution
- **Newtonsoft.Json 10.0.1**: Phiên bản cũ có lỗ hổng

### 7. Thiếu Input Validation
- Không validate dữ liệu đầu vào
- Không sanitize HTML content
- Không check authorization

### 8. Các lỗi bảo mật khác
- CORS cho phép tất cả origins
- Exposed debug endpoints
- Plain text passwords
- Không có rate limiting
- Error messages tiết lộ thông tin nhạy cảm

## Cài đặt và chạy

### Yêu cầu hệ thống
- .NET 9 SDK
- Node.js 16+
- SQL Server Express hoặc LocalDB
- Angular CLI: `npm install -g @angular/cli`

### Cài đặt .NET 9 SDK

#### **Cách 1: Tải từ trang chính thức**
```bash
# Truy cập: https://dotnet.microsoft.com/download/dotnet/9.0
# Tải và cài đặt ".NET 9.0 SDK" cho Windows
# Sau khi cài đặt, restart terminal và kiểm tra:
dotnet --version
```

#### **Cách 2: Sử dụng winget (Windows)**
```bash
winget install Microsoft.DotNet.SDK.9
```

#### **Cách 3: Sử dụng Chocolatey**
```bash
choco install dotnet-9.0-sdk
```

### Backend (API)

1. Điều hướng đến thư mục API:
```bash
cd VulnerableApp.API
```

2. Cài đặt dependencies:
```bash
dotnet restore
```

3. Chạy ứng dụng:
```bash
dotnet run
```

API sẽ chạy tại: `http://localhost:5000`

### Frontend (Angular)

1. Điều hướng đến thư mục Frontend:
```bash
cd VulnerableApp.Frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
ng serve
```

Frontend sẽ chạy tại: `http://localhost:4200`

## Sử dụng

### Đăng nhập
- **Admin**: username=`admin`, password=`admin123`
- **User**: username=`user`, password=`password`

### Test các lỗ hổng

#### SQL Injection:
1. Vào trang login
2. Nhập username: `' OR '1'='1' --`
3. Password: bất kỳ
4. Click Login

#### XSS:
1. Vào trang login
2. Thêm comment: `<script>alert('XSS')</script>`
3. Hoặc thêm vào URL: `?welcome=<script>alert('XSS')</script>`

#### Insecure Deserialization:
1. Vào Profile page
2. Nhập JSON data trong "Deserialization Test"
3. Thử payload JSON malicious

## Phân tích bảo mật

### SonarQube
```bash
# Cài đặt SonarQube scanner
dotnet tool install --global dotnet-sonarscanner

# Chạy phân tích
dotnet sonarscanner begin /k:"VulnerableApp" /d:sonar.host.url="http://localhost:9000"
dotnet build
dotnet sonarscanner end
```

### Semgrep
```bash
# Cài đặt Semgrep
pip install semgrep

# Chạy phân tích
semgrep --config=auto .
```

## Cấu trúc thư mục

```
sonarqube/
├── VulnerableApp.sln
├── VulnerableApp.API/
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   ├── Services/
│   ├── Program.cs
│   └── appsettings.json
├── VulnerableApp.Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── environments/
│   │   └── index.html
│   ├── package.json
│   └── angular.json
└── README.md
```

## Lưu ý quan trọng

1. **CHỈ SỬ DỤNG CHO HỌC TẬP**: Ứng dụng này có chứa nhiều lỗ hổng bảo mật nghiêm trọng
2. **KHÔNG DEPLOY**: Không bao giờ deploy lên môi trường thực tế
3. **TEST LOCAL**: Chỉ chạy trên máy local, không mở ra internet
4. **HỌC TẬP**: Sử dụng để học cách phát hiện và sửa các lỗ hổng bảo mật

## Tài liệu tham khảo

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SonarQube Documentation](https://docs.sonarqube.org/)
- [Semgrep Rules](https://semgrep.dev/explore)

---

**Lưu ý**: Ứng dụng này được thiết kế để có thể phát hiện được bởi các công cụ phân tích bảo mật. Mỗi lỗ hổng đều được comment rõ ràng trong code để dễ dàng tìm hiểu và phân tích.
