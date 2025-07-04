# Folder structure

```md
- components  
  ├── auth  
  ├── managers  
  └── users  

- directives  
  ├── auth  
  ├── managers  
  └── users  

- services  
  ├── auth  
  ├── managers  
  └── users  

- models
```

## Backend certificate

```bash
choco install mkcert
mkcert --install
mkcert --pkcs12 địachỉapi
```

- Dùng file .p12 để import vào IIS và sử dụng cho api
- Mật khẩu mặc định là `changeit`

## Frontend certificate

```bash
ng serve --ssl
```

- Truy cập `https://localhost:4200` với trình duyệt và xuất ra certificate
- Chạy lệnh `inetcpl.cpl` => `Content` => `Certificates` => `Trusted Root Certication Authorities` => `Import` => chọn certificate đã xuất ở bước trên
- Chạy lại `ng serve --ssl`
