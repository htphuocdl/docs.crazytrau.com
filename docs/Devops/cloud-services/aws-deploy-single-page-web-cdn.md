---
sidebar_position: 1
slug: docs/Devops/cloud-services/aws-deploy-single-page-web-cdn.md
---

# Deploy SPA to AWS CDM

## Quick start

- Tạo S3 bucket
- Upload files to bucket
- Tạo Distributions
- Tạo Route53 Hosted zones

## Chi tiết

### Tạo bucket
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396117&authkey=%21AC8QTOYuqL6nBQA&width=1808&height=984)
*Sample: https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-1#*
- (1) Bấm tạo bucket 

### Điền form
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396118&authkey=%21AC8QTOYuqL6nBQA&width=999999&height=1024)
*Sample: https://s3.console.aws.amazon.com/s3/bucket/create?region=ap-southeast-1*
- (1) Tên bucket
- (2) Tạo bucket

### Tạo html
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396119&authkey=%21AC8QTOYuqL6nBQA&width=1076&height=331)

### Upload html
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396120&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)

### Upload success
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396121&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)
*Sample: https://s3.console.aws.amazon.com/s3/upload/demo.crazytrau.com?region=ap-southeast-1*

### Tạo create distribution
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396122&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1129)

### Điền form distribution
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396123&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=4944)

### Tạo thành công
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396126&authkey=%21AC8QTOYuqL6nBQA&width=1816&height=1016)

### Tạo cloudfront error page
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396124&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1016)

### Điền form error page
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396125&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)

### Tạo hosted zones record
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396127&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1599)

### Điền form hosted zones record
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396129&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=980)

### Kết quả
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396128&authkey=%21AC8QTOYuqL6nBQA&width=1909&height=1051)
*Sample: https://demo.crazytrau.com*