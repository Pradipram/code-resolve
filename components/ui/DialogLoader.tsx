import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "./alert-dialog";
import PageLoader from "./PageLoader";

interface DialogLoaderProps {
  text: string;
  open: boolean;
}

const DialogLoader: React.FC<DialogLoaderProps> = ({ text, open }) => {
  return (
    <AlertDialog open={open} onOpenChange={() => {}}>
      <AlertDialogContent>
        <AlertDialogTitle>
          <PageLoader text={text} />
        </AlertDialogTitle>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DialogLoader;
