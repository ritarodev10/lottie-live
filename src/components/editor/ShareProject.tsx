import { Button } from "../../components/ui/button";
import { Share2Icon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { useLocation } from "react-router-dom";

const ShareProject = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get("projectId");

  const handleCopyClick = () => {
    if (projectId) {
      const url = `${window.location.origin}/?projectId=${projectId}`;
      navigator.clipboard.writeText(url).catch((err) => {
        console.error("Failed to copy the URL: ", err);
      });
    }
  };

  return (
    <>
      <div className="col-span-1 row-span-1 row-start-1"></div>
      <div className="col-span-5 row-span-1 row-start-1 m-auto">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button onClick={handleCopyClick} className="bg-gray-700">
              <Share2Icon size={16} className="mr-2" />
              Share Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Project Url Copied!</AlertDialogTitle>
              <AlertDialogDescription>
                Share project to new user simply by open the project url on new
                tab.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Okay</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="col-span-1 row-span-1 row-start-1"></div>
    </>
  );
};

export default ShareProject;
