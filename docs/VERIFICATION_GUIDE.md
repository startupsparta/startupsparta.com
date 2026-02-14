# Company Verification Guide

StartupSparta offers two ways to verify your company domain to build trust with investors and the community.

## Why Verify Your Company?

✅ **Build Trust** - Show that your company is legitimate  
✅ **Stand Out** - Verified tokens get highlighted with badges  
✅ **Increase Visibility** - Verified companies appear higher in search results  
✅ **Investor Confidence** - Verification signals professionalism and authenticity  

## Verification Methods

### 🔷 Email Verification (Quick & Easy)

**Best for:** Companies that want quick verification and have access to their company email.

**Time Required:** Under 2 minutes  
**Trust Level:** Medium  
**Badge:** Blue "Email Verified" badge

**How it works:**
1. Enter your company email address (e.g., john@yourcompany.com)
2. Receive a 6-digit verification code via email
3. Enter the code (it expires in 5 minutes)
4. Done! Your token will show the "Email Verified" badge

**Requirements:**
- Must use your company email domain (not Gmail, Yahoo, etc.)
- Code expires in 5 minutes
- Limited to 5 attempts per hour

---

### 🔷 DNS Verification (Most Trusted)

**Best for:** Companies that want the highest level of verification and have access to their DNS settings.

**Time Required:** 10-30 minutes (depending on DNS propagation)  
**Trust Level:** High  
**Badge:** Green "DNS Verified" badge with checkmark

**How it works:**
1. Enter your company domain (e.g., yourcompany.com)
2. Copy the generated TXT record
3. Add the TXT record to your DNS settings
4. Wait 5-10 minutes for DNS propagation
5. Click "Verify DNS"
6. Done! Your token will show the "DNS Verified" badge

**Requirements:**
- Access to your domain's DNS settings
- Ability to add TXT records
- Time for DNS propagation (usually 5-10 minutes, can take up to 48 hours)

---

## Step-by-Step Guide

### Email Verification

#### Step 1: Start Verification
When creating your token, after filling in company details, you'll see the verification modal with two tabs. Select the **Email** tab.

#### Step 2: Enter Company Email
Enter your company email address. Make sure it's:
- A valid email format
- Using your company domain (not a free provider like Gmail)
- An address you have access to

Example: `contact@acmecorp.com` ✅  
Not: `johndoe@gmail.com` ❌

#### Step 3: Send Code
Click **"Send Verification Code"**. You should receive an email within seconds.

#### Step 4: Enter Code
Check your email inbox for a message from StartupSparta. Enter the 6-digit code in the modal. The code will expire in 5 minutes.

**Pro Tip:** The code auto-submits when you enter all 6 digits!

#### Step 5: Success!
You'll see a success message and your token will be marked as "Email Verified" with a blue badge.

---

### DNS Verification

#### Step 1: Start Verification
In the verification modal, select the **DNS** tab.

#### Step 2: Enter Domain
Enter your company's domain name without "www" or "https://".

Example: `acmecorp.com` ✅  
Not: `https://www.acmecorp.com` ❌

#### Step 3: Generate TXT Record
Click **"Generate TXT Record"**. You'll see a record like:
```
startupsparta-verify=abc123def456...
```

#### Step 4: Add to DNS
1. Log in to your DNS provider (examples below)
2. Navigate to DNS settings
3. Add a new TXT record:
   - **Type:** TXT
   - **Name:** @ (or leave blank for root domain)
   - **Value:** `startupsparta-verify=abc123def456...` (paste the full value)
   - **TTL:** 3600 (or default)

#### Step 5: Wait for Propagation
DNS changes can take 5-10 minutes to propagate. In rare cases, it can take up to 48 hours.

**Pro Tip:** You can check DNS propagation using online tools like https://www.whatsmydns.net/

#### Step 6: Verify
Click **"Verify DNS"** in the modal. If the TXT record is found, you'll get instant verification!

#### Step 7: Success!
You'll see a success message and your token will be marked as "DNS Verified" with a green badge and checkmark.

