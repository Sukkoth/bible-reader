import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant={"outline"}
      size={"icon"}
      className='size-10 shadow-none'
      onClick={() => navigate(-1)}
    >
      <ChevronLeft />
    </Button>
  );
}

export default BackButton;
