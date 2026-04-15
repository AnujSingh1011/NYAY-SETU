# Nyay Setu Frontend - AWS CloudFront Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the Nyay Setu frontend to AWS S3 with CloudFront CDN distribution.

## Prerequisites
- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Frontend files (html, css, js)
- Domain name (optional, for custom domain setup)

## Step 1: Create S3 Bucket

```bash
# Set bucket name
BUCKET_NAME="nyay-setu-frontend-prod"
AWS_REGION="ap-south-1"

# Create S3 bucket
aws s3api create-bucket \
    --bucket $BUCKET_NAME \
    --region $AWS_REGION \
    --create-bucket-configuration LocationConstraint=$AWS_REGION

# Enable versioning for rollback capability
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled

# Block all public access (CloudFront will serve content)
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

## Step 2: Configure Bucket for Static Website Hosting

```bash
# Create bucket policy for CloudFront OAI access
cat > bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowCloudFrontOAI",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity/EXXXXX"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

# Apply bucket policy
aws s3api put-bucket-policy \
    --bucket $BUCKET_NAME \
    --policy file://bucket-policy.json
```

## Step 3: Upload Frontend Files to S3

```bash
# Sync frontend files to S3
aws s3 sync ./frontend s3://$BUCKET_NAME/ \
    --delete \
    --exclude "*.map" \
    --exclude ".git/*" \
    --exclude "node_modules/*" \
    --cache-control "public, max-age=3600" \
    --region $AWS_REGION

# Set HTML files with no-cache
aws s3 sync ./frontend s3://$BUCKET_NAME/ \
    --exclude "*" \
    --include "*.html" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html" \
    --region $AWS_REGION
```

## Step 4: Create CloudFront Distribution

### Option A: Using AWS Console

1. Go to CloudFront console
2. Click "Create distribution"
3. Configure:
   - **Origin domain**: Select your S3 bucket
   - **s3-bucket-access**: Create OAI (Origin Access Identity)
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS
   - **Caching**: Use cache behaviors for different file types
   - **Default root object**: index.html
   - **Custom error response**: 404 → /index.html (for SPA routing)

### Option B: Using AWS CLI

```bash
# Create OAI first
OAI=$(aws cloudfront create-cloud-front-origin-access-identity \
    --cloud-front-origin-access-identity-config CallerReference=$(date +%s),Comment="Nyay Setu OAI" \
    --query 'CloudFrontOriginAccessIdentity.Id' \
    --output text)

# Create distribution config
cat > cf-config.json <<'EOF'
{
    "CallerReference": "nyay-setu-prod",
    "Comment": "Nyay Setu Frontend Distribution",
    "Origins": {
        "Items": [
            {
                "Id": "S3Origin",
                "DomainName": "BUCKET_NAME.s3.ap-south-1.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/EXXXXX"
                }
            }
        ],
        "Quantity": 1
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3Origin",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": ["GET", "HEAD"]
        },
        "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
        "Compress": true
    },
    "CacheBehaviors": [
        {
            "PathPattern": "*.html",
            "TargetOriginId": "S3Origin",
            "ViewerProtocolPolicy": "redirect-to-https",
            "AllowedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            },
            "CachePolicyId": "4135ea3d-c35d-46eb-81d7-reeSJmXQQEE",
            "Compress": true
        },
        {
            "PathPattern": "*.js",
            "TargetOriginId": "S3Origin",
            "ViewerProtocolPolicy": "redirect-to-https",
            "AllowedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            },
            "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
            "Compress": true
        },
        {
            "PathPattern": "*.css",
            "TargetOriginId": "S3Origin",
            "ViewerProtocolPolicy": "redirect-to-https",
            "AllowedMethods": {
                "Quantity": 2,
                "Items": ["GET", "HEAD"]
            },
            "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
            "Compress": true
        }
    ],
    "CustomErrorResponses": [
        {
            "ErrorCode": 404,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 300
        },
        {
            "ErrorCode": 403,
            "ResponsePagePath": "/index.html",
            "ResponseCode": "200",
            "ErrorCachingMinTTL": 300
        }
    ],
    "DefaultRootObject": "index.html",
    "PriceClass": "PriceClass_100",
    "Enabled": true,
    "HttpVersion": "http2and3"
}
EOF

# Create distribution
aws cloudfront create-distribution --distribution-config file://cf-config.json
```

## Step 5: Set Up Custom Domain (Optional)

```bash
# Request SSL certificate in ACM
aws acm request-certificate \
    --domain-name yourdomain.com \
    --subject-alternative-names www.yourdomain.com \
    --validation-method DNS \
    --region us-east-1

# Update CloudFront distribution with custom domain
aws cloudfront update-distribution \
    --id DISTRIBUTION_ID \
    --distribution-config file://updated-cf-config.json

