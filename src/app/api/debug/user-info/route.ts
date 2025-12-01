import { NextRequest, NextResponse } from "next/server";
import { createClient, getUser } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const supabase = createClient();
    
    // Get UserMetadata
    const { data: userData, error: userError } = await supabase
      .from("UserMetadata")
      .select("*")
      .eq("id", user.id)
      .single();

    return NextResponse.json({
      authUser: {
        id: user.id,
        email: user.email,
      },
      userMetadata: userData || null,
      userMetadataError: userError?.message || null,
      isAdmin: userData?.is_admin ?? false,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
