---
sidebar_position: 1
slug: docs/Devops/cloud-services/aws-deploy-single-page-web-cdn.md
---

# Deploy SPA to AWS CDN

## Quick start

- Create S3 bucket
- Upload static web to bucket
- Create CloudFront distribution
- Create Route53 Hosted zones

## Details

### Create S3 bucket
#### Create bucket
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396117&authkey=%21AC8QTOYuqL6nBQA&width=1808&height=984)
*Sample: https://s3.console.aws.amazon.com/s3/home?region=ap-southeast-1#*
- (1) Click create bucket

#### Fill form
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396118&authkey=%21AC8QTOYuqL6nBQA&width=999999&height=1024)
*Sample: https://s3.console.aws.amazon.com/s3/bucket/create?region=ap-southeast-1*
- (1) Bucket name
- (2) Create bucket

### Upload static web to bucket
#### Create html
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396119&authkey=%21AC8QTOYuqL6nBQA&width=1076&height=331)

#### Upload html
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396120&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)

#### Upload success
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396121&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)
*Sample: https://s3.console.aws.amazon.com/s3/upload/demo.crazytrau.com?region=ap-southeast-1*

### Create CloudFront distribution
#### Create distribution
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396122&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1129)

#### Fill distribution form
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396123&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=4944)
- (1) select s3 bucket
- (2) name
- (3) OAI to access S3 bucket
- (4) select create OAI
- (5) create OAI
- (6) automatically update bucket policy 
- (7) automatically redirect http -> https 
- (8) enable security protections
- (9) enter CNAME
- (10) select SSL certificate (if not available create via [Certificate Manager](https://aws.amazon.com/certificate-manager/))
- (11) root object when accessing `\`
- (12) create

#### Create successfully
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396126&authkey=%21AC8QTOYuqL6nBQA&width=1816&height=1016)
- (1) Distribution status (change to `Enabled` to use)

#### Create cloudfront error page
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396124&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1016)

#### Fill error page form
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396125&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=979)
- (1) status 403
- (2) select custom error response 
- (3) if using SPA routers will redirect to index.html, if using SSR will access static pages by route

### Create Route53 Hosted zones 
#### Create hosted zones record
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396127&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=1599)


#### Fill hosted zones record form
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396129&authkey=%21AC8QTOYuqL6nBQA&width=1817&height=980)
- (1) domain/ subdomain
- (2) alias -> use AWS resource
- (3) select cloudfront distribution type
- (4) select created distribution
- (5) create

### Result
![image](https://onedrive.live.com/embed?resid=7697E3973F0F969B%21396128&authkey=%21AC8QTOYuqL6nBQA&width=1909&height=1051)
*Sample: https://demo.crazytrau.com*