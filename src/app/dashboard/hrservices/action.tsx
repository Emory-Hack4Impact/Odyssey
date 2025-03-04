"use server";

import { useUser } from "@/utils/supabase/server";

const GetUser = async () => {
  const res = await useUser();

  console.log(res);

  return res ? (
    <h1 className="text-2xl">{`HR Services for ${res.email}`}</h1>
  ) : (
    <h1 className="text-2xl">{`HR Services`}</h1>
  );
};

export const title = await GetUser();
