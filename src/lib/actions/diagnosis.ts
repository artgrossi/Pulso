'use server';

import { createClient } from '@/lib/supabase/server';
import { assignTrack, type TrackSlug } from '@/lib/types/database';
import { redirect } from 'next/navigation';

interface DiagnosisAnswers {
  has_overdue_debt: boolean;
  can_save_monthly: boolean;
  has_emergency_fund: boolean;
  knows_retirement_target: boolean;
  understands_pgbl_vgbl: boolean;
}

export async function submitDiagnosis(answers: DiagnosisAnswers) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  const assignedTrack: TrackSlug = assignTrack(answers);

  // Get the track ID
  const { data: track } = await supabase
    .from('tracks')
    .select('id')
    .eq('slug', assignedTrack)
    .single();

  if (!track) {
    throw new Error('Track not found');
  }

  // Save diagnosis responses
  const { error: diagnosisError } = await supabase
    .from('diagnosis_responses')
    .upsert({
      user_id: user.id,
      ...answers,
      assigned_track_slug: assignedTrack,
      raw_answers: answers,
    });

  if (diagnosisError) {
    throw new Error(`Failed to save diagnosis: ${diagnosisError.message}`);
  }

  // Update profile with assigned track
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      current_track_id: track.id,
      onboarding_completed: true,
    })
    .eq('id', user.id);

  if (profileError) {
    throw new Error(`Failed to update profile: ${profileError.message}`);
  }

  redirect('/dashboard');
}
