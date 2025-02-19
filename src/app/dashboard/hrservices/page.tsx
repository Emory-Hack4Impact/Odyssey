"use client"

import { SubNavBar } from "@/components/NavBar";
import { useUser } from "@/utils/supabase/server";
import { HRServices } from "./HRServices";

export default async function hrservices() {
  const user = useUser();

  return (
    <>
      <HRServices prop/>
    </>
  );
}
