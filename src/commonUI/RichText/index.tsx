import { useEffect } from 'react';

interface RichTextProps {
    key?: string;
    editorValue?: string;
    placeholder?: string;
    className?: string;
    onChange?: (value: string) => void;
    dependency?: boolean;
}

const RichText: React.FC<RichTextProps> = ({
    key,
    editorValue,
    className,
    onChange,
    dependency = false
}) => {
    const uniqueId = `rich-text-editor-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    useEffect(() => {
        // @ts-ignore
        if (typeof window.RichTextEditor === 'function') {
            // @ts-ignore
            const rte = new RichTextEditor(uniqueId);
            rte.setHTMLCode(editorValue || "");

            rte.attachEvent('change', () => {
                onChange && onChange(rte.getHTMLCode());
            });

            const editorElement = document.getElementById(uniqueId);
            if (editorElement) {
                editorElement.addEventListener('input', () => {
                    onChange && onChange(rte.getHTMLCode());
                });
            }
        } else {
            console.error('RichTextEditor is not loaded or not a constructor');
        }

        return () => {
            const editorElement = document.getElementById(uniqueId);
            if (editorElement) {
                editorElement.removeEventListener('input', () => { });
            }
        };
    }, dependency ? [editorValue] : []);

    return (
        <div id={uniqueId} className={className}></div>
    );
}

export default RichText;
