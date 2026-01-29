export class Cleaner {
    private static normalizationCache = new Map<string, string>();

    /**
     * Normalizes whitespace scories (BOM, nbsp, line breaks)
     */
    static normalize(text: string): string {
        if (!text) return '';

        const cached = this.normalizationCache.get(text);
        if (cached !== undefined) return cached;

        const normalized = text
            .replace(/\r\n/gm, '\n')
            .replace(/\uFEFF/gm, '')
            .replace(/\u00A0$/gm, '')
            .replace(/\u00A0/gm, ' ')
            .trim();

        if (this.normalizationCache.size > 200) {
            this.normalizationCache.clear();
        }
        this.normalizationCache.set(text, normalized);

        return normalized;
    }

    /**
     * Consistently strips quotes (>) and common Outlook leading indentation (4 spaces)
     */
    static stripQuotes(text: string): string {
        return text
            .replace(/^(>+)\s?$/gm, '') // Empty quote lines
            .replace(/^(>+)\s?/gm, '')  // Quote lines with content
            .replace(/^(\ {4})\s?/gm, ''); // 4 spaces indentation
    }

    /**
     * Robustly identifies the body after a header block by finding the 
     * first double-newline (or single if strict) after the last known header line.
     */
    static extractBody(lines: string[], lastHeaderIndex: number): string {
        // Crisp logic: looks for \n\n (start of next line being empty)
        // following the last header.

        let bodyStartIndex = lastHeaderIndex + 1;

        // Skip any empty lines immediately following headers to find the real body start
        while (bodyStartIndex < lines.length && lines[bodyStartIndex].trim() === '') {
            bodyStartIndex++;
        }

        return lines.slice(bodyStartIndex).join('\n').trim();
    }
}
