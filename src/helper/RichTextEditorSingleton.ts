// RichTextEditorManager.ts
class RichTextEditorManager {
    private static editors: Map<HTMLElement, any> = new Map();

    static getEditor(container: HTMLElement): any {
        if (!this.editors.has(container)) {
            // @ts-ignore
            if (typeof window.RichTextEditor === 'function') {
                // @ts-ignore
                const rte = new window.RichTextEditor(container);
                this.editors.set(container, rte);
            } else {
                throw new Error('RichTextEditor is not loaded or not a constructor');
            }
        }
        return this.editors.get(container);
    }

    static cleanupEditor(container: HTMLElement): void {
        if (this.editors.has(container)) {
            const editor = this.editors.get(container);
            // Remove any event listeners here if necessary
            // Example: editor.removeEventListener('change', handler);
            this.editors.delete(container);
        }
    }
}

export default RichTextEditorManager;
