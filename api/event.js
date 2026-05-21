const PIXEL_ID = '1952296722140349';
const ACCESS_TOKEN = 'EAAgUbSSATSsBRnZAHY1uar5YP0If2zkNQjqLZAn1hKFHam5U4JHYUZBH1TLqVoDtDdtjvZBWlmZA5szUXwz0h0SSfZAnIVq21msqmieXWEd9DlZB2EirOZAsWZC6tJCpIbXPnLfw7qaS21QRSB42qZC2ZBgTZBwPOoGi7I751dOZCe7Pl5wjZCsVc5b1foZCHBMDj3ZBHQZDZD';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { event_name, event_url, client_ip, client_user_agent } = req.body;

    const payload = {
      data: [
        {
          event_name: event_name || 'PageView',
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: event_url || 'https://landing-amaranth.vercel.app',
          action_source: 'website',
          user_data: {
            client_ip_address: client_ip || req.headers['x-forwarded-for'] || '0.0.0.0',
            client_user_agent: client_user_agent || req.headers['user-agent'] || '',
          },
        },
      ],
    };

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    return res.status(200).json({ success: true, result });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
