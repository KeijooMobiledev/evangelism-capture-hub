// src/components/ui/TiptapToolbar.tsx
import React from 'react';
import { type Editor } from '@tiptap/react';
import { Bold, Italic } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle'; // Utilisation du composant Toggle de Shadcn/ui

interface TiptapToolbarProps {
  editor: Editor | null;
}

const TiptapToolbar: React.FC<TiptapToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input bg-transparent rounded-md p-1 flex gap-1 mb-2">
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        aria-label="Toggle bold"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        aria-label="Toggle italic"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      {/* TODO: Ajouter d'autres boutons (listes, titres, etc.) si nécessaire */}
    </div>
  );
};

export default TiptapToolbar;
