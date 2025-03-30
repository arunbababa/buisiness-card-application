import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// 昨日の日付（UTC基準）
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday.setUTCHours(0, 0, 0, 0); // 00:00:00 にリセット

async function cleanup() {
  console.log(`🔄 Deleting records before: ${yesterday.toISOString()}`);

  const { error: userErr } = await supabase
    .from('users')
    .delete()
    .lt('created_at', yesterday.toISOString());

  if (userErr) {
    console.error('❌ Failed to delete users:', userErr.message);
  } else {
    console.log('✅ Deleted from users');
  }

  const { error: skillErr } = await supabase
    .from('user_skill')
    .delete()
    .lt('created_at', yesterday.toISOString());

  if (skillErr) {
    console.error('❌ Failed to delete user_skill:', skillErr.message);
  } else {
    console.log('✅ Deleted from user_skill');
  }
}

cleanup();