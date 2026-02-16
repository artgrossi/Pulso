import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Sync full_name from auth metadata to profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name;
        if (fullName) {
          await supabase
            .from("profiles")
            .update({ full_name: fullName })
            .eq("id", user.id)
            .is("full_name", null);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/?error=auth`);
}
