import type { IncomingMessage, ServerResponse } from 'node:http';
import { mrkBusiness } from '../../src/config/business.js';

export default async function handler(_req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  const providerConfigured = Boolean(
    (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0) ||
      (process.env.MRK_QUOTE_PROVIDER_URL && process.env.MRK_QUOTE_PROVIDER_URL.trim().length > 0)
  );

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      brandName: mrkBusiness.brandName,
      bookingMode: mrkBusiness.bookingMode,
      providerConfigured,
      deliveryEmail: mrkBusiness.enquiryEmail,
      directPhoneDisplay: mrkBusiness.phoneDisplay,
      directPhoneHref: mrkBusiness.phoneHref,
      timestamp: new Date().toISOString(),
    })
  );
}
