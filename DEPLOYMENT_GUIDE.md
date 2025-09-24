# 🚀 Consumable Alchemy Game - Deployment Guide

## Overview
This guide covers deploying the Consumable Alchemy Game to production using Vercel, including environment setup, domain configuration, and monitoring.

## Prerequisites
- Node.js 18+ installed
- Vercel account
- PayPal Developer account
- Gumroad account (optional)
- Google Analytics account (optional)
- Domain name (optional)

## 1. Environment Setup

### 1.1 Copy Environment Variables
```bash
cp env.example .env.local
```

### 1.2 Configure Environment Variables
Edit `.env.local` with your actual values:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME="Consumable Alchemy Game"
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID="your_paypal_client_id"
PAYPAL_CLIENT_SECRET="your_paypal_client_secret"

# Gumroad Configuration
NEXT_PUBLIC_GUMROAD_PRODUCT_ID="premium-alchemy-tools"
GUMROAD_ACCESS_TOKEN="your_gumroad_access_token"

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
NEXT_PUBLIC_MIXPANEL_TOKEN="your_mixpanel_token"

# Feature Flags
NEXT_PUBLIC_ENABLE_ADS="true"
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_PAYMENTS="true"
```

## 2. Vercel Deployment

### 2.1 Install Vercel CLI
```bash
npm i -g vercel
```

### 2.2 Login to Vercel
```bash
vercel login
```

### 2.3 Deploy to Vercel
```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? consumable-alchemy-game
# - In which directory is your code located? ./
```

### 2.4 Configure Environment Variables in Vercel
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all variables from `.env.local`

### 2.5 Redeploy with Environment Variables
```bash
vercel --prod
```

## 3. Domain Configuration

### 3.1 Add Custom Domain
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your domain (e.g., `consumable-alchemy.com`)
5. Follow DNS configuration instructions

### 3.2 DNS Configuration
Add these DNS records to your domain provider:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### 3.3 SSL Certificate
Vercel automatically provides SSL certificates for custom domains.

## 4. Payment Integration Setup

### 4.1 PayPal Setup
1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create a new app
3. Get Client ID and Secret
4. Add webhook URL: `https://your-domain.com/api/paypal/webhook`
5. Update environment variables

### 4.2 Gumroad Setup
1. Go to [Gumroad](https://gumroad.com/)
2. Create a product for premium features
3. Get product ID and access token
4. Update environment variables

## 5. Analytics Setup

### 5.1 Google Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property
3. Get Measurement ID
4. Update `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### 5.2 Mixpanel (Optional)
1. Go to [Mixpanel](https://mixpanel.com/)
2. Create a new project
3. Get project token
4. Update `NEXT_PUBLIC_MIXPANEL_TOKEN`

## 6. Monitoring and Maintenance

### 6.1 Vercel Analytics
- Built-in analytics in Vercel Dashboard
- Monitor performance, errors, and usage

### 6.2 Error Monitoring
- Check Vercel Function logs
- Monitor browser console for errors
- Set up alerts for critical errors

### 6.3 Performance Monitoring
- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Optimize based on real user data

## 7. Security Checklist

### 7.1 Environment Variables
- [ ] All sensitive data in environment variables
- [ ] No secrets in code repository
- [ ] Different values for development/production

### 7.2 HTTPS
- [ ] SSL certificate active
- [ ] Force HTTPS redirects
- [ ] Secure headers configured

### 7.3 API Security
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints

## 8. Performance Optimization

### 8.1 Build Optimization
```bash
# Analyze bundle size
npm run analyze

# Check for performance issues
npm run build
```

### 8.2 Image Optimization
- All images use Next.js Image component
- Proper sizing and lazy loading
- WebP format when possible

### 8.3 Caching
- Static assets cached by Vercel
- API responses cached appropriately
- Browser caching headers set

## 9. Backup and Recovery

### 9.1 Code Backup
- Code stored in Git repository
- Regular commits and pushes
- Tagged releases for rollbacks

### 9.2 Data Backup
- User data stored in localStorage (client-side)
- Consider database for production scale
- Regular backups of any server-side data

## 10. Scaling Considerations

### 10.1 Current Architecture
- Static site with client-side state
- No server-side database
- Suitable for thousands of users

### 10.2 Future Scaling
- Add database for user data persistence
- Implement server-side authentication
- Add CDN for global performance
- Consider microservices for high traffic

## 11. Troubleshooting

### 11.1 Common Issues

**Build Failures**
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear Next.js cache
rm -rf .next
npm run build
```

**Environment Variables Not Working**
- Check variable names (must start with `NEXT_PUBLIC_` for client-side)
- Verify values in Vercel Dashboard
- Redeploy after adding new variables

**Payment Issues**
- Verify PayPal/Gumroad credentials
- Check webhook URLs
- Test in sandbox mode first

### 11.2 Support Resources
- Vercel Documentation: https://vercel.com/docs
- Next.js Documentation: https://nextjs.org/docs
- PayPal Developer Docs: https://developer.paypal.com/docs

## 12. Launch Checklist

### 12.1 Pre-Launch
- [ ] All environment variables configured
- [ ] Payment integration tested
- [ ] Analytics tracking working
- [ ] Performance optimized
- [ ] Security measures in place
- [ ] Error monitoring active

### 12.2 Post-Launch
- [ ] Monitor error rates
- [ ] Check payment processing
- [ ] Verify analytics data
- [ ] Monitor performance metrics
- [ ] Gather user feedback

## 13. Maintenance Schedule

### 13.1 Daily
- Check error logs
- Monitor performance metrics
- Review payment processing

### 13.2 Weekly
- Update dependencies
- Review analytics data
- Check security alerts

### 13.3 Monthly
- Performance optimization review
- Security audit
- Backup verification
- User feedback analysis

---

## 🎉 Congratulations!

Your Consumable Alchemy Game is now deployed and ready for users! 

For support or questions, refer to the troubleshooting section or contact the development team.

**Live URL**: https://your-domain.com
**Vercel Dashboard**: https://vercel.com/dashboard
**Analytics**: https://analytics.google.com
