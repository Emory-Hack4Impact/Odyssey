"use server"

import { useUser } from "@/utils/supabase/server";

const getUser = async () => {
  
    let res = await useUser()

    console.log(res)

    return (
        <h1 className="text-2xl">
            {`HR Services for ${res}`}
        </h1>
    )

};

export const title = await getUser()
