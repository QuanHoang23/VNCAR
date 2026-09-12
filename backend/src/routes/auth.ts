import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from '../middleware/auth';
import { supabase } from '../config/supabase';

const router = Router();

router.post('/sync', verifyFirebaseToken, async (req: Request, res: Response): Promise<void> => {
  console.log(`\n[Auth Route] Received POST /sync request`);
  const user = req.user;

  if (!user) {
    console.log('[Auth Route] ❌ Sync failed: No user attached to request (Unauthorized).');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const { uid, phone_number, email, name, picture } = user;
    console.log(`[Auth Route] 🔄 Processing sync for UID: ${uid} | Phone: ${phone_number || 'N/A'}`);

    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: uid,
        phone_number: phone_number || null,
        email: email || null,
        display_name: name || null,
        photo_url: picture || null,
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[Auth Route] ❌ Supabase UPSERT Error:', error);
      throw error;
    }

    console.log(`[Auth Route] ✅ User synchronized successfully in Supabase:`, data);
    res.status(200).json({
      message: 'User synchronized successfully',
      user: data,
    });
  } catch (error: any) {
    console.error('Error syncing user to Supabase:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
