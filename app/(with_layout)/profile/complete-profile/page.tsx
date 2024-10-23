import CompleteProfile from "@/components/complete-profile/CompleteProfile";
import { GET_USER } from "@/utils/supabase/services";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bible Reader | Complete Profile",
  description: "Complete your profile",
};
async function CompleteProfilePage() {
  const { user, profile } = await GET_USER();
  return <CompleteProfile user={user!} profile={profile} />;
}

export default CompleteProfilePage;
