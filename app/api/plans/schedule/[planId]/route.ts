import { createClient } from "@/utils/supabase/server";
import { CREATE_PLAN_SCHEDULE } from "@/utils/supabase/services";

export async function POST(request: Request) {
  try {
    const {
      data: { user },
      error,
    } = await createClient().auth.getUser();

    if (error || !user?.id) {
      return Response.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }
    const formData = await request.json();

    const data = await CREATE_PLAN_SCHEDULE(formData, user.id);

    return Response.json(
      {
        plan: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        message: "Could not create plan schedule",
      },
      {
        status: 500,
      }
    );
  }
}
