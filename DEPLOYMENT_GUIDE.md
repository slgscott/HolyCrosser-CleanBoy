# Holy Crosser V2 - Deployment Guide

## Production Connectivity Solution

### Issue Overview
Replit deployments may have network restrictions that prevent direct access to external databases. This guide addresses how Holy Crosser V2.8.2+ handles these restrictions while maintaining authentic data integrity.

### Connection Strategy

#### Primary Connection: Harbor Data Manager
- **Database**: Neon PostgreSQL (ep-green-brook-ade6jg4t.c-2.us-east-1.aws.neon.tech)
- **Purpose**: Real-time maritime data from Northumberland County Council
- **Configuration**: Enhanced timeouts, SSL handling, retry logic

#### Fallback Strategy: Local Cache
- **Database**: Replit PostgreSQL (local environment)
- **Purpose**: Authentic data cache for restricted environments
- **Activation**: Automatic when external access fails

### Deployment Environment Detection

The application automatically detects the deployment environment:

```typescript
const isProduction = process.env.NODE_ENV === 'production';
const isReplit = !!process.env.REPL_ID;
```

### Connection Configuration

#### Production Settings
- Connection timeout: 15 seconds
- Retry attempts: 3
- SSL: Configured for deployment compatibility
- Pool size: 5 connections maximum

#### Error Handling
1. Attempt external Harbor database connection
2. Log detailed error information
3. Fallback to local cache if external fails
4. Serve authentic cached data only
5. Return empty arrays if no authentic data available

### Data Integrity Standards

The application maintains strict data integrity:
- **No synthetic data**: Never generates placeholder information
- **Authentic only**: Serves only real maritime data from official sources
- **Clear indicators**: Empty states when data unavailable
- **Graceful degradation**: Fallback without compromising accuracy

### Deployment Checklist

#### Pre-Deployment
1. Verify local database is provisioned
2. Confirm environment variables are set
3. Test external database connectivity
4. Validate local cache is empty (will be populated as needed)

#### Post-Deployment
1. Monitor connection logs for external database status
2. Verify API endpoints return data
3. Check for fallback activation messages
4. Confirm data authenticity

### Troubleshooting

#### External Database Connection Failed
**Symptoms**: Logs show "Harbor database connection failed"
**Solution**: Application automatically uses local cache

#### No Data Available
**Symptoms**: Empty arrays returned from API
**Cause**: External database restricted AND no cached data
**Resolution**: Contact support for data synchronization

#### Deployment Network Restrictions
**Symptoms**: Consistent external connection timeouts
**Expected**: Normal in restricted deployment environments
**Impact**: Application functions with cached authentic data

### Monitoring Commands

#### Check Database Connectivity
```bash
curl https://your-app.replit.app/api/crossing-times/0
```

#### Verify Environment
Check deployment logs for:
- "Harbor database connection successful"
- "Harbor database connection failed"
- "Serving from local cache"

### Alternative Deployment Platforms

For unrestricted external database access, consider:
- Vercel with database add-on
- Railway with external database support
- AWS/GCP with VPC configuration
- Self-hosted with network access

### Data Synchronization

If external access is permanently restricted:
1. Export data from Harbor Data Manager
2. Import to local database via SQL scripts
3. Set up periodic data updates through authorized channels

### Support Information

For connectivity issues:
- Check deployment platform network policies
- Verify external database whitelist settings
- Review SSL certificate compatibility
- Contact platform support for external access requirements

---

**Version**: 2.8.2  
**Last Updated**: June 16, 2025  
**Deployment Target**: Replit Autoscale