---
id: security
title: Bảo mật & Tuân thủ
sidebar_label: Security & Compliance
---

## Xác thực & Ủy quyền

- Định hướng: OAuth2/OIDC + JWT; đa tenant qua `SpaceService`.
- RBAC/ABAC cho quyền theo vai trò và thuộc tính.

## Bảo vệ dữ liệu

- Mã hóa in-transit (HTTPS) và at-rest (Keychain/Keystore cho token).
- Ẩn thông tin nhạy cảm trên log; quản lý secret qua CI/CD.

## Tuân thủ

- GDPR: consent, xoá dữ liệu theo yêu cầu.
- PCI DSS (nếu có payment): tách miền, tokenization, không lưu PAN.

## Thực hành an toàn ứng dụng

- Biện pháp: secure storage, certificate pinning (định hướng), jailbreak/root detection (tùy nhu cầu).

