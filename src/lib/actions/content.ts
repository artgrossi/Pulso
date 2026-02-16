'use server';

import { createClient } from '@/lib/supabase/server';
import { getStreakMultiplier } from '@/lib/constants';

export async function completeContent(contentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Check if already completed
  const { data: existing } = await supabase
    .from('user_content_progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('content_id', contentId)
    .single();

  if (existing) {
    return { alreadyCompleted: true, coinsEarned: 0 };
  }

  // Get content details
  const { data: content } = await supabase
    .from('daily_content')
    .select('coins_reward')
    .eq('id', contentId)
    .single();

  if (!content) {
    throw new Error('Content not found');
  }

  // Get streak for multiplier
  const { data: streak } = await supabase
    .from('user_streaks')
    .select('current_streak')
    .eq('user_id', user.id)
    .single();

  const multiplier = getStreakMultiplier(streak?.current_streak ?? 0);
  const coinsEarned = Math.round(content.coins_reward * multiplier);

  // Record progress
  await supabase.from('user_content_progress').insert({
    user_id: user.id,
    content_id: contentId,
    coins_earned: coinsEarned,
  });

  // Add to coins ledger
  await supabase.from('coins_ledger').insert({
    user_id: user.id,
    amount: coinsEarned,
    source_type: 'content_completion',
    source_id: contentId,
    description: `Conteúdo completado (${multiplier}x multiplicador)`,
    is_convertible: true,
  });

  // Update profile coins
  const { data: profile } = await supabase
    .from('profiles')
    .select('total_coins, convertible_coins, current_track_id')
    .eq('id', user.id)
    .single();

  if (profile) {
    // Check if track is convertible
    const { data: track } = await supabase
      .from('tracks')
      .select('coins_convertible')
      .eq('id', profile.current_track_id!)
      .single();

    await supabase.from('profiles').update({
      total_coins: (profile.total_coins ?? 0) + coinsEarned,
      convertible_coins: track?.coins_convertible
        ? (profile.convertible_coins ?? 0) + coinsEarned
        : profile.convertible_coins ?? 0,
    }).eq('id', user.id);
  }

  // Update streak
  await updateStreak(user.id);

  return { alreadyCompleted: false, coinsEarned };
}

export async function submitQuizAttempt(
  quizId: string,
  answers: number[],
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  // Get quiz questions
  const { data: questions } = await supabase
    .from('quiz_questions')
    .select('correct_option_index')
    .eq('quiz_id', quizId)
    .order('sort_order');

  if (!questions || questions.length === 0) {
    throw new Error('Quiz questions not found');
  }

  // Calculate score
  let score = 0;
  questions.forEach((q, i) => {
    if (answers[i] === q.correct_option_index) score++;
  });

  // Get quiz reward
  const { data: quiz } = await supabase
    .from('quizzes')
    .select('coins_reward')
    .eq('id', quizId)
    .single();

  const coinsEarned = score === questions.length ? (quiz?.coins_reward ?? 15) : 0;

  // Record attempt
  await supabase.from('quiz_attempts').insert({
    user_id: user.id,
    quiz_id: quizId,
    answers,
    score,
    total_questions: questions.length,
    coins_earned: coinsEarned,
  });

  if (coinsEarned > 0) {
    await supabase.from('coins_ledger').insert({
      user_id: user.id,
      amount: coinsEarned,
      source_type: 'quiz_completion',
      source_id: quizId,
      description: `Quiz completado (${score}/${questions.length})`,
      is_convertible: true,
    });

    const { data: profile } = await supabase
      .from('profiles')
      .select('total_coins, convertible_coins')
      .eq('id', user.id)
      .single();

    if (profile) {
      await supabase.from('profiles').update({
        total_coins: (profile.total_coins ?? 0) + coinsEarned,
        convertible_coins: (profile.convertible_coins ?? 0) + coinsEarned,
      }).eq('id', user.id);
    }
  }

  await updateStreak(user.id);

  return { score, total: questions.length, coinsEarned };
}

async function updateStreak(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: streak } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) {
    await supabase.from('user_streaks').insert({
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_activity_date: today,
      streak_multiplier: 1.0,
    });
    return;
  }

  // Already active today
  if (streak.last_activity_date === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let newStreak: number;
  if (streak.last_activity_date === yesterdayStr) {
    newStreak = streak.current_streak + 1;
  } else {
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, streak.longest_streak);
  const newMultiplier = getStreakMultiplier(newStreak);

  await supabase.from('user_streaks').update({
    current_streak: newStreak,
    longest_streak: newLongest,
    last_activity_date: today,
    streak_multiplier: newMultiplier,
  }).eq('user_id', userId);

  // Award streak bonus coins at milestones
  if ([7, 14, 30, 60, 90].includes(newStreak)) {
    const bonusCoins = newStreak * 5;
    await supabase.from('coins_ledger').insert({
      user_id: userId,
      amount: bonusCoins,
      source_type: 'streak_bonus',
      description: `Streak de ${newStreak} dias!`,
      is_convertible: true,
    });

    const { data: profile } = await supabase
      .from('profiles')
      .select('total_coins, convertible_coins')
      .eq('id', userId)
      .single();

    if (profile) {
      await supabase.from('profiles').update({
        total_coins: (profile.total_coins ?? 0) + bonusCoins,
        convertible_coins: (profile.convertible_coins ?? 0) + bonusCoins,
      }).eq('id', userId);
    }
  }
}