---

## DNS Provider Guides

### Cloudflare
1. Log in to Cloudflare
2. Select your domain
3. Go to **DNS** tab
4. Click **Add record**
5. Select **TXT** type
6. Name: `@`
7. Content: Paste the verification string
8. Click **Save**

### GoDaddy
1. Log in to GoDaddy
2. Go to **My Products**
3. Click **DNS** next to your domain
4. Click **Add** under Records
5. Type: **TXT**
6. Host: `@`
7. TXT Value: Paste the verification string
8. Click **Save**

### Namecheap
1. Log in to Namecheap
2. Go to **Domain List**
3. Click **Manage** for your domain
4. Go to **Advanced DNS**
5. Click **Add New Record**
6. Type: **TXT Record**
7. Host: `@`
8. Value: Paste the verification string
9. Click the checkmark to save

### Google Domains
1. Log in to Google Domains
2. Select your domain
3. Click **DNS** on the left
4. Scroll to **Custom resource records**
5. Name: `@`
6. Type: **TXT**
7. Data: Paste the verification string
8. Click **Add**

---

## Troubleshooting

### Email Verification Issues

**"Invalid email format"**
- Make sure your email follows the format: name@domain.com
- No spaces or special characters

**"Please use a company email address"**
- You must use your company domain, not Gmail, Yahoo, Outlook, etc.
- Example: Use `contact@yourcompany.com`, not `you@gmail.com`

**"Verification code has expired"**
- Codes expire after 5 minutes for security
- Request a new code by clicking "Resend Code"

**"Too many verification attempts"**
- Rate limited to 5 attempts per hour per domain
- Wait an hour and try again

**Didn't receive the email?**
- Check your spam/junk folder
- Verify the email address is correct
- Wait a minute and try resending

---

### DNS Verification Issues

**"DNS TXT record not found"**
- Wait longer for DNS propagation (try again in 10-15 minutes)
- Verify you added the record correctly
- Make sure you used `@` or left the host field blank (for root domain)
- Check the TXT value is exactly as provided (no spaces or line breaks)

**"Invalid domain format"**
- Use only the domain name: `example.com`
- Don't include `www`, `https://`, or paths
- Make sure the domain is active and resolves

**DNS changes not propagating?**
- Most DNS changes propagate in 5-10 minutes
- Can take up to 48 hours in rare cases
- Clear your DNS cache locally: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)
- Use https://www.whatsmydns.net/ to check propagation globally

**Multiple domains or subdomains?**
- Verify the exact domain you want to use
- For subdomains, you may need to add the record to that specific subdomain
- Typically you want to verify your main domain (e.g., `company.com`, not `www.company.com`)

---

## FAQs

**Q: Which verification method should I choose?**  
A: Email verification is quick (under 2 minutes) and good for most companies. DNS verification provides the highest trust level and is recommended if you have time and DNS access.

**Q: Can I change my verification method later?**  
A: Yes! You can upgrade from email to DNS verification at any time. Contact support to switch.

**Q: Will my verification expire?**  
A: No, verification is permanent once completed. However, we may periodically re-verify domains to ensure continued ownership.

**Q: Can I verify multiple tokens for the same company?**  
A: Yes! Once a domain is verified, all tokens created with that domain will show as verified.

**Q: What if I don't have access to company email or DNS?**  
A: You can still create a token without verification. Verification is optional but highly recommended for building trust.

**Q: Is verification required?**  
A: No, verification is optional. However, verified companies get better visibility and more trust from investors.

**Q: How do I remove the verification TXT record after verification?**  
A: We recommend keeping the TXT record active to maintain verification status. However, if you need to remove it, verification will still show for existing tokens.

---

## Support

Need help with verification?

- Check the troubleshooting section above
- Review your DNS provider's documentation
- Use online DNS tools to verify your records
- Contact StartupSparta support with your domain name and issue

**Remember:** Verification is optional but highly recommended for building trust with your community and investors!
