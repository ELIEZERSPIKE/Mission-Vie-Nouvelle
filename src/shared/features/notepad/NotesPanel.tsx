// src/features/shared/notepad/NotesPanel.tsx
import { useState } from 'react';
import { NotebookPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { NotepadWidget } from './NotepadWidget';

export function NotesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <NotebookPen className="h-4 w-4" />
          Mes notes
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <NotepadWidget />
      </SheetContent>
    </Sheet>
  );
}