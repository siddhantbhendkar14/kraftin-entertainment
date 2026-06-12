'use client';

import { useCallback, useEffect, useRef } from 'react';

type RichTextEditorProps = {
  name: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
  formId?: string;
};

export default function RichTextEditor({
  name,
  defaultValue = '',
  onChange,
  formId
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  const sync = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? '';
    if (hiddenRef.current) hiddenRef.current.value = html;
    onChange?.(html);
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current && defaultValue) {
      editorRef.current.innerHTML = defaultValue;
      if (hiddenRef.current) hiddenRef.current.value = defaultValue;
    }
  }, [defaultValue]);

  useEffect(() => {
    if (!formId) return;
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', sync);
    return () => form.removeEventListener('submit', sync);
  }, [formId, sync]);

  function exec(command: string, value?: string) {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    sync();
  }

  function insertLink() {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  }

  return (
    <div className="admin-editor">
      <div className="admin-editor-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" onClick={() => exec('bold')} aria-label="Bold">
          B
        </button>
        <button type="button" onClick={() => exec('italic')} aria-label="Italic">
          I
        </button>
        <button type="button" onClick={() => exec('underline')} aria-label="Underline">
          U
        </button>
        <button type="button" onClick={() => exec('formatBlock', 'h2')} aria-label="Heading">
          H2
        </button>
        <button type="button" onClick={() => exec('insertUnorderedList')} aria-label="Bullet list">
          • List
        </button>
        <button type="button" onClick={() => exec('insertOrderedList')} aria-label="Numbered list">
          1. List
        </button>
        <button type="button" onClick={insertLink} aria-label="Insert link">
          Link
        </button>
        <button type="button" onClick={() => exec('removeFormat')} aria-label="Clear formatting">
          Clear
        </button>
      </div>
      <div
        ref={editorRef}
        className="admin-editor-area"
        contentEditable
        role="textbox"
        aria-multiline="true"
        onInput={sync}
        suppressContentEditableWarning
      />
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />
    </div>
  );
}
