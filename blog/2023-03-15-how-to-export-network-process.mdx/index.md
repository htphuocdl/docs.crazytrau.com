---
slug: how-to-export-network-process
title: How to export network process
authors: [crazytrau]
tags: [crazytrau, docusaurus, devtool, performance]
---
## Quick note

### Xuất HAR
1. Mở trình duyệt
2. Bấm `F12` hoặc `Chuột phải + Inspect`
3. Bấm `Netwrok` tab
4. Chọn `Export HAR ...`

<img src="https://bl6pap004files.storage.live.com/y4myMnmRksNpkY5Jun4onhk3gsg8AmyyYiZB-MMNINh-TX31cuiBbcMWLK59CjhaOX3ayMAUPcnY5jFBZq6oeQLXmn9HTxsMh0zFbaWG6rLJ30t8MJFUZXG0opGGcMRpkPoO16l94Az_RBMxe-u_8BTrnoeTJMZRdGG2AnT-V5_5nrEwIBR4lAY0YebmsIl0qyU?width=1024&height=560&cropmode=none" width="100%" height="auto" />


### Nhập HAR
1. Mở trình duyệt
2. Bấm `F12` hoặc `Chuột phải + Inspect`
3. Bấm `Netwrok` tab
4. Chọn `Import HAR ...`

<iframe src="https://onedrive.live.com/embed?cid=7697E3973F0F969B&resid=7697E3973F0F969B%21394368&authkey=ANz4xvosR3pQSs0" width="100%" height="300" frameborder="0" scrolling="no"></iframe>

## Tính năng
- Dùng để tối ưu hiệu xuất cho website
- Xác định thứ tự, thời gian load dữ liệu cho từng luồng
- Đưa cho dev team debug việc xảy ra lỗi khi ở trên production

## Note
- `HAR` sẽ chứa toàn bộ thông tin website nên bạn cần cẩn thận khi đưa cho người khác: token, card number, ...

## Reference sources:
- https://support.zendesk.com/hc/en-us/articles/4408828867098-Generating-a-HAR-file-for-troubleshooting