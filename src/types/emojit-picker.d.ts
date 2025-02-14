declare namespace JSX {
    interface IntrinsicElements {
        'emoji-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}

declare module 'emoji-picker-react' {
    import React from 'react';
    const Picker: React.FC<{
        onEmojiClick: (event: any, emojiObject: { emoji: string }) => void;
    }>;
    export default Picker;
}