# Add CNAME record in Route 53
aws route53 change-resource-record-sets \
    --hosted-zone-id ZONE_ID \
    --change-batch '{
        "Changes": [{
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "yourdomain.com",
                "Type": "A",
                "AliasTarget": {
                    "HostedZoneId": "Z2FDTNDATAQYW2",
                    "DNSName": "dXXXXXX.cloudfront.net",
                    "EvaluateTargetHealth": false
                }
            }
        }]
    }'
```

## Step 6: Configure Cache Settings

### HTML Files (No Cache)
- Cached: 5 minutes
- Query string forwarding: None
- Compress: Yes

### CSS/JS Files (Long Cache)
- Cache: 1 year
- Query string forwarding: All
- Compress: Yes

### Images (Long Cache)
- Cache: 1 year
- Query string forwarding: None
- Compress: Yes

## Step 7: Invalidate CloudFront Cache

```bash
# Invalidate all files after deployment
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/*"

# Invalidate specific files
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/index.html" "/css/*" "/js/*"
```

## Step 8: Monitor and Optimize

### CloudWatch Monitoring
```bash
# View CloudFront metrics
aws cloudwatch get-metric-statistics \
    --namespace AWS/CloudFront \
    --metric-name Requests \
    --dimensions Name=DistributionId,Value=DISTRIBUTION_ID \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-02T00:00:00Z \
    --period 3600 \
    --statistics Sum
```

### Performance Optimization
1. Enable compression for all applicable file types
2. Set appropriate cache TTLs based on file type
3. Use CloudFront's geo-restriction for geographic targeting
4. Enable HTTP/2 and HTTP/3 for better performance
5. Use S3 Transfer Acceleration for faster uploads

## Deployment Script

```bash
#!/bin/bash

# deployment.sh - Automated deployment script

BUCKET_NAME="nyay-setu-frontend-prod"
AWS_REGION="ap-south-1"
DISTRIBUTION_ID="EXXXXX"

echo "Starting deployment..."

# 1. Sync files to S3
echo "1. Uploading files to S3..."
aws s3 sync ./frontend s3://$BUCKET_NAME/ \
    --delete \
    --exclude "*.map" \
    --exclude ".git/*" \
    --region $AWS_REGION

# 2. Update cache headers for HTML
echo "2. Setting cache headers for HTML files..."
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html" \
    --metadata-directive REPLACE \
    --region $AWS_REGION

# 3. Invalidate CloudFront
echo "3. Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
    --distribution-id $DISTRIBUTION_ID \
    --paths "/*"

echo "Deployment complete!"
echo "Frontend available at: https://d123xyz.cloudfront.net"
```

## Rollback Procedure

```bash
# If deployment has issues, you can quickly rollback

# 1. Restore from S3 versioning
aws s3api list-object-versions \
    --bucket $BUCKET_NAME \
    --output table

# 2. Copy previous version
aws s3api copy-object \
    --copy-source $BUCKET_NAME/VERSION_ID/index.html \
    --bucket $BUCKET_NAME \
    --key index.html

# 3. Invalidate CloudFront again
aws cloudfront create-invalidation \
    --distribution-id DISTRIBUTION_ID \
    --paths "/*"
```

## Troubleshooting

### Issue: Access Denied
**Solution**: Check OAI is properly configured in bucket policy

### Issue: 404 Not Found
**Solution**: Verify custom error response maps 404 to /index.html

### Issue: Slow Load Times
**Solution**: 
- Enable compression (gzip) in CloudFront
- Increase caching TTL for static assets
- Enable HTTP/2 and HTTP/3

### Issue: CORS Errors
**Solution**: Configure CORS in CloudFront headers or backend API configuration

## Security Best Practices

1. **Enable SSL/TLS**: Use ACM certificate for HTTPS
2. **Block Public Access**: All bucket public access disabled
3. **Version Control**: Enable S3 versioning for rollback capability
4. **OAI**: Use CloudFront Origin Access Identity for S3 access
5. **WAF**: Consider CloudFront with AWS WAF for protection
6. **Logging**: Enable CloudFront and S3 access logging
7. **Encryption**: Use S3 default encryption and KMS keys

## Monitoring Checklist

- [ ] CloudFront metrics show expected traffic
- [ ] Error rates are below 1%
- [ ] Cache hit ratio > 80%
- [ ] P95 latency < 500ms
- [ ] S3 costs are within budget
- [ ] No 404 errors for assets
- [ ] SSL certificate is valid

## References

- AWS S3 Documentation: https://docs.aws.amazon.com/s3/
- CloudFront Documentation: https://docs.aws.amazon.com/cloudfront/
- AWS CLI Reference: https://docs.aws.amazon.com/cli/
