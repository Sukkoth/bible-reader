import { createClient } from "@/utils/supabase/server";
import { CREATE_PLAN } from "@/utils/supabase/services";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

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

    const plan = await CREATE_PLAN(
      formData,
      user?.id || "bd263354-b228-487b-a934-f7eed4fbbb52"
    );

    return Response.json({
      plan,
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        message: "Could not create Plan",
      },
      { status: 500 }
    );
  }
}
