---
sidebar_position: 1
slug: docs/Devops/cloud-services/aws-deploy-single-page-web-cdn.md
---

# Deploy SPA to AWS CDN

## Quick start

- Tạo S3 bucket
- Upload static web to bucket
- Tạo Cloudfront distribution
- Tạo Route53 Hosted zones

## Chi tiết

### Tạo S3 bucket
#### Tạo bucket
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396117&authkey=%21AC8QTOYuqL6nBQA&width=1808&height=984)
*Sample: https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-1#*
- (1) Bấm tạo bucket 

#### Điền form
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396118&authkey=%21AC8QTOYuqL6nBQA&width=999999&height=1024)
*Sample: https://s3.console.aws.amazon.com/s3/bucket/create?region=ap-southeast-1*
- (1) Tên bucket
- (2) Tạo bucket

### Upload static web to bucket
#### Tạo html
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396119&authkey=%21AC8QTOYuqL6nBQA&width=1076&height=331)

#### Upload html
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396120&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)

#### Upload success
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396121&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)
*Sample: https://s3.console.aws.amazon.com/s3/upload/demo.crazytrau.com?region=ap-southeast-1*

### Tạo Cloudfront distribution
#### Tạo create distribution
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396122&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1129)

#### Điền form distribution
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396123&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=4944)
- (1) chọn s3 bucket
- (2) tên
- (3) OAI to access S3 bucket
- (4) chọn tạo OAI
- (5) tạo OAI
- (6) tự động update bucket policy 
- (7) tự động chuyển http -> https 
- (8) kích hoạt security protections
- (9) nhập CNAME
- (10) chọn SSL certificate (nếu không có tạo bằng [Certificate Manager](https://aws.amazon.com/certificate-manager/))
- (11) root object khi truy cập `\`
- (12) tạo

#### Tạo thành công
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396126&authkey=%21AC8QTOYuqL6nBQA&width=1816&height=1016)
- (1) Trạng thái của distribution (chuyển về `Enabled` để sử dụng)

#### Tạo cloudfront error page
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396124&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1016)

#### Điền form error page
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396125&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)
- (1) status 403
- (2) chọn custom error response 
- (3) nếu dùng SPA các router sẽ chuyển về index.html còn dùng SSR thì sẽ truy cập theo route static pages

### Tạo Route53 Hosted zones 
#### Tạo hosted zones record
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396127&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1599)


#### Điền form hosted zones record
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396129&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=980)
- (1) domain/ subdomain
- (2) alias -> sử dụng AWS resource
- (3) chọn loại cloudfront distribution
- (4) chọn distribution đã tạo
- (5) tạo

### Kết quả
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396128&authkey=%21AC8QTOYuqL6nBQA&width=1909&height=1051)
*Sample: https://demo.crazytrau.com*